import { Navigate } from "react-router-dom";
import { getHostToken } from "../utils/hostAuth";

export default function HostRoute({ children }) {
  const token = getHostToken();

  return token ? children : <Navigate to="/host/login" />;
}
