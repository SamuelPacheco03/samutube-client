import { Home, Video, User } from 'lucide-react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

function Sidebar({ session, user, sidebarOpen, setSidebarOpen }) {
  return (
    <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white h-screen p-4 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}>
      <button
        className="absolute top-4 right-4 text-white focus:outline-none lg:hidden"
        onClick={() => setSidebarOpen(false)}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <nav className="mt-8 lg:mt-0">
        <ul className="space-y-2">
          <li>
            <Link to="/" onClick={() => setSidebarOpen(false)}>
              <button className="w-full flex items-center justify-start px-4 py-2 text-left rounded-lg hover:bg-gray-800 focus:outline-none transition">
                <Home className="mr-2 h-5 w-5" />
                <span>Inicio</span>
              </button>
            </Link>
          </li>
          {session && (
            <>
              <li>
                <Link to={`/channel/${user.id}`} onClick={() => setSidebarOpen(false)}>
                  <button className="w-full flex items-center justify-start px-4 py-2 text-left rounded-lg hover:bg-gray-800 focus:outline-none transition">
                    <Video className="mr-2 h-5 w-5" />
                    <span>Mis Videos</span>
                  </button>
                </Link>
              </li>
              <li>
                <Link to="/subscriptions" onClick={() => setSidebarOpen(false)}>
                  <button className="w-full flex items-center justify-start px-4 py-2 text-left rounded-lg hover:bg-gray-800 focus:outline-none transition">
                    <User className="mr-2 h-5 w-5" />
                    <span>Suscripciones</span>
                  </button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
}

const mapStateToProps = (state) => ({
  session: state.auth.session,
  user: state.auth.user,
});

export default connect(mapStateToProps, {})(Sidebar);

