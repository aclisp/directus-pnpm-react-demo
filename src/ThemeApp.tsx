import { App, theme } from 'antd'
import { BrowserRouter, Route, Routes } from 'react-router'
import { About } from './About'
import { AppLayout } from './AppLayout'
import { Demo1 } from './Demo1'
import { Home } from './Home'
import { Login } from './Login'
import { LoginOTP } from './LoginOTP'
import { LoginOTPVerify } from './LoginOTPVerify'
import { BlogEditPage } from './pages/BlogEditPage'
import { BlogPage } from './pages/BlogPage'
import { BrandListPage } from './pages/BrandListPage'
import { BrandPage } from './pages/BrandPage'
import { CategoryListPage } from './pages/CategoryListPage'
import { CategoryPage } from './pages/CategoryPage'
import { FactoryPage } from './pages/FactoryPage'
import { ProductCategoryPage } from './pages/ProductCategoryPage'
import { ProductFilesPage } from './pages/ProductFilesPage'
import { ProductPage } from './pages/ProductPage'
import { ProductReviewPage } from './pages/ProductReviewPage'
import { ProductSKUPage } from './pages/ProductSKUPage'
import { ProductSKUSpecPage } from './pages/ProductSKUSpecPage'
import { ProductSpecPage } from './pages/ProductSpecPage'
import { ProductSpecValuePage } from './pages/ProductSpecValuePage'
import { ServicePage } from './pages/ServicePage'
import { UserPage } from './pages/UserPage'

export function ThemeApp() {
    const { token } = theme.useToken()

    return (
        <App style={{
            backgroundColor: token.colorBgContainer,
        }}
        >
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
                    <Route path="login" element={<Login />} />
                    <Route path="login/otp" element={<LoginOTP />} />
                    <Route path="login/otp/verify" element={<LoginOTPVerify />} />
                </Routes>
            </BrowserRouter>
        </App>
    )
}
