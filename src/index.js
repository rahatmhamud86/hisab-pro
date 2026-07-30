import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// PWA: অফলাইন সাপোর্ট ও ইনস্টলযোগ্যতার জন্য service worker রেজিস্টার করা হলো
serviceWorkerRegistration.register();

reportWebVitals();
