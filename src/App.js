import "./App.css";
import HomePage from "./components/HomePage/HomePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./components/AuthPages/useAuth";
import { useEffect } from "react";
function App() {
  useEffect(()=>{localStorage.setItem('admin', JSON.stringify([{ email: "admin@iamneo.ai", password: "qwedsa" }]));},[])
  return (
    <AuthProvider>
      <div className="App">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <HomePage />
      </div>
    </AuthProvider>
  );
}
export default App;
