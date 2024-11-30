import { useEffect, useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../../redux/actions/auth';

function Login({ login, errorMessage, loginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    server: '', // For server-side errors
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: '', // Clear specific error on input change
    });
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

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

    setErrors(newErrors);
    return isValid;
  };
  useEffect(() => {
    console.log('error', errorMessage)
    setErrors((prevErrors) => ({
      ...prevErrors,
      server: errorMessage ,
    }));
  }, [errorMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Dispatch the login action
      await login(formData.email, formData.password);
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        server: errorMessage || 'Hubo un error al intentar iniciar sesión. Intenta nuevamente.',
      }));
    }
  };
  console.log(loginSuccess)
  if(loginSuccess) {  
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-96 bg-gray-800 text-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Iniciar Sesión en AstroTube</h2>
        </div>

        {/* Error from server */}
        {errors.server && (
          <div className="text-red-500 text-sm mb-4">{errors.server}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition"
          >
            Iniciar Sesión
          </button>
        </form>

        {/* "Don't have an account?" section */}
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-400">
            ¿No tienes cuenta?{" "}
            <Link
              to="/register"
              className="text-purple-500 hover:text-purple-400 font-medium"
            >
              Regístrate
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  errorMessage: state.auth.error_message,
  loginSuccess: state.auth.loginSuccess,
  session: state.auth.session,
});

export default connect(mapStateToProps, {
  login
})(Login);
