import ReactDOM from "react-dom/client"
import React from "react"

import "reseter.css"
import "./index.css"

import { App } from "./app"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
