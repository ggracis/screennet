import { create } from "zustand";

const obtenerPlantillaSegunHorario = (horarios) => {
  const ahora = new Date();
  const dia = ["0", "1", "l", "m", "x", "j", "v"][ahora.getDay()];
  const hora = `${ahora.getHours().toString().padStart(2, "0")}:${ahora
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  for (const config of Object.values(horarios)) {
    if (config.dias?.includes(dia)) {
      const [inicio, fin] = config.horas || [];
      if (!inicio || !fin || (hora >= inicio && hora <= fin)) {
        return config.plantilla;
      }
    }
  }

  return horarios.default.plantilla;
};

const useScreenStore = create((set, get) => ({
  pantalla: null,
  plantilla: null,
  lastUpdate: null,
  loading: false,
  error: null,
  pollingInterval: null,

  fetchScreenData: async (pantallaId) => {
    try {
      set({ loading: true });

      const pantallaRes = await fetch(
        `/api/pantallas/${pantallaId}?timestamp=${Date.now()}`
      );

      if (!pantallaRes.ok) {
        throw new Error("Error al obtener datos de pantalla");
      }

      const { pantalla } = await pantallaRes.json();

      // Obtener el ID de la plantilla actual según el horario
      const plantillaId = obtenerPlantillaSegunHorario(
        pantalla.attributes.plantilla_horario
      );

      // Obtener datos de la plantilla
      const plantillaResponse = await fetch(
        `/api/plantillas/${plantillaId}?timestamp=${Date.now()}`
      );
      const { plantilla } = await plantillaResponse.json();

      set({
        pantalla,
        plantilla,
        lastUpdate: new Date(),
        loading: false,
        error: null,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  initializePolling: (pantallaId) => {
    const polling = setInterval(() => {
      get().fetchScreenData(pantallaId);
    }, 10 * 60 * 1000); // 10 minutos

    set({ pollingInterval: polling });
  },

  cleanup: () => {
    const { pollingInterval } = get();
    if (pollingInterval) {
      clearInterval(pollingInterval);
      set({ pollingInterval: null });
    }
  },
}));

export default useScreenStore;
