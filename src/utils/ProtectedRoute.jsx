
import { connect } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// Para rutas donde los usuarios autenticados no deberían acceder (como login)
const ProtectedAuthRoute = ({ session }) => {

  if (session) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

const mapStateToProps = (state) => ({
  session: state.auth.session,
});

export const ConnectedProtectedAuthRoute = connect(mapStateToProps)(ProtectedAuthRoute);
