import { useCountDown, useLocalStorageState, useMount } from 'ahooks'
import { Button, Flex, Form, Input, theme, Typography, type FormProps } from 'antd'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Title as PageTitle } from './components/Title'
import { useDirectus } from './directus'
import { directusError } from './directus/errors'

const { Title, Text } = Typography

export function LoginOTP() {
    const { token } = theme.useToken()

    const directus = useDirectus()

    const navigate = useNavigate()

    const [deviceId, setDeviceId] = useLocalStorageState('login-otp-device-id', { defaultValue: '' })

    const [error, setError] = useState<string>()

    const [sending, setSending] = useState(false)

    const [disableSend, setDisableSend] = useState(false)

    const [targetDate, setTargetDate] = useState<number>()

    const [countdown] = useCountDown({
        targetDate,
        onEnd: () => {
            setDisableSend(false)
            setError(undefined)
        },
    })

    useMount(() => {
        if (!deviceId) {
            setDeviceId(nanoid())
        }
    })

    const onFinish: FormProps['onFinish'] = async (values) => {
        setSending(true)
        try {
            await directus.request(() => ({
                method: 'POST',
                path: '/otp-auth/send',
                body: JSON.stringify({
                    identifier: values.email,
                    deviceId,
                }),
            }))
            const params = new URLSearchParams({ email: values.email })
            navigate('/login/otp/verify?' + params.toString())
        } catch (error) {
            const response = (error as { response?: Response }).response
            if (response?.status === 429) {
                setDisableSend(true)
                // Need server set Access-Control-Expose-Headers
                const retryAfter = Number(response.headers.get('Retry-After'))
                setTargetDate(Date.now() + retryAfter * 1000)
            }
            setError(directusError(error))
        } finally {
            setSending(false)
        }
    }

    const otpFormItems = (
        <>
            <div style={{ height: 100 }}>{/* Image placeholder */}</div>
            <Title level={4}>Login to your account</Title>
            <Form.Item
                label="Email"
                name="email"
                rules={[{
                    required: true, type: 'email', message: 'Please enter a valid email address',
                }]}
            >
                <Input size="large" type="email" autoComplete="username" />
            </Form.Item>
            {error && <Text type="danger">{error}</Text>}
        </>
    )

    const optButton = (
        <Button loading={sending} disabled={disableSend} size="large" type="primary" htmlType="submit" shape="round" style={{ marginBottom: token.sizeXXL }}>
            {countdown === 0 ? 'Login' : `Retry after ${Math.round(countdown / 1000)}s`}
        </Button>
    )

    return (
        <>
            <PageTitle title="Login" />
            <LoginOTPForm
                otpFormItems={otpFormItems}
                optButton={optButton}
                onFinish={onFinish}
            />
        </>
    )
}

interface LoginOTPForm extends FormProps {
    otpFormItems: React.ReactNode
    optButton: React.ReactNode
}

export function LoginOTPForm(props: LoginOTPForm) {
    const { token } = theme.useToken()
    const { otpFormItems: otpItems, optButton, ...restProps } = props

    return (
        <Form layout="vertical" requiredMark="optional" {...restProps}>
            <Flex vertical justify="space-between" style={{ marginLeft: 'auto', marginRight: 'auto', padding: token.paddingLG, width: '100%', maxWidth: 400, minHeight: '100dvh' }}>
                <Flex vertical gap="large">
                    {otpItems}
                </Flex>
                {optButton}
            </Flex>
        </Form>
    )
}
