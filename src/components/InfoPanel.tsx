import { FC } from "react"

const InfoPanel: FC = () => {
  return (
    <div className="px-3 py-2 border border-gray-400 rounded-lg">
      <h3 className="text-2xl">UniMake Player</h3>
      <span>Web based Unipack player</span>

      <div className="mt-4 flex min-[320px]:flex-row flex-col gap-1">
        <span className="flex flex-row gap-1">
          commit:
          <code className="font-mono bg-zinc-700 py-0.5 px-1 rounded-sm text-sm">
            {__COMMIT_HASH__}
          </code>
        </span>
        <a
          href="https://github.com/comjun04/unimake-player"
          className="underline text-blue-500"
          target="_blank"
        >
          Source Code
        </a>
      </div>
    </div>
  )
}

export default InfoPanel
