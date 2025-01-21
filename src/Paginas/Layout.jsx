import assets from '../assets/images';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import AuthContext from '../../context/AuthProvider';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Importación faltante
import { FaMoneyBill } from 'react-icons/fa'; // Importación del ícono faltante

export const Pago = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const handleLogout = () => {
    const confirmLogout = window.confirm("¿Deseas abandonar la página?");
    if (confirmLogout) {
      navigate('/dashboard');
    }
  };

  const logo = assets.logo; // Obtiene el logo desde assets

  return (
    <div
      className="min-h-screen sm:w-full flex flex-col"
      style={{
        background: '#bdc3c7', // Fallback for old browsers
        background: '-webkit-linear-gradient(to right, #2c3e50, #bdc3c7)', // Chrome 10-25, Safari 5.1-6
        background: 'linear-gradient(to right, #2c3e50, #bdc3c7)', // W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+
      }}
    >
      <header className="w-full bg-black shadow p-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src={logo} alt="Full Prestige" className="h-14" />
          <p className="ml-4 text-white italic font-semibold text-sm">
            &quot;Que tu auto refleje lo mejor de ti&quot;
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          VOLVER
        </button>
      </header>

      {/* Mapear imágenes */}
      <div className="flex flex-wrap justify-center my-4">
        {assets.imagenes?.map((item, index) => (
          <div key={`${item.name}-${index}`} className="text-white text-sm text-center mx-2">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <img
                src={item.value} // Accede a la imagen correcta del objeto
                alt={`${item.name} logo`}
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <p>{item.name}</p>
          </div>
        ))}
      </div>

      {/* Historial de Pagos */}
      <div>
        <h2 className="bg-black px-4 py-2 border-2 border-white text-red-600 text-center text-2xl font-semibold mb-4">
          HISTORIAL DE PAGOS
          <FaMoneyBill className="text-red-600 mx-auto text-5xl mb-4" />
        </h2>
      </div>

      {/* Historial de Usuarios */}
      <main className="flex-grow w-full p-6 bg-white shadow mt-6 rounded-lg mx-auto border border-black">
        {
          /** Aquí mostrar las tablas */
        }
      </main>

      {/* Footer */}
      <footer className="w-full py-1 text-center text-white bg-black border-t border-white">
        2024 Full Prestige. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default Pago;
