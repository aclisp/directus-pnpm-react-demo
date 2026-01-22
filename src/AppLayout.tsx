import { UserOutlined } from '@ant-design/icons'
import { Button, Flex, theme } from 'antd'
import type { NavLinkRenderProps } from 'react-router'
import { Link, NavLink, Outlet } from 'react-router'
import { useDirectusAuth } from './directus'

type NavButtonProps = {
    children: React.ReactNode
} & Partial<NavLinkRenderProps>

function NavButton({ isActive, children }: NavButtonProps) {
    const color = isActive ? 'primary' : 'default'
    const variant = isActive ? 'outlined' : 'link'
    return (<Button variant={variant} color={color} autoInsertSpace={false}>{children}</Button>)
}

function LoginButton() {
    return (
        <Button variant="link" color="default" icon={<UserOutlined style={{ fontSize: 20 }} />} />
    )
}

export function AppLayout() {
    const { token } = useDirectusAuth()
    const { token: { paddingXS, paddingLG } } = theme.useToken()
    return (
        <>
            <Flex id="header" justify="space-between" style={{ padding: paddingXS }}>
                <div>
                    <NavLink to="/">
                        {({ isActive }) => (
                            <NavButton isActive={isActive}>开始</NavButton>
                        )}
                    </NavLink>
                    <NavLink to="/demo1">
                        {({ isActive }) => (
                            <NavButton isActive={isActive}>演示</NavButton>
                        )}
                    </NavLink>
                    <NavLink to="/about">
                        {({ isActive }) => (
                            <NavButton isActive={isActive}>发现</NavButton>
                        )}
                    </NavLink>
                </div>
                <div>
                    <Link to={token ? '/service' : '/login'}>
                        <LoginButton />
                    </Link>
                </div>
            </Flex>
            <div id="main" style={{ padding: paddingLG }}>
                <Outlet />
            </div>
        </>
    )
}
