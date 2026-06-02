//main.jsx
import React from "react";
import ReactDOM from "react-dom/client";

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
    
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,

          style: {
            background: "#1e293b",
            color: "#fff",
            borderRadius: "14px",
            padding: "14px 18px",
            fontSize: "15px",
            boxShadow:
              "0 10px 25px rgba(0,0,0,0.25)"
          },

          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff"
            }
          },

          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff"
            }
          }
        }}
      />

      <App />
    
    </BrowserRouter>
    
  </React.StrictMode>
);