import { useState } from "react"
import { BlobReader, ZipReader, TextWriter, BlobWriter } from "@zip.js/zip.js"
import { Howl } from "howler"
import type { TAutoplayData } from "@/types"

export interface IProcessStatus {
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

// hook
const useProcessPack = () => {
  const [status, setStatus] = useState<IProcessStatus>({
    step: 0,
    state: "not_running",
  })
  const [processing, setProcessing] = useState(false)

  const clear = () => {
    setStatus({
      step: 0,
      state: "not_running",
    })
  }

  const processPack: (file: File) => Promise<IPackData | undefined> = async (
    file
  ) => {
    if (processing) return
    setProcessing(true)

    setStatus({ step: 1, state: "prepare" })

    const reader = new ZipReader(new BlobReader(file))
    const zipData = await reader.getEntries()
    console.log(zipData)

    setStatus({ step: 2, state: "parse_info" })

    const infoFile = zipData.find((entry) =>
      possibleInfoFileNames.includes(entry.filename)
    )
    if (!infoFile) {
      throw new Error("'info' file does not exist")
    }

    const infoFileString = await infoFile.getData?.(new TextWriter())
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
    setStatus({ step: 3, state: "parse_keySound" })

    const keySoundFile = zipData.find((entry) => entry.filename === "keySound")
    if (!keySoundFile) {
      throw new Error("'keySound' file does not exist")
    }

    const keySoundFileStr = await keySoundFile.getData?.(new TextWriter())
    if (!keySoundFileStr) {
      throw new Error("'keySound' file exists but cannot read data from it")
    }

    const keySoundData = parseKeySound(keySoundFileStr)
    console.log(keySoundData)

    // 4. load sound file
    setStatus({
      step: 4,
      state: "load_sound",
      partCurrent: 0,
      partTotal: keySoundData.sounds.length,
    })

    // sounds folder name can be `sounds` or `Sounds`
    const soundObjects = new Map<string, Howl>()

    let soundCnt = 0
    for await (const soundName of keySoundData.sounds) {
      setStatus({
        step: 4,
        state: "load_sound",
        partCurrent: ++soundCnt,
        partTotal: keySoundData.sounds.length,
      })

      // TODO: 성능최적화 필요 (한 파일 찾는데 find() 함수로 배열을 다 뒤지고 있음)
      const file = zipData.find((entry) =>
        RegExp(`^[Ss]ounds/${soundName}$`).test(entry.filename)
      )
      if (!file) {
        throw new Error("sound file does not exist: " + soundName)
      }

      const soundBlob = await file.getData?.(new BlobWriter())
      if (!soundBlob) {
        throw new Error("cannot unzip sound file: " + soundName)
      }

      const soundObj = await loadSound(soundName, soundBlob)
      soundObjects.set(soundName, soundObj)
    }

    // TODO: loading LED

    // 5. parse 'autoPlay' file
    setStatus({
      step: 5,
      state: "parse_autoPlay",
    })

    const autoplayFile = zipData.find((entry) =>
      possibleAutoplayFileNames.includes(entry.filename)
    )
    if (!autoplayFile) {
      throw new Error("'autoPlay' file does not exist")
    }

    const autoPlayFileStr = await autoplayFile.getData?.(new TextWriter())
    if (!autoPlayFileStr) {
      throw new Error("'info' file exists but cannot read data from it")
    }

    const autoplayData = parseAutoplay(autoPlayFileStr)
    console.log(autoplayData)

    // ====================

    setProcessing(false)
    setStatus({
      step: 100,
      state: "done",
    })
    return {
      info: infoData,
      sounds: {
        mappings: keySoundData.mappings,
        howlers: soundObjects,
      },
      autoplay: autoplayData,
    }
  }

  return { processPack, status, clear }
}

export default useProcessPack
