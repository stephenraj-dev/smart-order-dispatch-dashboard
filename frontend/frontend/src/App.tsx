import Dashboard from "./pages/Dashboard";
import { useEffect } from "react";
import { login } from "./api/authApi";

function App() {

  useEffect(() => {

    const autoLogin = async () => {

      try {
        const response = await login();
        localStorage.setItem(
          "token",
          response.token
        );

      } catch (error) {

        console.error(
          "Auto login failed",
          error
        );
      }
    };

    autoLogin();

  }, []);
  return <Dashboard />;
}

export default App;