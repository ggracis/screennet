import { create } from "zustand";

const obtenerPlantillaSegunHorario = (horarios) => {
  const ahora = new Date();
  const dia = ahora.getDay().toString();
  const hora = `${ahora.getHours().toString().padStart(2, "0")}:${ahora
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  /* console.log("Hora actual:", hora);
  console.log("Día actual:", dia);
  console.log("Horarios configurados:", JSON.stringify(horarios, null, 2)); */

  for (const [key, config] of Object.entries(horarios)) {
    if (key === "default") continue;

    if (config.dias?.includes(dia)) {
      const [inicio, fin] = config.horas || [];
      // console.log(`Verificando horario ${key}:`, inicio, fin);

      if (inicio && fin && hora >= inicio && hora <= fin) {
        /*  console.log(
          `Horario encontrado: ${key}, plantilla: ${config.plantilla}`
        ); */
        return config.plantilla;
      }
    }
  }

  //console.log("Usando plantilla por defecto:", horarios.default.plantilla);
  return horarios.default.plantilla;
};

const useScreenStore = create((set, get) => ({
  pantalla: null,
  plantilla: null,
  lastUpdate: null,
  loading: false,
  error: null,
  pollingInterval: null,
  lastCheckedHorario: null,

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

  checkHorarioAndUpdate: async () => {
    const { pantalla } = get();
    if (!pantalla) return;

    const nuevoPlantillaId = obtenerPlantillaSegunHorario(
      pantalla.attributes.plantilla_horario
    );

    // Si la plantilla actual es diferente a la que corresponde según el horario
    if (get().plantilla?.id !== nuevoPlantillaId) {
      //console.log("Cambiando a plantilla:", nuevoPlantillaId);
      const plantillaResponse = await fetch(
        `/api/plantillas/${nuevoPlantillaId}?timestamp=${Date.now()}`
      );
      const { plantilla } = await plantillaResponse.json();
      set({ plantilla });
    }
  },

  initializePolling: (pantallaId) => {
    // Polling principal cada 10 minutos
    const mainPolling = setInterval(() => {
      get().fetchScreenData(pantallaId);
    }, 10 * 60 * 1000);

    // Verificación de horario cada minuto
    const horarioPolling = setInterval(() => {
      get().checkHorarioAndUpdate();
    }, 60 * 1000); // cada minuto

    set({
      pollingInterval: {
        main: mainPolling,
        horario: horarioPolling,
      },
    });
  },

  cleanup: () => {
    const { pollingInterval } = get();
    if (pollingInterval) {
      clearInterval(pollingInterval.main);
      clearInterval(pollingInterval.horario);
      set({ pollingInterval: null });
    }
  },
}));

export default useScreenStore;