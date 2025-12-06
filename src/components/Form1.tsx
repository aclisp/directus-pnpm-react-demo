import { Form, theme, type FormProps } from 'antd'

/**
 * General styled Form of antd Form
 */
export function Form1(props: FormProps) {
    const { token } = theme.useToken()
    const { children, ...restProps } = props

    return (
        <Form
            labelCol={{ span: 4 }}
            labelAlign="left"
            colon={false}
            styles={{
                label: { color: token.colorTextSecondary },
            }}
            {...restProps}
        >
            {children as React.ReactNode}
        </Form>
    )
}
