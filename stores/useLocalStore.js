import { create } from "zustand"; // Cambia a esta importación
import { persist } from "zustand/middleware";

const useLocalStore = create(
  persist(
    (set) => ({
      local: null,
      setLocal: (local) => set({ local }),
      getLocalId: () => set((state) => state.local?.id),
      updateLocal: (updatedLocal) =>
        set((state) =>
          state.local?.id === updatedLocal.id
            ? { local: updatedLocal }
            : state.local
        ),
      clearLocal: () => set({ local: null }),
    }),
    {
      name: "local-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useLocalStore;
