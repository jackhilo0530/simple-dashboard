import { useMemo } from "react";
import { useNavigate } from "react-router";
import { Outlet } from "react-router";
import { AuthContext } from "../contexts";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const AuthProvider = () => {
  const [token, setToken] = useLocalStorage("token", "");
  const navigate = useNavigate();

  const value = useMemo(() => {
    // call this function when you want to authenticate the user
    const signin = async (token: string) => {
      setToken(token);
      navigate("/");
    };

    // call this function to sign out logged in user
    const logout = () => {
      setToken("");
      navigate("/auth/signin", { replace: true });
    };

    return {token, signin, logout };
  }, [token, navigate, setToken]);
  return (
    <AuthContext.Provider value={value}>
      <Outlet/>
    </AuthContext.Provider>
  );
};