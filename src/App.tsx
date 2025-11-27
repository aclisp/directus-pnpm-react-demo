import { Button } from "antd";
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
                    <Link to="/login"><Button type="default">Login</Button></Link>
                </div>
            </div>
            <div id="main" style={{ padding: '24px' }} >
                <Outlet />
            </div>
        </div>
    );
}

export default App;
