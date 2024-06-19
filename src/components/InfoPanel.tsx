import { FC } from 'react'

const InfoPanel: FC = () => {
  return (
    <div className="rounded-lg border border-gray-400 px-3 py-2">
      <h3 className="text-2xl">UniMake Player</h3>
      <span>Web based Unipack player</span>

      <div className="mt-4 flex flex-col gap-1 min-[320px]:flex-row">
        <span className="flex flex-row gap-1">
          commit:
          <code className="rounded-sm bg-zinc-700 px-1 py-0.5 font-mono text-sm">
            {__COMMIT_HASH__}
          </code>
        </span>
        <a
          href="https://github.com/comjun04/unimake-player"
          className="text-blue-500 underline"
          target="_blank"
        >
          Source Code
        </a>
      </div>
    </div>
  )
}

export default InfoPanel
