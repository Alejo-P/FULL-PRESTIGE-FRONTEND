import logo from '../assets/imagenes/logo.jpg';
import user from '../assets/imagenes/user.jpg';
import { useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthProvider';
import Mensaje from '../components/Alertas';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import fondo2 from '../assets/imagenes/bg2.png';

export const Login = () => {
  const navigate = useNavigate();
  const { setAuth, loginMessage } = useContext(AuthContext);
  const [mensaje, setMensaje] = useState({});
  const [errores, setErrores] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (loginMessage?.respuesta) {
      setMensaje(loginMessage);
      setTimeout(() => {
        setMensaje({});
      }, 5000);
    }
  }, [loginMessage]);

  const [loginForm, setLoginForm] = useState({
    correo: '',
    contrasena: '',
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const URLogin = `${process.env.VITE_BACKEND_URL}/login`;
      const respuesta = await axios.post(URLogin, loginForm);

      localStorage.setItem('token', respuesta.data.empleado.token);
      setAuth(respuesta.data.empleado);
      
      setMensaje({ respuesta: 'Inicio de sesión exitoso', tipo: true });
      setTimeout(() => {
        setMensaje({});
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      setMensaje({ respuesta: error.response.data.message, tipo: false });
      console.log(error);

      setTimeout(() => {
        setMensaje({});
      }, 3000);
    }
  };

  const handleChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div 
      className="bg-black flex flex-col items-center justify-center min-h-screen w-full px-5 
                 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${fondo2})` }}
    >
      <div className="flex flex-col items-center w-full max-w-lg">
        <img src={logo} alt="Full Prestige" className="mb-5 w-3/4 max-w-xs" />
        
        {Object.keys(mensaje).length !== 0 && (
          <div className="mb-4 w-full">
            <Mensaje mensaje={mensaje.respuesta} tipo={mensaje.tipo} errores={!mensaje.tipo ? errores : {}} />
          </div>
        )}

        <form 
          onSubmit={handleLogin} 
          className="flex flex-col items-center bg-black border-4 border-red-600 p-8 
                     rounded-lg shadow-lg w-full max-w-md"
        >
          <div className="flex justify-center mb-5">
            <img 
              src={user} 
              alt="user" 
              className="rounded-full w-20 h-20 border-2 border-red-600"
            />
          </div>

          <div className="mb-4 w-full">
            <label htmlFor="correo" className="block text-sm font-semibold mb-2 text-white">
              Correo
            </label>
            <input
              type="email"
              name="correo"
              id="correo"
              value={loginForm.correo}
              onChange={handleChange}
              required
              placeholder="Ingresa tu correo"
              className="border-2 border-red-600 bg-gray-200 rounded-lg py-2 px-4 w-full 
                         focus:outline-none focus:border-red-700"
            />
          </div>

          <div className="mb-4 w-full relative">
            <label htmlFor="contrasena" className="block text-sm font-semibold mb-2 text-white">
              Contraseña
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="contrasena"
              id="contrasena"
              value={loginForm.contrasena}
              onChange={handleChange}
              required
              placeholder="Ingresa tu contraseña"
              className="border-2 border-red-600 bg-gray-200 rounded-lg py-2 px-4 w-full 
                         focus:outline-none focus:border-red-600"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-12 transform -translate-y-1/2 text-gray-500"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <FaEyeSlash size={24} /> : <FaEye size={24} />}
            </button>
          </div>

          <a href="/olvidaste-contrasena" className="text-blue-50 hover:underline mb-2">
            ¿Olvidaste tu contraseña?
          </a>

          <div className="w-full flex justify-center">
            <button
              type="submit"
              disabled={!loginForm.correo || !loginForm.contrasena}
              className="w-full max-w-xs py-2 bg-green-600 text-white font-semibold rounded-lg 
                         hover:bg-green-800 transition duration-300"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
