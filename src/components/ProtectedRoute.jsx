import { Navigate, useLocation } from "react-router-dom"

function ProtectedRoute({ children, allowedRole }) {
  const location = useLocation()
  const userRole = localStorage.getItem("userRole")

  const returnTo = encodeURIComponent(location.pathname)

  if (!userRole) {
    return (
      <Navigate
        to={`/signin?requiredRole=${allowedRole}&returnTo=${returnTo}`}
        replace
      />
    )
  }

  if (allowedRole && userRole !== allowedRole) {
    return (
      <Navigate
        to={`/signin?requiredRole=${allowedRole}&returnTo=${returnTo}`}
        replace
      />
    )
  }

  return children
}

export default ProtectedRoute