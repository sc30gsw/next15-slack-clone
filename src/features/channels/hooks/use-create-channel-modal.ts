import { atom, useAtom } from 'jotai'

const modalAtom = atom(false)

export const useCreteChannelModal = () => {
  return useAtom(modalAtom)
}
