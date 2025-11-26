import { ConfigProvider } from 'antd';
import "antd/dist/reset.css";
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
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
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Routes>
          <Route element={<App />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="demo1" element={<Demo1 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  </StrictMode>,
)
