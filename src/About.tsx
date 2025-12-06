import type { FormProps } from 'antd'
import { Button, Form, Typography } from 'antd'
import { PriceInput, type PriceValue } from './components/PriceInput'
import { StyledText } from './components/StyledText/StyledText'
import { Title } from './components/Title'
import { useDirectusAuth } from './directus'

const { Text } = Typography

export function About() {
    const { token } = useDirectusAuth()
    if (!token) {
        return (
            <>
                <Title title="关于" />
                <div>This page need you login</div>
            </>
        )
    }

    return (
        <>
            <Title title="关于" />
            <div>About</div>
            <Text ellipsis>{token}</Text>
            <TestPriceInputForm />
            <StyledText value="风格文字" />
        </>
    )
}

export default About

interface PriceInputFormFieldType {
    price: PriceValue
}

function TestPriceInputForm() {
    const onFinish: FormProps<PriceInputFormFieldType>['onFinish'] = (values) => {
        console.log('Received values from form: ', values)
    }

    const checkPrice = (_: unknown, value: { number: number }) => {
        if (value.number > 0) {
            return Promise.resolve()
        }
        return Promise.reject(new Error('Price must be greater than zero!'))
    }

    return (
        <Form
            name="test_price_input"
            layout="inline"
            onFinish={onFinish}
            initialValues={{
                price: { number: 0, currency: 'rmb' },
            }}
        >
            <Form.Item<PriceInputFormFieldType> name="price" label="Price" rules={[{ validator: checkPrice }]}>
                <PriceInput />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
}
