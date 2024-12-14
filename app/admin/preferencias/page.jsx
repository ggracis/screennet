export async function generateMetadata() {
  return {
    title: `ScreenNet - Preferencias`,
  };
}
const Preferencias = async () => {
  return (
    <main>
      <div className="flex rounded-lg items-center">
        <div className="p-6">
          <p className="text-xl font-semibold my-2 underline decoration-sky-500 hover:decoration-4">
            ⚙️ Preferencias
          </p>
          <p className="text-lg">Ajustá todo a tu manera.</p>
        </div>
        <div className="p-6">
          <p className="text-sm">
            Configurá horarios, definí cada cuánto refrescar los productos y qué
            hacer si se cae Internet.
            <br /> También podés cambiar tu contraseña y otras preferencias
            generales del sistema.
          </p>
        </div>
      </div>
    </main>
  );
};
export default Preferencias;
