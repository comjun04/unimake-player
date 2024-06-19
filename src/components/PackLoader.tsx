import { FC, useEffect } from 'react'

import useProcessPack, { IPackData } from '@/hooks/useProcessPack'

import PackLoadModal from './PackLoadModal'

type PackLoaderProps = {
  showModal: boolean
  handleModalClose: () => void
  onLoadComplete: (packData: IPackData) => void
}

/**
 * App에서 pack loading을 분리하기 위해 존재하는 컴포넌트.
 *
 * App에서 useProcessPack hook을 사용하게 되면 App 전체가 리렌더링을 수행하면서
 * 렌더링이 필요 없는 Pad 컴포넌트까지 리렌터링을 실시하는 바람에 성능이 저하되므로 이를 방지하기 위해 분리
 */
const PackLoader: FC<PackLoaderProps> = ({
  showModal,
  handleModalClose,
  onLoadComplete,
}) => {
  const { status, processPack, clear } = useProcessPack()

  const handleLoadPack = async (file: File) => {
    const data = await processPack(file)
    if (data) {
      onLoadComplete(data)
    }
  }

  // pack load dialog 열릴 때 로딩 상태 초기화
  useEffect(() => {
    if (showModal) {
      clear()
    }
  }, [showModal])

  return (
    <PackLoadModal
      show={showModal}
      handleClose={handleModalClose}
      handleLoadPack={handleLoadPack}
      packLoadStatus={status}
    />
  )
}

export default PackLoader
