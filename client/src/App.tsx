import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes/AppRoutes";
import type React from "react";

const App:React.FC = () => {

  return (
    <BrowserRouter  >
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
  