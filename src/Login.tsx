import { readMe } from "@directus/sdk";
import { useRequest } from "ahooks";
import type { FormProps } from 'antd';
import { App, Button, Card, Flex, Form, Input } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useDirectus } from "./directus";
import { directusError } from "./directus/errors";

type LoginReq = {
    username: string
    password: string
}

function LoginForm({ onLoginSuccess }: { onLoginSuccess: () => void }) {
    const { modal } = App.useApp()
    const directus = useDirectus()
    const navigate = useNavigate()
    const onFinish: FormProps<LoginReq>['onFinish'] = async (values) => {
        try {
            await directus.login({ email: values.username, password: values.password })
            onLoginSuccess()
            modal.info({ content: '登录成功' })
            navigate("/login")
        } catch (error) {
            modal.error({ content: directusError(error) })
        }
    };

    return (
        <Form layout="vertical" style={{ width: '80%', maxWidth: '300px' }} onFinish={onFinish}>
            <Form.Item<LoginReq> label="用户名" name="username">
                <Input />
            </Form.Item>
            <Form.Item<LoginReq> label="密码" name="password">
                <Input.Password />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    登录
                </Button>
            </Form.Item>
        </Form>
    )
}

function UserInfo({ data, onLogoutSuccess }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Record<string, any> | undefined;
    onLogoutSuccess: () => void;
}) {
    const directus = useDirectus()
    const navigate = useNavigate()
    const logout = async () => {
        await directus.logout().catch(() => { })
        onLogoutSuccess()
        navigate("/login")
    }
    const goHome = () => {
        navigate("/")
    }

    return (
        <Flex vertical gap="large" style={{ width: '90%', maxWidth: '600px', marginTop: 24, marginBottom: 24 }}>
            <Card title="你已经登录了">
                <pre>{JSON.stringify(data, null, 4)}</pre>
            </Card>
            <Flex gap="large" justify="center">
                <Button type="primary" onClick={logout}>
                    退出登录
                </Button>
                <Button type="default" onClick={goHome}>
                    返回首页
                </Button>
            </Flex>
        </Flex>
    )
}

export function Login() {
    const [isLogin, setIsLogin] = useState(false)
    const onLoginSuccess = () => { setIsLogin(true) }
    const onLogoutSuccess = () => { setIsLogin(false) }
    const directus = useDirectus()
    const { data } = useRequest(async () => {
        return await directus.request(readMe())
    }, {
        refreshDeps: [isLogin],
        onSuccess: () => { setIsLogin(true) },
        onError: () => { setIsLogin(false) },
    })

    return (
        <Flex vertical style={{ width: '100%', minHeight: '100dvh' }} justify="center" align="center" gap="large">
            {isLogin
                ? <UserInfo data={data} onLogoutSuccess={onLogoutSuccess} />
                : <LoginForm onLoginSuccess={onLoginSuccess} />}
        </Flex>
    )
}
