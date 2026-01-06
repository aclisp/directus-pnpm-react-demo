import { Form, Spin, theme, type FormProps } from 'antd'

interface Form1Props extends FormProps {
    loading: boolean
}

/**
 * General styled Form of antd Form
 */
export function Form1(props: Form1Props) {
    const { token } = theme.useToken()
    const { loading, children, ...restProps } = props

    return (
        <Spin spinning={loading}>
            <Form
                labelCol={{ span: 4 }}
                labelAlign="left"
                colon={false}
                style={{
                    containerType: 'inline-size',
                }}
                styles={{
                    label: { color: token.colorTextSecondary },
                }}
                initialValues={{}}
                {...restProps}
            >
                {children as React.ReactNode}
            </Form>
        </Spin>
    )
}
