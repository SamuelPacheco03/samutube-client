import { Search, Upload, User, Menu, LogOut, X } from 'lucide-react';
import { connect } from 'react-redux';
import { useState, useEffect } from 'react';
import { addVideo, searchVideoByTitle } from '../redux/actions/video';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../redux/actions/auth';

function Navbar({ setSidebarOpen, sidebarOpen, addVideo, session, logout, searchVideoByTitle }) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleUpload = async () => {
    if (videoFile && title && description) {
      setLoading(true);
      try {
        await addVideo(title, description, videoFile);
        setDialogOpen(false);
        setVideoFile(null);
        setTitle('');
        setDescription('');
      } catch (error) {
        console.error('Error al subir el video:', error);
      } finally {
        setLoading(false);
        windows.location.reload();
      }
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchVideoByTitle(searchQuery);
    } else {
      searchVideoByTitle("");
    }
    setIsMobileSearchOpen(false);
  };

  const toggleLogin = () => {
    logout();
    navigate('/');
    window.location.reload();

  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileSearchOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-900 to-purple-900 shadow-lg">
      {/* Logo y menú */}
      <div className="flex items-center">
        <button
          className="mr-4 text-white focus:outline-none lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold text-white">AstroTube</h1>
      </div>

      {/* Barra de búsqueda */}
      <div className={`flex-1 mx-4 ${isMobileSearchOpen ? 'block' : 'hidden'} md:block`}>
        <div className="relative">
          <input
            type="search"
            placeholder="Buscar vídeos..."
            className="w-full bg-gray-800 text-white placeholder-gray-400 border-none py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Botones y menú */}
      <div className="flex items-center space-x-4">
        <button
          className="text-white focus:outline-none md:hidden"
          onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
        >
          {isMobileSearchOpen ? <X className="h-6 w-6" /> : <Search className="h-6 w-6" />}
        </button>

        {session ? (
          <>
            {/* Botón de subir */}
            <button
              className="text-white focus:outline-none hidden md:block"
              onClick={() => setDialogOpen(true)}
            >
              <Upload className="h-6 w-6" />
            </button>

            {/* Menú desplegable */}
            <div className="relative">
              <button
                className="text-white focus:outline-none"
                onClick={() => setMenuOpen(!isMenuOpen)}
              >
                <User className="h-6 w-6" />
              </button>

              {/* Menú desplegable de usuario */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 bg-gray-800 text-white rounded-lg shadow-lg py-2 w-48 z-10">
                  <button
                    className="flex items-center px-4 py-2 hover:bg-gray-700 w-full focus:outline-none md:hidden"
                    onClick={() => {
                      setDialogOpen(true);
                      setMenuOpen(false);
                    }}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    <span>Subir Video</span>
                  </button>
                  <button
                    className="flex items-center px-4 py-2 hover:bg-gray-700 w-full focus:outline-none"
                    onClick={toggleLogin}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            Iniciar Sesión
          </Link>
        )}
      </div>

      {/* Modal para subir video */}
      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Subir Video</h2>
              <button
                className="text-gray-400 hover:text-white focus:outline-none"
                onClick={() => setDialogOpen(false)}
                disabled={loading}
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <input
                id="video"
                type="file"
                accept="video/*"
                className="bg-gray-700 w-full py-2 px-3 rounded-lg text-white focus:outline-none"
                onChange={(e) => setVideoFile(e.target.files[0])}
                disabled={loading}
              />
              <input
                id="title"
                placeholder="Título del video"
                className="bg-gray-700 w-full py-2 px-3 rounded-lg text-white focus:outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
              />
              <textarea
                id="description"
                placeholder="Descripción del video"
                className="bg-gray-700 w-full py-2 px-3 rounded-lg text-white focus:outline-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
              />
              <button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition"
                onClick={handleUpload}
                disabled={loading}
              >
                {loading ? "Cargando..." : "Subir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

const mapStateToProps = (state) => ({
  session: state.auth.session,
});

export default connect(mapStateToProps, {
  addVideo,
  logout,
  searchVideoByTitle
})(Navbar);

