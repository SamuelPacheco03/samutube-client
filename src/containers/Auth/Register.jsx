import { useEffect, useState } from 'react';
import { User, Mail, Lock, Check } from 'lucide-react';
import { connect } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../../redux/actions/auth';

function Register({ signUp, errorMessage, registerSuccess}) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    server: '',  // For server-side errors
  });

  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: '',  // Clear specific error on input change
    });
  };

  useEffect(() => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      server: errorMessage
    }));
  }, [errorMessage]);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Username validation
    if (!formData.username) {
      newErrors.username = 'El nombre de usuario es obligatorio';
      isValid = false;
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es obligatorio';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Por favor ingrese un correo electrónico válido';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      console.log('0')
      await signUp(formData.username, formData.email, formData.password);
      // Handle success (redirect or show success message)
    } catch (error) {
      console.log(error)
      setErrors((prevErrors) => ({
        ...prevErrors,
        server:'Hubo un error en el servidor. Intenta nuevamente más tarde.',
      }));
    }
  };

  if (registerSuccess){
    navigate('/');
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-96 bg-gray-800 text-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Registrarse en AstroTube</h2>
        </div>

        {/* Error from server */}
        {errors.server && (
          <div className="text-red-500 text-sm mb-4">{errors.server}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium">
              Nombre de Usuario
            </label>
            <div className="flex items-center border rounded-lg bg-gray-700 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500">
              <User className="w-5 h-5 text-gray-400 ml-3" />
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="AstroExplorer"
                className="bg-gray-700 text-white flex-1 px-3 py-2 focus:outline-none rounded-r-lg"
              />
            </div>
            {errors.username && <div className="text-red-500 text-sm">{errors.username}</div>}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Correo Electrónico
            </label>
            <div className="flex items-center border rounded-lg bg-gray-700 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500">
              <Mail className="w-5 h-5 text-gray-400 ml-3" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="tu@email.com"
                className="bg-gray-700 text-white flex-1 px-3 py-2 focus:outline-none rounded-r-lg"
              />
            </div>
            {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Contraseña
            </label>
            <div className="flex items-center border rounded-lg bg-gray-700 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500">
              <Lock className="w-5 h-5 text-gray-400 ml-3" />
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="bg-gray-700 text-white flex-1 px-3 py-2 focus:outline-none rounded-r-lg"
              />
            </div>
            {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label htmlFor="confirm-password" className="block text-sm font-medium">
              Confirmar Contraseña
            </label>
            <div className="flex items-center border rounded-lg bg-gray-700 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500">
              <Check className="w-5 h-5 text-gray-400 ml-3" />
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="bg-gray-700 text-white flex-1 px-3 py-2 focus:outline-none rounded-r-lg"
              />
            </div>
            {errors.confirmPassword && <div className="text-red-500 text-sm">{errors.confirmPassword}</div>}
          </div>

          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition">
            Registrarse
          </button>
        </form>

        {/* "Already have an account?" section */}
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-400">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="text-purple-500 hover:text-purple-400 font-medium"
            >
              Iniciar Sesión
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  errorMessage: state.auth.error_message,
  registerSuccess: state.auth.registerSuccess,
});

export default connect(mapStateToProps, {
  signUp
})(Register);
