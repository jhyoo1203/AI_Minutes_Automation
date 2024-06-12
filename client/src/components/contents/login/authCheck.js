import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "./logoutAction";

function AuthCheck() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthTimeout = () => {
      const expiryDate = localStorage.getItem("expiryDate");
      if (!expiryDate) {
        return;
      }

      if (new Date().getTime() > expiryDate) {
        dispatch(logout());
      } else {
        const timeToLogout = expiryDate - new Date().getTime();
        setTimeout(checkAuthTimeout, timeToLogout);
      }
    };

    checkAuthTimeout();
  }, [dispatch]);

  return null;
}

export default AuthCheck;
