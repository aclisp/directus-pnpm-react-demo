import { LeftOutlined } from '@ant-design/icons'
import type { FormProps } from 'antd'
import { App, Button, Flex, Form, Input, Result, theme } from 'antd'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Title } from './components/Title'
import { useDirectus, useDirectusAuth } from './directus'
import { directusError } from './directus/errors'

interface LoginReq {
    username: string
    password: string
}

function LoginForm({ onLoginSuccess }: {
    onLoginSuccess: () => void
}) {
    const { modal } = App.useApp()
    const directus = useDirectus()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const onFinish: FormProps<LoginReq>['onFinish'] = async (values) => {
        try {
            setLoading(true)
            await directus.login({ email: values.username, password: values.password })
            onLoginSuccess()
            modal.info({ content: '登录成功' })
            navigate('/login')
        } catch (error) {
            modal.error({ content: directusError(error) })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form layout="vertical" style={{ width: '80%', maxWidth: '300px' }} onFinish={onFinish} requiredMark="optional">
            <Form.Item<LoginReq> label="用户名" name="username" rules={[{ required: true, type: 'email' }]}>
                <Input type="email" autoComplete="username" />
            </Form.Item>
            <Form.Item<LoginReq> label="密码" name="password" rules={[{ required: true }]}>
                <Input.Password autoComplete="current-password" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    登录
                </Button>
            </Form.Item>
        </Form>
    )
}

function UserInfo({ onLogoutSuccess }: {
    onLogoutSuccess: () => void
}) {
    const directus = useDirectus()
    const navigate = useNavigate()
    const logout = async () => {
        await directus.logout().catch(() => { /* empty */ })
        onLogoutSuccess()
        navigate('/login')
    }
    const goHome = () => {
        navigate('/')
    }

    return (
        <Result
            styles={{ icon: { display: 'none' } }}
            title="你已经登录了"
            extra={[
                <Button key="logout" type="primary" onClick={logout}>
                    退出登录
                </Button>,
                <Button key="gohome" type="default" onClick={goHome}>
                    返回首页
                </Button>,
            ]}
        />
    )
}

export function Login() {
    const { token, refreshToken } = useDirectusAuth()
    const isLogin = Boolean(token)
    const { token: { paddingXS } } = theme.useToken()

    return (
        <>
            <Title title="登录" />
            {isLogin || (
                <div style={{ padding: paddingXS, position: 'absolute' }}>
                    <Link to="/"><HomeButton /></Link>
                </div>
            )}
            <Flex vertical style={{ width: '100%', minHeight: '100dvh' }} justify="center" align="center" gap="large">
                {isLogin
                    ? <UserInfo onLogoutSuccess={refreshToken} />
                    : <LoginForm onLoginSuccess={refreshToken} />}
            </Flex>
        </>
    )
}

function HomeButton() {
    return (
        <Button variant="link" color="default" styles={{ icon: { paddingTop: 2 } }} icon={<LeftOutlined style={{ fontSize: 20 }} />} />
    )
}
