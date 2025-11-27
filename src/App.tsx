import { LoginOutlined } from "@ant-design/icons";
import { Button, theme } from "antd";
import type { NavLinkRenderProps } from "react-router";
import { Link, NavLink, Outlet } from "react-router";

type NavButtonProps = {
    children: React.ReactNode;
} & Partial<NavLinkRenderProps>

function NavButton({ isActive, children }: NavButtonProps) {
    const color = isActive ? "primary" : "default"
    const variant = isActive ? "outlined" : "link"
    return (<Button variant={variant} color={color}>{children}</Button>)
}

function LoginButton() {
    const { token } = theme.useToken()
    return (
        <div style={{ width: 50, height: '100%', display: 'flex', justifyContent: 'center' }}>
            <LoginOutlined style={{ fontSize: 20, color: token.colorText }} />
        </div>
    )
}

function App() {
    return (
        <div id="app">
            <div id="header" style={{ padding: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <NavLink to="/">{({ isActive }) => (
                        <NavButton isActive={isActive}>Home</NavButton>
                    )}</NavLink>
                    <NavLink to="/demo1">{({ isActive }) => (
                        <NavButton isActive={isActive}>Demo1</NavButton>
                    )}</NavLink>
                    <NavLink to="/about">{({ isActive }) => (
                        <NavButton isActive={isActive}>About</NavButton>
                    )}</NavLink>
                </div>
                <div>
                    <Link to="/login">
                        <LoginButton />
                    </Link>
                </div>
            </div>
            <div id="main" style={{ padding: '24px' }} >
                <Outlet />
            </div>
        </div>
    );
}

export default App;
