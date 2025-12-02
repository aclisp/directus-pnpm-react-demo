import { App, ConfigProvider, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import 'dayjs/locale/zh-cn'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import { About } from './About'
import AppLayout from './App.tsx'
import { Demo1 } from './Demo1'
import { Home } from './Home'
import { Login } from './Login.tsx'
import { ProductDetail } from './pages/ProductDetail.tsx'

import 'antd/dist/reset.css'
import './index.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ConfigProvider
            locale={zhCN}
            theme={{
                algorithm: theme.defaultAlgorithm,
                token: {
                    fontSize: 16,
                },
            }}
        >
            <App>
                <BrowserRouter>
                    <Routes>
                        <Route element={<AppLayout />}>
                            <Route index element={<Home />} />
                            <Route path="about" element={<About />} />
                            <Route path="demo1" element={<Demo1 />} />
                            <Route path="product/:id" element={<ProductDetail />} />
                        </Route>
                        <Route path="login" element={<Login />}>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </App>
        </ConfigProvider>
    </StrictMode>,
)
