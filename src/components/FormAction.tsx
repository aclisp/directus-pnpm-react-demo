import { Affix, Flex, Form, theme } from 'antd'

interface FormActionProps {
    label: string
    children: React.ReactNode
}

/**
 * Stands for the Form action panel.
 */
export const FormAction: React.FC<FormActionProps> = ({ label, children }) => {
    const { token } = theme.useToken()

    return (
        <Form.Item layout="vertical" label={label}>
            <Affix>
                <Flex
                    wrap
                    style={{
                        paddingTop: 8,
                        paddingBottom: 8,
                        gap: 8,
                        backgroundColor: token.colorBgElevated,
                    }}
                >
                    {children}
                </Flex>
            </Affix>
        </Form.Item>
    )
}
