import HeaderSection from "@/components/admin/HeaderSection";

export async function generateMetadata() {
  return {
    title: `ScreenNet - Preferencias`,
  };
}
const Preferencias = async () => {
  return (
    <main>
      <HeaderSection
        title="⚙️ Preferencias"
        subtitle="Ajustá todo a tu manera"
        description={
          <>
            Configurá horarios, definí cada cuánto refrescar los productos y qué
            hacer si se cae Internet.
            <br /> También podés cambiar tu contraseña y otras preferencias
            generales del sistema.
          </>
        }
      />
    </main>
  );
};
export default Preferencias;
