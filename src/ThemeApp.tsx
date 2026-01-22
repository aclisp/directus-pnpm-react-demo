import { App, theme } from 'antd'
import { RouterProvider } from 'react-router/dom'
import { router } from './router'

export function ThemeApp() {
    const { token } = theme.useToken()

    return (
        <App style={{
            backgroundColor: token.colorBgContainer,
        }}
        >
            <RouterProvider router={router} />
        </App>
    )
}
