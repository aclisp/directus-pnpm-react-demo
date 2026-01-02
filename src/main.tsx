import 'antd/dist/reset.css'
import 'github-markdown-css/github-markdown-light.css'
import './index.css'

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
import { BlogEditPage } from './pages/BlogEditPage.tsx'
import { BlogPage } from './pages/BlogPage.tsx'
import { BrandListPage } from './pages/BrandListPage.tsx'
import { BrandPage } from './pages/BrandPage.tsx'
import { CategoryListPage } from './pages/CategoryListPage.tsx'
import { CategoryPage } from './pages/CategoryPage.tsx'
import { FactoryPage } from './pages/FactoryPage.tsx'
import { ProductCategoryPage } from './pages/ProductCategoryPage.tsx'
import { ProductFilesPage } from './pages/ProductFilesPage.tsx'
import { ProductPage } from './pages/ProductPage.tsx'
import { ProductReviewPage } from './pages/ProductReviewPage.tsx'
import { ProductSKUPage } from './pages/ProductSKUPage.tsx'
import { ProductSKUSpecPage } from './pages/ProductSKUSpecPage.tsx'
import { ProductSpecPage } from './pages/ProductSpecPage.tsx'
import { ProductSpecValuePage } from './pages/ProductSpecValuePage.tsx'
import { ServicePage } from './pages/ServicePage.tsx'
import { UserPage } from './pages/UserPage.tsx'

/**
 * index.html 添加了过审用的 title 和 beian。
 * 初始化时，移除它们，将由 react 来渲染
 */
const removeTitle = () => {
    const title = document.getElementsByTagName('title')[0]
    if (title) {
        title.remove()
    }
}

const removeBeian = () => {
    const beian = document.getElementById('beian')
    if (beian) {
        beian.remove()
    }
}

const removeLoader = () => {
    const loader = document.getElementById('initial-loader')
    if (loader) {
        // 添加隐藏类，触发 CSS 渐隐过渡效果
        loader.classList.add('initial-loader-hidden')

        // 延迟移除，等待过渡效果完成（这里设置 500ms，匹配 CSS 中的 0.5s）
        setTimeout(() => {
            loader.remove()
        }, 500)
    }
}

removeTitle()
removeBeian()

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
                            <Route path="blog/:permalink" element={<BlogPage />} />
                            <Route path="about" element={<About />} />
                            <Route path="demo1" element={<Demo1 />} />
                            <Route path="factory" element={<FactoryPage />} />
                            <Route path="form">
                                <Route path="product/:id" element={<ProductPage />} />
                                <Route path="product_reviews/:id" element={<ProductReviewPage />} />
                                <Route path="product_category/:id" element={<ProductCategoryPage />} />
                                <Route path="product_files/:id" element={<ProductFilesPage />} />
                                <Route path="specification_definition/:id" element={<ProductSpecPage />} />
                                <Route path="specification_values/:id" element={<ProductSpecValuePage />} />
                                <Route path="stock_keeping_unit/:id" element={<ProductSKUPage />} />
                                <Route path="stock_keeping_unit_specification_junction/:id" element={<ProductSKUSpecPage />} />
                                <Route path="brand/:id" element={<BrandPage />} />
                                <Route path="category/:id" element={<CategoryPage />} />
                                <Route path="blog/:id" element={<BlogEditPage />} />
                            </Route>
                            <Route path="user" element={<UserPage />} />
                            <Route path="service" element={<ServicePage />} />
                            <Route path="brand" element={<BrandListPage />} />
                            <Route path="category" element={<CategoryListPage />} />
                        </Route>
                        <Route path="login" element={<Login />}>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </App>
        </ConfigProvider>
    </StrictMode>,
)

removeLoader()
