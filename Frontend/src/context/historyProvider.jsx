import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { HistoryContext } from './HistoryContext';

// Crear el proveedor de contexto
export const HistoryProvider = ({ children }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [clientes, setClientes] = useState ([]);
  const [asistencias, setAsistencias] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tipoModal, setTipoModal] = useState(''); // Tipo de modal: 'registrar' o 'actualizar'

  // -------------------------------- Modal --------------------------------
  const handleModal = () => {
    setShowModal(!showModal);
  };

    // -----------------------------------FUNCIONES PARA USUARIOS--------------------------------------------

  // Función para obtener usuarios desde el backend
  const fetchUsuarios = async () => {
    const token = localStorage.getItem('token')
    if (!token )return
    try {
      setLoading(true); // Activar el estado de carga
      const options={
        headers:{
          'Content-Type': 'application/json',
          Authorization:`Bearer ${token}`,
        }
      }

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/employees`,options);
      setUsuarios(response.data.empleados); // Suponiendo que la API retorna un array de usuarios
    } catch (error) {
      console.error("Error al obtener usuarios", error);
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  ;
  
  HistoryProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
  };

  const upDateUser=async(cedula,registro)=>{
    const URLActualizar = `${import.meta.env.VITE_BACKEND_URL}/employee/${cedula}`;
                const token=localStorage.getItem("token")
                const options={
                    headers:{
                      'Content-Type': 'application/json',
                      Authorization:`Bearer ${token}`,
                    }
                  }
                // Realizar la petición POST
                //const respuesta = await axios.put(URLActualizar, registro, options);
                
                //console.log(respuesta)
                try {
                  const respuesta = await axios.put(URLActualizar, registro, options);
                  console.log(respuesta);
                } catch (error) {
                  console.error("Error al actualizar usuario", error);
                }
          
  };
  const fetchUsuarioByCedula = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return null; // Asegurarse de que si no hay token, no haga la búsqueda
  
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
  
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/employee/${id}`,options);
      console.log(response.data)
      if (response.data && response.data.length > 0) {
        // Retorna el primer cliente encontrado

        setUsuarios(response.data) // 
        return true
      } else {
        return null
      }
    } catch (error) {
      console.error("Error al obtener cliente", error);
      // Si no se encuentra el cliente, retornar null
      setUsuarios([])
      setTimeout(async ()=>{await fetchUsuarios()} ,3000) //Para eliminar la vista de tabla cuando el usuario no es encontrado
      return null; // En caso de error, retornar null
    }
  };

  // Función para agregar un usuario y actualizar el estado
  const addUsuario = (nuevoUsuario) => {
    setUsuarios([...usuarios, nuevoUsuario]);
  };


  // -----------------------------------FUNCIONES PARA CLIENTES--------------------------------------------
  const fetchClientes = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/vehicles`, options);
      setClientes(response.data); // Suponiendo que la API retorna un array de clientes
    } catch (error) {
      console.error("Error al obtener clientes", error);
    }
  };
  // -------------------------------------------------------------------------------------
  const upDateClient = async (cedula, regisclientes) => {
    const URLActualizar = `${import.meta.env.VITE_BACKEND_URL}/client/${cedula}`;
    const token = localStorage.getItem("token");
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const respuesta = await axios.put(URLActualizar, regisclientes, options);
      console.log(respuesta);
    } catch (error) {
      console.error("Error al actualizar cliente", error);
    }
  };
  // -----------------------------------------------------------------
  const fetchClienteByCedula = async (id) => {
    const token = localStorage.getItem('token');

    if (!token) return null; // Asegurarse de que si no hay token, no haga la búsqueda
  
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
  
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/vehicles/client/${id}`, options);
      console.log(response.data)
      if (response.data && response.data.length > 0) {
        // Retorna el primer cliente encontrado
        setClientes(response.data)//Filtrando todos los usuarios
        return true
      } else {
        // Si no se encuentra el cliente, retornar null
        return null;
      }
    } catch (error) {
      console.error("Error al obtener cliente", error);

      setClientes([])
      setTimeout(async ()=>{await fetchClientes()} ,3000)
      return null; // En caso de error, retornar null
    }
  };

  // -------------------------------------------------------------------------------

  

  const addCliente = (nuevoCliente) => {
    setClientes([...clientes, nuevoCliente]);
  };

   // -----------------------------------FUNCIONES PARA ASISTENCIAS--------------------------------------------

   const fetchAsistencias = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/employee/${id}/assistance`, options);

      // const asistencias = response.data.map((asistencia) => {
      //   return {
      //     cedula: asistencia.empleado.cedula,
      //     nombre: asistencia.empleado.nombre,
      //     telefono: asistencia.empleado.telefono,
      //     cargo: asistencia.empleado.cargo,
      //     asistencia: {
      //       fecha: asistencia.fecha,
      //       hora_ingreso: asistencia.hora_ingreso,
      //       hora_salida: asistencia.hora_salida,
      //       estado: asistencia.estado,
      //     },
      //   }
      // });

      return response.data;
    } catch (error) {
      
      console.error("Error al obtener asistencias", error);
    }
  };

  const upDateAssistance = async (cedula, asistencia) => {
    const URLActualizar = `${import.meta.env.VITE_BACKEND_URL}/employee/${cedula}/assistance`;
    const token = localStorage.getItem("token");
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const respuesta = await axios.put(URLActualizar, asistencia, options);
      console.log(respuesta);
    } catch (error) {
      console.error("Error al actualizar asistencia", error);
    }
  };

  const registerAssistance = async (cedula, asistencia) => {
    const URLActualizar = `${import.meta.env.VITE_BACKEND_URL}/employee/${cedula}/assistance`;
    const token = localStorage.getItem("token");
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const respuesta = await axios.post(URLActualizar, asistencia, options);
      console.log(respuesta);
    } catch (error) {
      console.error("Error al actualizar asistencia", error);
    }
  };



 
  return (
    <HistoryContext.Provider 
    value={{ 
      usuarios, 
      addUsuario, 
      fetchUsuarioByCedula,
      upDateUser,
      fetchUsuarios,
      clientes,
      addCliente,
      fetchClienteByCedula,
      upDateClient,
      fetchClientes,
      asistencias,
      fetchAsistencias,
      setAsistencias,
      upDateAssistance,
      registerAssistance,
      seleccionado,
      setSeleccionado,
      loading,
      showModal,
      handleModal,
      tipoModal,
      setTipoModal
       }}>
      {children}
    </HistoryContext.Provider>
  );
};
