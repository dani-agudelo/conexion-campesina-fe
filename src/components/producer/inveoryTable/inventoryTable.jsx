import './inventoryTable.css';
import { useProducerInventoryQuery } from "../../../hooks/query/useProducerInventoryQuery"; 

const Spinner = () => (
  <div className="flex justify-center items-center h-full">
    <div className="w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
  </div>
);

// === Lógica progress bar ===
const getInventoryStatus = (available, min, max) => {
  const percentage = Math.max(0, (available / max) * 100);
  let statusClass = "bg-green-500";

  if (available <= min) {
    statusClass = "bg-red-500";
  } else if (available < max * 0.4) {
    statusClass = "bg-orange-500";
  }

  return {
    statusClass,
    progressPercentage: Math.min(100, percentage).toFixed(1),
  };
};
const App = () => {
  const { data: inventory = [], isPending, isError, error } =
    useProducerInventoryQuery();

  const handleEdit = (id) => console.log("Editar producto:", id);
  const handleDelete = (id) => console.log("Eliminar producto:", id);
  const handleAddProduct = () => console.log("Abrir modal para añadir producto");

  let content;

  if (isPending) {
    content = (
      <div className="flex justify-center items-center min-h-[12.5rem] bg-white rounded-xl shadow-xl mt-5">
        <Spinner />
      </div>
    );
  } else if (isError) {
    content = (
      <div className="text-center p-10 bg-red-50 border border-red-200 text-red-700 rounded-xl mt-5 shadow-lg">
        <h2 className="text-xl font-bold mb-2">Error al cargar el inventario</h2>
        <p className="text-base">{error?.message ?? "Inténtalo de nuevo más tarde."}</p>
      </div>
    );
  } else if (inventory.length === 0) {
    content = (
      <div className="text-center p-10 bg-white rounded-xl shadow-xl mt-5">
        <h2 className="text-xl font-bold text-gray-900 mb-2">No tienes productos en inventario</h2>
        <p className="text-gray-600">Usa el botón "Añadir Producto" para empezar a vender.</p>
      </div>
    );
  } else {
    content = (
      <div className="overflow-x-auto bg-white rounded-xl shadow-xl">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="bg-green-50 text-green-700 font-semibold text-left uppercase text-xs tracking-wider px-5 py-3 rounded-tl-xl">
                Producto
              </th>
              <th className="bg-green-50 text-green-700 font-semibold text-left uppercase text-xs tracking-wider px-5 py-3">
                Cantidad Disponible
              </th>
              <th className="bg-green-50 text-green-700 font-semibold text-left uppercase text-xs tracking-wider px-5 py-3">
                Unidad
              </th>
              <th className="bg-green-50 text-green-700 font-semibold text-left uppercase text-xs tracking-wider px-5 py-3">
                Umbral Mínimo
              </th>
              <th className="bg-green-50 text-green-700 font-semibold text-left uppercase text-xs tracking-wider px-5 py-3">
                Capacidad Máxima
              </th>
              <th className="bg-green-50 text-green-700 font-semibold text-left uppercase text-xs tracking-wider px-5 py-3 rounded-tr-xl">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => {
              const { statusClass, progressPercentage } = getInventoryStatus(
                item.available,
                item.minThreshold,
                item.maxCapacity
              );

              return (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-green-50/50 transition duration-150">
                  <td className="px-5 py-3 text-sm text-gray-700 font-semibold">{item.name}</td>

                  <td className="px-5 py-3 text-sm">
                    <div className="flex items-center space-x-3 min-w-[12rem]">
                      <div className="w-24 h-2 bg-gray-200 rounded-full relative overflow-hidden">
                        <div
                          className={`absolute top-0 left-0 h-full rounded-full transition-all duration-400 ease-out ${statusClass}`}
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold text-gray-900">{item.available}</span>
                    </div>
                  </td>

                  <td className="px-5 py-3 text-sm">{item.unit}</td>
                  <td className="px-5 py-3 text-sm">{item.minThreshold} {item.unit}</td>
                  <td className="px-5 py-3 text-sm">{item.maxCapacity} {item.unit}</td>

                  <td className="px-5 py-3 text-sm">
                    <div className="flex space-x-2">
                      <button
                        className="w-9 h-9 border border-gray-300 rounded-lg flex items-center justify-center text-gray-600 hover:text-green-600 hover:border-green-500 transition"
                        onClick={() => handleEdit(item.id)}
                      >
                        ✏️
                      </button>

                      <button
                        className="w-9 h-9 border border-gray-300 rounded-lg flex items-center justify-center text-gray-600 hover:text-red-500 hover:border-red-500 transition"
                        onClick={() => handleDelete(item.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <section className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Mi Inventario</h1>
            <p className="text-base text-green-600 font-medium mt-1">Gestiona la disponibilidad de tus productos.</p>
          </div>

          <button
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-5 rounded-xl font-semibold shadow-md transition"
            onClick={handleAddProduct}
          >
            Añadir Producto
          </button>
        </header>

        {content}
      </section>
    </div>
  );
};

export default App;