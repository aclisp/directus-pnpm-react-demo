import type { FormProps } from 'antd'
import { App, Button, DatePicker, Form, Space, Typography, version } from 'antd'
import { version as reactVersion } from 'react'
import { PriceInput, type PriceValue } from './components/PriceInput'
import { StyledText } from './components/StyledText/StyledText'
import { Title } from './components/Title'
import { useDirectusAuth } from './directus'

const { Text } = Typography

export function About() {
    const { modal } = App.useApp()
    const { token } = useDirectusAuth()

    if (!token) {
        return (
            <>
                <Title title="关于" />
                <div>This page need you login</div>
            </>
        )
    }

    const onClick = () => {
        modal.info({ title: 'Good', content: 'You are Okay!' })
    }

    return (
        <>
            <Title title="关于" />
            <div>关于</div>
            antd@
            {version}
            , react@
            {reactVersion}
            <br />
            <br />
            <Space>
                <DatePicker />
                <Button type="primary" onClick={onClick}>Submit</Button>
            </Space>
            <Text ellipsis>{token}</Text>
            <TestPriceInputForm />
            <StyledText value="风格文字" />
        </>
    )
}

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
