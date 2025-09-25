import "./styles/app.css";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Estilos customizados para toast
const customToastStyles = `
  .toast-custom {
    background: #f3f4f6 !important;
    border: none !important;
    border-radius: 12px !important;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
    min-width: 400px !important;
    text-align: center !important;
  }
  
  .toast-custom .flex {
    justify-content: center !important;
    align-items: center !important;
  }
  
  .toast-custom .text-center {
    text-align: center !important;
  }
  
  .toast-custom .space-x-3 {
    justify-content: center !important;
  }
`;

// Adicionar estilos ao head
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = customToastStyles;
  document.head.appendChild(style);
}

function App() {
  return (
    <>
      <AppRoutes />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
