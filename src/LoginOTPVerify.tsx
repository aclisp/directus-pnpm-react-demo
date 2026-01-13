import { useLocalStorageState, useMount } from 'ahooks'
import { Button, Flex, Form, Input, theme, Typography, type FormProps } from 'antd'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { Title as PageTitle } from './components/Title'
import { useDirectus } from './directus'
import { directusError } from './directus/errors'
import { LoginOTPForm } from './LoginOTP'

const { Title, Text } = Typography

export function LoginOTPVerify() {
    const { token } = theme.useToken()

    const directus = useDirectus()

    const navigate = useNavigate()

    const [deviceId, setDeviceId] = useLocalStorageState('login-otp-device-id', { defaultValue: '' })

    const [error, setError] = useState<string>()

    const [matched, setMatched] = useState(false)

    const [verifying, setVerifying] = useState(false)

    const [disableVerify, setDisableVerify] = useState(false)

    const [searchParams] = useSearchParams()

    const email = searchParams.get('email')

    useMount(() => {
        if (!deviceId) {
            setDeviceId(nanoid())
        }
    })

    const onFinish: FormProps['onFinish'] = async (values) => {
        setVerifying(true)
        try {
            const { message }: { message: string } = await directus.request(() => ({
                method: 'POST',
                path: '/otp-auth/verify',
                body: JSON.stringify({
                    identifier: email,
                    deviceId,
                    code: values.code,
                }),
            }))
            setError(undefined)
            setMatched(true)
            await directus.login({ email: email!, password: message })
            navigate('/')
        } catch (error) {
            const response = (error as { response?: Response }).response
            if (response
                && [400/* Expired code */, 403/* Too many failed attempts */].includes(response?.status)) {
                setDisableVerify(true)
            }
            setError(directusError(error))
            setMatched(false)
        } finally {
            setVerifying(false)
        }
    }

    const otpFormItems = (
        <>
            <div style={{ height: 100 }}>{/* Image placeholder */}</div>
            <Title level={4}>E-Mail Verification</Title>
            <Flex vertical>
                <Text type="secondary">We sent verification code to</Text>
                <Text style={{ color: token.colorPrimary }}>{email}</Text>
            </Flex>
            <Form.Item
                label="Enter Code"
                name="code"
                rules={[{
                    required: true, type: 'string', pattern: /^\d{6}$/,
                    message: 'Enter the 6-digit code sent to your email',
                }]}
            >
                <Input.OTP size="large" length={6} inputMode="numeric" />
            </Form.Item>
            {error && <Text type="danger">{error}</Text>}
            {matched && <Text type="success">OTP matched successfully.</Text>}
        </>
    )

    const optButton = (
        <Button loading={verifying} disabled={disableVerify} size="large" type="primary" htmlType="submit" shape="round" style={{ marginBottom: token.sizeXXL }}>
            Verify
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
