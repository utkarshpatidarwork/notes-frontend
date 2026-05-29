import React from "react";
import ReactDOM from "react-dom/client";
import "react-quill/dist/quill.snow.css";

import {
  BrowserRouter
} from "react-router-dom";

import App from "./App";

import "./index.css";

import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    
    <BrowserRouter>
    
      <Toaster />

      <App />
    
    </BrowserRouter>
    
  </React.StrictMode>
);