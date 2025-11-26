import "antd/dist/reset.css";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router";
import { About } from "./About";
import App from './App.tsx';
import { Demo1 } from "./Demo1";
import { Home } from "./Home";
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/demo1" element={<Demo1 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
