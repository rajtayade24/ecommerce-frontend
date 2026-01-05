import { create } from 'zustand'

const useUserStore = create(
  (set, get) => ({
    currentProductForDetails: null,

    setCurrentProductDetails: (v) => set({currentProductForDetails: v}),

  })
)


export default useUserStore;