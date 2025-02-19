import logo from '../../assets/imagenes/logo.jpg';
import pdf from '../../assets/imagenes/pdf.png'
import excel from '../../assets/imagenes/excel.png'
import { useNavigate } from 'react-router-dom';
import BMWLogo from '../../assets/LogosAutos/BMW.png'
import chevroletLogo from '../../assets/LogosAutos/Chevrolet.png'
import fordLogo from '../../assets/LogosAutos/Ford.png'
import hondaLogo from '../../assets/LogosAutos/Honda.png'
import hundayLogo from '../../assets/LogosAutos/Hunday.png'
import kiaLogo from '../../assets/LogosAutos/Kia.png'
import mazdaLogo from '../../assets/LogosAutos/Mazda.png';
import mercedesLogo from '../../assets/LogosAutos/Mercedes.png'
import peugeotLogo from '../../assets/LogosAutos/Peugeot.png'
import renaultLogo from '../../assets/LogosAutos/Renault.png'
import susukiLogo from '../../assets/LogosAutos/Susuki.png'
import { HistoryContext } from '../../context/HistoryContext';
import AuthContext from '../../context/AuthProvider';
import { useContext, useState } from 'react';
import { useEffect } from 'react';
import toyotaLogo from '../../assets/LogosAutos/Toyota.png'
import { TablaClientes } from '../../components/Clientes/TablaClientes';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { FaCar} from 'react-icons/fa';



export const ClientesVehiculos = () => {

  const navigate= useNavigate();
  const {
    clientes,
    fetchClientes,
    fetchClienteByCedula,
    loading
  }= useContext (HistoryContext);
  const { auth }= useContext(AuthContext);

  const [cedula, setCedula] = useState("");
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange=(e)=>{
    const value = e.target.value

    //Validación para que solo ingresen números y que no sobrepase los 10 dígitos
    if (/^\d{0,10}$/.test(value)){
      setCedula(value); // si es valido, actualiza el estado
    }
  };
  
  const brandLogos = {
    bmw: BMWLogo,
    chevrolet: chevroletLogo,
    ford: fordLogo,
    honda:hondaLogo,
    hunday:hundayLogo,
    kia:kiaLogo,
    mazda: mazdaLogo,
    mercedes:mercedesLogo,
    peugeot:peugeotLogo,
    renault:renaultLogo,
    susuki:susukiLogo,
    toyota:toyotaLogo
  };
  
  const handleLogout=()=>{
    const confirmLogout = window.confirm ("¿Deseas abandonar la página?")
    if(confirmLogout === true){
      navigate('/dashboard');
    }  
  };
  const handleNewClick =()=>{
    navigate('/dashboard/registrar-clientes')
  }
 // Llamar a fetchUsuarios una vez cuando el componente carga, muestra a todos los clientes en la base de datos
 useEffect(() => {
  fetchClientes();
}, []); // Se quito la dependencia ya que se busca cargarla unicamente cuando el componente de monta

// ------------------------------------------------------------------------------------------
const handleSearch = async () => {
  // Validación de la cédula
  const cedulaRegex = /^[0-9]{10}$/;
  if (cedula === "") {
    await fetchClientes(); // Cargar todos los clientes si la cédula está vacía
    return;
  }

  if (!cedulaRegex.test(cedula)) {
    setErrorMessage("⚠️ La cédula debe contener solo 10 dígitos numéricos.");
    return;
  }

  const cliente = await fetchClienteByCedula(cedula);

  if (!cliente) {
    setErrorMessage("❌ Cliente no se encuentra registrado");
  } else {
    setErrorMessage(""); // Limpiar mensaje de error
    setSuccessMessage("✅ Cliente encontrado con éxito");
    setFilteredData([cliente]); // Mostrar el cliente encontrado
  }
  
  setCedula(""); // Limpia la cédula del campo de búsqueda

  // Limpiar los mensajes después de 4 segundos
  setTimeout(() => {
    setErrorMessage(""); // Limpiar mensaje de error
    setSuccessMessage(""); // Limpiar mensaje de éxito
  }, 4000);
};
// ----------------------------------------------------------------------------------

  useEffect(() => {
    if (startDate && endDate) {
      const filtered = clientes.filter((usuario) => {
        const userDate = new Date(usuario.fechaRegistro);
        return userDate >= new Date(startDate) && userDate <= new Date(endDate);
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(clientes);
    }
  }, [startDate, endDate, clientes]);

  // --------------------Descarga en formato PDF-------------------------------------
  const handleDownloadPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' }); // Configuración para orientación horizontal
    doc.text('Historial de Clientes Registrados', 10, 10);
  
    doc.autoTable({
      head: [
        [
          'Cédula', 'Nombre/Apellido', 'Contacto', 'Email', 'Dirección', 'N° Orden',
          'Marca', 'Modelo', 'Placa', 'Fecha Ingreso', 'Fecha Salida', 'Técnico Responsable', 'Estado'
        ]
      ],
      body: filteredData.map((cliente) => [
        cliente.propietario?.cedula || 'No disponible', // Verificación de propietario
        cliente.propietario?.nombre || 'No disponible', // Verificación de nombre
        cliente.propietario?.telefono || 'No disponible', // Verificación de teléfono
        cliente.propietario?.correo || 'No disponible', // Verificación de correo
        cliente.propietario?.direccion || 'No disponible', // Verificación de dirección
        cliente.n_orden || 'No disponible', // Verificación de orden
        cliente.marca || 'No disponible', // Verificación de marca
        cliente.modelo || 'No disponible', // Verificación de modelo
        cliente.placa || 'No disponible', // Verificación de placa
        formatDate(cliente.fecha_ingreso) || 'No disponible', // Verificación de fecha de ingreso
        formatDate(cliente.fecha_salida) || 'No disponible', // Verificación de fecha de salida
        cliente.encargado?.nombre || 'No disponible', // Verificación de encargado
        cliente.estado || 'No disponible' // Verificación de estado
      ]),
      startY: 20, // Opcional: deja un espacio debajo del título
    });
  
    doc.save('HistorialClientes.pdf');
  };
  
  const handleDownloadExcel = () => {
    const data = filteredData.map((cliente) => ({
      Cédula: cliente.propietario?.cedula || 'No disponible', //Uso de operador: encadenamiento opcional y un valor predeterminado para las propiedades que podrían no existir
      Nombre: cliente.propietario?.nombre || 'No disponible',
      Teléfono: cliente.propietario.telefono || 'No disponible',
      Email: cliente.propietario.correo || 'No disponible',
      Dirección: cliente.propietario.direccion || 'No disponible',
      Orden: cliente.n_orden  || 'No disponible',
      Marca: cliente.marca || 'No disponible',
      Modelo: cliente.modelo  || 'No disponible',
      Placa: cliente.placa || 'No disponible',
      FechaIngreso: formatDate(cliente.fecha_ingreso) || 'No disponible',
      FechaSalida: formatDate(cliente.fecha_salida)   || 'No disponible',
      Técnico: cliente.encargado?.nombre  || 'No disponible',
      Estado: cliente.estado  || 'No disponible',
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'HistorialClientes');
    XLSX.writeFile(workbook, 'HistorialClientes.xlsx');
  };

  // Convertir la fecha ISO 8601 a formato 'YYYY-MM-DD'
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses van de 0 a 11
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="min-h-screen flex flex-col" 
    style={{
            background: '#bdc3c7',  /* Fallback for old browsers */
            background: '-webkit-linear-gradient(to right, #2c3e50, #bdc3c7)',  /* Chrome 10-25, Safari 5.1-6 */
            background: 'linear-gradient(to right, #2c3e50, #bdc3c7)'  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        }}
    >
      
      <header className="w-full bg-black shadow p-4 flex justify-between items-center">
        <div className='flex items-center'>
            <img src={logo} alt="Full Prestige" className='h-14' />
            <p className='ml-4 text-white italic font-semibold text-sm' >&quot;Que tu auto refleje lo mejor de ti&quot;</p>

        </div>
        <button 
        onClick={handleLogout}
        className="bg-green-500 text-white px-4 py-2 rounded">
        VOLVER</button>
      </header>
      

      <div className="w-full bg-black p-4 grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-4 items-center justify-items-center">
        {['BMW','Chevrolet','Ford','Honda','Hunday','Kia','Mazda','Mercedes', 'Peugeot','Renault' ,'Susuki','Toyota'].map((brand) => (
          <div key={brand} className="text-white text-sm text-center mx-2">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <img
                src={brandLogos[brand.toLowerCase()]} // Accede a la imagen correcta del objeto
                alt={`${brand} logo`}
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <p>{brand}</p>
          </div>
        ))}
      </div>
      

      <div>
        <h2 className=" bg-black px-4 py-2  border-2 border-white text-red-600 text-center text-xl font-semibold mb-4">HISTORIAL DE CLIENTES / VEHÍCULOS <FaCar className="text-red-600 mx-auto text-5xl mb-4" /></h2>
      </div>

      {/* Historial de Clientes/Vehículos */}
      <main className="flex-grow w-full  p-6 bg-white shadow mt-6 rounded-lg mx-auto border border-black">
      {/* max-w-5xl (Esto hace que el formulario se limite al ancho y no cubra toda la pantalla)*/} 
        
        {/* ---------------------FORMULARIO DE BUSQUEDA----------------------- */}

          {/* Mostrar mensaje de error si no se encuentra cliente o si la cédula es inválida */}
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}
          {successMessage && <div className="text-green-500">{successMessage}</div>}
          {/* --------------------------------------------------------------------------------- */}
          
        <div className="flex items-center justify-between bg-gray-300 p-4 rounded-lg mb-6">
          <input
              type="text"
              onChange={handleChange}
              value={cedula}
              placeholder="Ingresa la cédula"
              className="bg-gray-200 border border-black py-2 px-4 w-full rounded-lg focus:outline-none"
            />
            {/* ---------------------------------BOTONES------------------ */}

            <button 
            onClick={handleSearch}
            className="ml-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-800">
              Buscar
            </button>

            {
              // Si el usuario es un administrador, mostrar el botón de nuevo cliente
              auth?.cargo === 'Administrador' && (
                <button 
                onClick={handleNewClick}
                className="ml-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800">
                  Nuevo
                </button>
              )
            }

        </div>


        {/* TABLA DEL HISTORIAL DE CLIENTES------------------------------------------ */}
        {Array.isArray(clientes) && clientes.length !== 0 ? (
        <TablaClientes clientes={clientes} />
        ) : (
        <div className="overflow-x-auto">
        {/* Tabla de Historial */}
        <table className="w-full text-center border-collapse border border-black">
          <thead className="bg-black text-white ">
            <tr>
              {[
                'Cédula', 'Contacto', 'Email', 'Dirección', 'N° Orden',
                'Marca', 'Modelo', 'Placa', 'Fecha Ingreso', 'Fecha Salida',
                'Descripción del trabajo', 'Técnico Responsable', 'Estado', 'Opciones'
              ].map((header) => (
                <th key={header} className="border border-black px-4 py-2">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody> 
            <tr>
              <td colSpan="13" className="text-center py-4 text-red-700">
                {loading ? 'Cargando...' : 'No hay clientes registrados'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )}

    {/* BOTONES------------------------------------------------------------- */}
    {
      // Si el usuario es un administrador o gerente, mostrar los botones de descarga
      (auth?.cargo === "Administrador" || auth?.cargo === "Gerente") && (
        <div className="flex space-x-4 justify-center mt-20">
          <button
            onClick={handleDownloadPDF}
            className="bg-red-400 text-black font-bold px-3 py-2 rounded flex items-center space-x-5"
          >
            <img src={pdf} alt="pdf" className="h-6" />
            Descargar PDF
          </button>

          <button
            onClick={handleDownloadExcel}
            className="bg-green-300 text-black font-bold px-3 py-2 rounded flex item-center space-x-5"
          >
            <img src={excel} alt="excel" className="h-6" />
            Descargar Excel
          </button>
        </div>
        )
       }
      </main>

       {/* Footer------------------------------------------------------------------- */}
       <footer className="w-full py-1 text-center text-white bg-black border-t border-white">
      2024 Full Prestige. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default ClientesVehiculos;