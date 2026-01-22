import { createBrowserRouter, type RouteObject } from 'react-router'
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

const routes: RouteObject[] = [
    { path: 'login', Component: Login },
    { path: 'login/otp', Component: LoginOTP },
    { path: 'login/otp/verify', Component: LoginOTPVerify },
    {
        Component: AppLayout,
        children: [
            { index: true, Component: Home },
            { path: 'blog/:permalink', Component: BlogPage },
            { path: 'about', Component: About },
            { path: 'demo1', Component: Demo1 },
            { path: 'factory', Component: FactoryPage },
            { path: 'user', Component: UserPage },
            { path: 'service', Component: ServicePage },
            { path: 'brand', Component: BrandListPage },
            { path: 'category', Component: CategoryListPage },
            {
                path: 'form',
                children: [
                    { path: 'product/:id', Component: ProductPage },
                    { path: 'product_reviews/:id', Component: ProductReviewPage },
                    { path: 'product_category/:id', Component: ProductCategoryPage },
                    { path: 'product_files/:id', Component: ProductFilesPage },
                    { path: 'specification_definition/:id', Component: ProductSpecPage },
                    { path: 'specification_values/:id', Component: ProductSpecValuePage },
                    { path: 'stock_keeping_unit/:id', Component: ProductSKUPage },
                    { path: 'stock_keeping_unit_specification_junction/:id', Component: ProductSKUSpecPage },
                    { path: 'brand/:id', Component: BrandPage },
                    { path: 'category/:id', Component: CategoryPage },
                    { path: 'blog/:id', Component: BlogEditPage },
                ],
            },
        ],
    },
]

export const router = createBrowserRouter(routes)
