import JSZip from "jszip"
import { TAutoplayData } from "./types"
import { Howl } from "howler"

type TCustomEventData = {
  step: number
  state: string
  partCurrent?: number
  partTotal?: number
}

export interface IPackData {
  info: Record<string, string>
  sounds: {
    mappings: IKeySoundData["mappings"]
    howlers: Map<string, Howl>
  }
  autoplay: TAutoplayData[]
}

interface IKeySoundData {
  sounds: string[]
  mappings: Map<
    string,
    {
      soundName: string
      repeat: number
      gotoChain: number | null
    }[]
  >
}

const possibleInfoFileNames = ["info", "Info"]
const requiredInfoKeys = [
  "title",
  "producerName",
  "buttonX",
  "buttonY",
  "chain",
]
const possibleAutoplayFileNames = ["autoplay", "autoPlay"]

const autoplayRegex = new Map([
  ["chain", /^c(?:hain)? ([1-8])$/],
  ["on", /^on? ([1-8]) ([1-8])$/],
  ["off", /^(?:of)?f ([1-8]) ([1-8])$/],
  ["touch", /^t(?:ouch)? ([1-8]) ([1-8])$/],
  ["delay", /^d(?:elay)? (\d+)$/],
])

function findAvailableFile(zip: JSZip, fileNames: string[]) {
  for (const name of fileNames) {
    const file = zip.file(name)
    if (file != null) return file
  }
}

function parseInfo(str: string) {
  const data: Record<string, string> = {}
  const lines = str.split("\n")

  lines.forEach((l) => {
    const line = l.trim()
    if (line.length < 1) return

    const match = /^([a-z0-9]+)=(.+)$/i.exec(line)
    if (match == null) {
      // ignore line if not following rule
      return
    }

    const [_, key, value] = match
    if (data[key] != null) {
      throw new Error("duplicated keys in info metadata")
    }

    data[key] = value
  })

  return data
}

function parseKeySound(str: string) {
  const data: IKeySoundData = { mappings: new Map(), sounds: [] }

  const lines = str.split("\n")
  lines.forEach((l, idx) => {
    const line = l.trim()
    if (line.length < 1) return

    /*
     * <chain> <x> <y> <filename> <repeat> <goto_chain>
     * x = row (vertical position)
     * y = column (horizontial position)
     * repeat = repeat count (0 = play on buttonDown, stop on buttonUp)
     * goto_chain: goto specific chain

     * ex: `1 2 3 1 001.wav 1 2`
     * chain 1 button (2, 3) file: 001.wav
     * repeat 1 time, goto chain 2
     */

    const match =
      /^([1-8]) ([1-8]) ([1-8]) ([\w.]+)(?: (\d)(?: ([1-8]))?)?$/.exec(line)
    if (match == null) {
      throw new Error(`bad keySound syntax on line ${idx}: ${line}`)
    }

    const [_, chain, x, y, soundName, repeatStr = "1", gotoChainStr = null] =
      match
    const repeat = parseInt(repeatStr)
    const gotoChain = gotoChainStr != null ? parseInt(gotoChainStr) : null

    const mappingKey = `${chain} ${x} ${y}`
    const mappingObj = { soundName, repeat, gotoChain }
    if (data.mappings.has(mappingKey)) {
      data.mappings.get(mappingKey)?.push(mappingObj)
    } else {
      data.mappings.set(mappingKey, [mappingObj])
    }

    if (!data.sounds.includes(soundName)) {
      data.sounds.push(soundName)
    }
  })

  return data
}

// async function
function loadSound(name: string, file: Blob) {
  return new Promise<Howl>(async (resolve, reject) => {
    const blobUrl = URL.createObjectURL(file)

    const sound = new Howl({
      src: [blobUrl],
      format: "wav", // TODO: detect from sound name
      preload: true,
    })

    sound.once("load", () => {
      URL.revokeObjectURL(blobUrl)
      resolve(sound)
    })
    sound.once("loaderror", (_id, err) => {
      URL.revokeObjectURL(blobUrl)

      console.error(_id, err)
      reject(new Error(`failed to load sound '${name}': ${err}`))
    })
  })
}

function parseAutoplay(str: string) {
  const data: TAutoplayData[] = []

  const lines = str.split("\n")
  lines.forEach((l, lineNo) => {
    const line = l.trim()
    if (line.length < 1) return

    let mode = ""
    if (line.startsWith("c ") || line.startsWith("chain ")) {
      mode = "chain"
    } else if (line.startsWith("o ") || line.startsWith("on ")) {
      mode = "on"
    } else if (line.startsWith("f ") || line.startsWith("off ")) {
      mode = "off"
    } else if (line.startsWith("t ") || line.startsWith("touch ")) {
      mode = "touch"
    } else if (line.startsWith("d ") || line.startsWith("delay ")) {
      mode = "delay"
    } else {
      throw new Error(`unknown autoplay syntax on line ${lineNo}: ${line}`)
    }

    const regex = autoplayRegex.get(mode)!
    const match = regex.exec(line)
    if (!match) {
      throw new Error(`unknown autoplay syntax on line ${lineNo}: ${line}`)
    }

    switch (mode) {
      case "chain": {
        const [_, chain] = match
        data.push({
          type: "chain",
          chain: parseInt(chain),
        })
        break
      }

      case "delay": {
        const [_, delay] = match
        data.push({
          type: "delay",
          delay: parseInt(delay),
        })
        break
      }

      case "on":
      case "off":
      case "touch": {
        const [_, x, y] = match
        data.push({
          type: mode,
          x: parseInt(x),
          y: parseInt(y),
        })
      }
    }
  })

  return data
}

export default class PackLoader extends EventTarget {
  _running: boolean
  _result?: IPackData

  constructor() {
    super()

    this._running = false
  }

  get result() {
    return this._result
  }

  emit(eventName: string, data: TCustomEventData) {
    const event = new CustomEvent(eventName, { detail: data })
    setTimeout(() => this.dispatchEvent(event), 0)
  }

  process(file: File) {
    if (this._running) return

    this.emit("start", {
      step: 0,
      state: "idle",
    })
    this._run(file)
      .then((packData) => {
        this._result = packData
        this._running = false

        this.emit("done", {
          step: 100,
          state: "done",
        })
      })
      .catch((er) => {
        window.alert(er)
        throw er
      })
  }

  async _run(file: File): Promise<IPackData> {
    // 1. prepare file
    this.emit("progress", { step: 1, state: "prepare" })
    const zip = await JSZip.loadAsync(file, { createFolders: true })

    // 2.
    this.emit("progress", { step: 2, state: "parse_info" })

    const infoFile = findAvailableFile(zip, possibleInfoFileNames)
    if (!infoFile) {
      throw new Error("'info' file does not exist")
    }

    const infoFileString = await infoFile.async("string")
    if (!infoFileString) {
      throw new Error("'info' file exists but cannot read data from it")
    }

    const infoData = parseInfo(infoFileString)
    console.log(infoData)
    const requiredInfoKeysExist = requiredInfoKeys.every(
      (key) => key in infoData
    )
    if (!requiredInfoKeysExist) {
      throw new Error("required keys missing in info metadata")
    }

    // 3. parse 'keySound' file
    this.emit("progress", { step: 3, state: "parse_keySound" })

    const keySoundFile = findAvailableFile(zip, ["keySound"])
    if (!keySoundFile) {
      throw new Error("'keySound' file does not exist")
    }

    const keySoundFileStr = await keySoundFile.async("string")
    if (!keySoundFileStr) {
      throw new Error("'keySound' file exists but cannot read data from it")
    }

    const keySoundData = parseKeySound(keySoundFileStr)
    console.log(keySoundData)

    // 4. load sound file
    this.emit("progress", {
      step: 4,
      state: "load_sound",
      partCurrent: 0,
      partTotal: keySoundData.sounds.length,
    })

    // sounds folder name can be `sounds` or `Sounds`
    const soundObjects = new Map<string, Howl>()

    const soundsFolderObj = zip.folder(/^[Ss]ounds\/$/)[0]
    if (soundsFolderObj == null || !soundsFolderObj.dir) {
      throw new Error("`sounds` folder does not exist")
    }
    const soundsFolder = zip.folder(soundsFolderObj.name)!

    let soundCnt = 0
    for await (const soundName of keySoundData.sounds) {
      this.emit("progress", {
        step: 4,
        state: "load_sound",
        partCurrent: ++soundCnt,
        partTotal: keySoundData.sounds.length,
      })

      // TODO: 성능최적화 필요 (한 파일 찾는데 find() 함수로 배열을 다 뒤지고 있음)
      const file = soundsFolder.file(soundName)
      if (!file) {
        throw new Error("sound file does not exist: " + soundName)
      }

      const soundBlob = await file.async("blob")
      if (!soundBlob) {
        throw new Error("cannot unzip sound file: " + soundName)
      }

      const soundObj = await loadSound(soundName, soundBlob)
      soundObjects.set(soundName, soundObj)
    }

    // TODO: loading LED

    // 5. parse 'autoPlay' file
    this.emit("progress", {
      step: 5,
      state: "parse_autoPlay",
    })

    const autoplayFile = findAvailableFile(zip, possibleAutoplayFileNames)
    if (!autoplayFile) {
      throw new Error("'autoPlay' file does not exist")
    }

    const autoPlayFileStr = await autoplayFile.async("text")
    if (!autoPlayFileStr) {
      throw new Error("'info' file exists but cannot read data from it")
    }

    const autoplayData = parseAutoplay(autoPlayFileStr)
    console.log(autoplayData)

    // ========================

    return {
      info: infoData,
      sounds: {
        mappings: keySoundData.mappings,
        howlers: soundObjects,
      },
      autoplay: autoplayData,
    }
  }
}
