import React from 'react'
import { useNavigate } from 'react-router-dom';
import { HistoryContext } from '../../context/HistoryContext';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import AuthContext from '../../context/AuthProvider';
import { useContext,useState} from 'react';
import { useEffect } from 'react';
import { TablaPago } from '../../components/Pagos/TablaPago';
import jsPDF from 'jspdf';
import *as XLSX from 'xlsx';
import { FaMoneyBill } from 'react-icons/fa';

// Componentes
import InputCedula from '../components/InputCedula'
import DownloadsButtons from '../components/DownloadsButtons'

const HistorialPagos = () => {
  //Convertir la fecha ISO 8601 a formato 'YYYY-MM-DD'
  const formatDate = (isoDate) => {
    try {
      if (!isoDate) {
        return 'N/A'; // Si no hay fecha, retornar 'N/A'
      }

      const date = new Date(isoDate);
      if (isNaN(date)) {
        throw new Error('Fecha inválida');
      }
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error(`Error formateando fecha: ${error.message}`);
      return 'Fecha inválida';
    }
  };

  const navigate = useNavigate();
  const{
    usuarios,
    loading,
    fetchUsuarios,
    fetchPagos,
    seleccionado,
    fetchUsuarioByCedula,
    handleModal,
    setTipoModal,
    pagos
  }=useContext(HistoryContext);
  const {auth}=useContext(AuthContext);

  const [cedula, setCedula] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { value } = e.target; // Se cambio e.target.value por e.target
    
    //Validación para que ingrese numeros y no sobrepase los 10 digitos
    if (/^\d{0,10}$/.test(value)){
      setCedula(value); // si es valido, actualiza el estado
    }
  };

  //Llamar a fetchUsuarios cuando se cargue la página
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleNewClick = (type) => {
    setTipoModal(type);
    handleModal(true);
  };

  const handleSearch = async () => {
    // Validación de la cédula
    const cedulaRegex = /^[0-9]{10}$/;
    if (cedula === "") {
      await fetchUsuarios(); // Cargar todos los usuarios si la cédula está vacía
      return;
    }
  
    if (!cedulaRegex.test(cedula)) {
      setErrorMessage("⚠️La cédula debe contener solo 10 dígitos numéricos.");
      return;
    }
  
    const usuario = await fetchUsuarioByCedula(cedula);
  
    if (!usuario) {
      setErrorMessage("❌ Usuario no se encuentra registrado");
    } else {
      const pagos = await fetchPagos(cedula);
      setErrorMessage(""); // Limpiar mensaje de error
      setSuccessMessage(" ✅ Usuario encontrado con éxito");
    }
    
    setCedula(""); // Limpia la cédula del campo de búsqueda
  
    // Limpiar los mensajes después de 6 segundos
    setTimeout(() => {
      setErrorMessage(""); // Limpiar mensaje de error
      setSuccessMessage(""); // Limpiar mensaje de éxito
    }, 4000);
  };

  // --------------------Descarga en formato PDF-------------------------------------
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Historial de Pagos', 10, 10);
  
    doc.autoTable({
      head: [['Cédula', 'Nombre y Apellido', 'Fecha', 'Adelantos', 'Permisos', 'Multas', 'Atrasos', 'Subtotal']],
      body: pagos.map((usuario) => [
        usuario.cedula,
        usuario.nombre,
        formatDate(usuario?.pago.fecha) || 'No disponible',
        formatNumber(usuario?.pago.adelanto) || 'No disponible',
        formatNumber(usuario?.pago.permisos) || 'No disponible',
        formatNumber(usuario?.pago.multas) || 'No disponible',
        formatNumber(usuario?.pago.atrasos) || 'No disponible',
        formatNumber(usuario?.pago.subtotal) || 'No disponible',
      ]),
    });
  
    doc.save('HistorialPagos.pdf');
  };
  
  // --------------------Descarga en formato Excel--------------------------------------------
  const handleDownloadExcel = () => {
    const data = pagos.map((usuario) => ({
      Cédula: usuario.cedula,
      Nombre: usuario.nombre,
      Fecha: formatDate(usuario?.pago.fecha),
      Adelantos: formatNumber(usuario?.pago.adelanto) ,
      Permisos:formatNumber(usuario?.pago.permisos) || 'No disponible',
      Multas:formatNumber(usuario?.pago.multas) || 'No disponible',
      Atrasos:formatNumber(usuario?.pago.atrasos) || 'No disponible',
      Subtotal:formatNumber(usuario?.pago.subtotal) || 'No disponible',
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'HistoriaPagos');
    XLSX.writeFile(workbook, 'HistoriaPagos.xlsx');
  };
  
  // Función para formatear números con dos decimales (utilizado en la descarga de archivos)
  const formatNumber = (value) => {
    if (typeof value === 'number') {
      return value.toFixed(2); // Redondea a 2 decimales
    }
    return value || '0.00'; // Devuelve un valor predeterminado si no es un número
  };

  return (
    <>
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
      {successMessage && <div className="text-green-500">{successMessage}</div>}
      <InputCedula value={cedula} handleChange={handleChange} handleSearch={handleSearch}/>
      {
        // Si el usuario es un administrador, mostrar los botones de registrar y actualizar
        auth?.cargo === "Administrador" && (
          <div className="flex justify-center items-center bg-gray-300 p-4 rounded-lg mb-6">
            <button
              onClick={() => handleNewClick("registrar")}
              className="px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-orange-300"
              data-tooltip-id='registrar'
              data-tooltip-content="Registra un nuevo pago para el usuario seleccionado"
            >
              Registrar Pago
            </button>

            <button
              onClick={() => handleNewClick("actualizar")}
              className="ml-4 px-4 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-500"
              disabled={Object.keys(seleccionado?.pago || {}).length !== 0 ? false : true}
              style={{ cursor: Object.keys(seleccionado?.pago || {}).length !== 0 ? "pointer" : "not-allowed" }}
              data-tooltip-id='actualizar'
              data-tooltip-content={(Object.keys(seleccionado?.pago || {}).length !== 0) ? "Actualiza el pago del usuario seleccionado" : "No se puede actualizar el pago"}
            >
              Actualizar Pago
            </button>

            <ReactTooltip id='registrar' place='bottom' />
            <ReactTooltip id='actualizar' place='bottom' />
          </div>
        )
      }
      {/* ---------------------------------------------------------------------------------------------------------------------------- */}
          
      {/* TABLA DEL HISTORIAL */}
      {/* Significa que esta esperando una lista, de lo contrario solo muestra el encabezado, esto se modifica del lado del backend */}
      {
        Array.isArray(usuarios) && usuarios.length !== 0 ? (
          <TablaPago usuarios={usuarios} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse border border-black">
              <thead className="bg-black text-white font-mono">
                <tr>
                  {[
                    'Cédula', 'Nombre y Apellido', 'Fecha', 'Adelantos', 'Permisos', 'Multas', 'Atrasos', 'Subtotal'
                  ].map((header) => (
                    <th key={header} className="border border-black px-4 py-2">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="8" className="text-center py-4 text-red-700">
                    { loading ? 'Cargando...' : 'No existen usuarios registrados'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )
      }
  
      {/* BOTONES------------------------------------------------------------- */}
      {
        // Si el usuario es un administrador o gerente, mostrar los botones de descarga
        (auth?.cargo === "Administrador" || auth?.cargo === "Gerente") && (
          <DownloadsButtons handleDownloadExcel={handleDownloadExcel} handleDownloadPDF={handleDownloadPDF} />
        )
      }
    </>
  )
}

export default HistorialPagos
