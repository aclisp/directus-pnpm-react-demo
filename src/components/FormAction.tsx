import { Affix, Flex, Form, theme } from 'antd'

interface FormActionProps {
    hidden?: boolean
    label: string
    children: React.ReactNode
}

/**
 * Stands for the Form action panel.
 */
export const FormAction: React.FC<FormActionProps> = ({ hidden, label, children }) => {
    const { token } = theme.useToken()

    if (hidden) {
        return <></>
    }

    return (
        <Form.Item layout="vertical" label={label}>
            <Affix>
                <Flex
                    wrap
                    style={{
                        paddingTop: token.paddingContentVerticalSM,
                        paddingBottom: token.paddingContentVerticalSM,
                        gap: token.sizeXS,
                        backgroundColor: token.colorBgContainer,
                    }}
                >
                    {children}
                </Flex>
            </Affix>
        </Form.Item>
    )
}
