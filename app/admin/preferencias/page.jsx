export async function generateMetadata() {
  return {
    title: `ScreenNet - Preferencias`,
  };
}
const Preferencias = async () => {
  return (
    <>
      <h2 className="mt-4 text-center text-xl font-semibold my-2 underline decoration-sky-500 hover:decoration-4">
        Preferencias
      </h2>
      <div className="p-6 m-4 rounded-lg border w-min mx-auto">
        <p>Aca deben ir las preferencias</p>
      </div>
    </>
  );
};
export default Preferencias;
