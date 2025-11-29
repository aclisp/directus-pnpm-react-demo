import type { FormProps } from "antd";
import { Button, Form, Typography } from "antd";
import { PriceInput, type PriceValue } from "./components/PriceInput";
import { useDirectusAuth } from "./directus";

const { Text } = Typography;

export function About() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_directus, token] = useDirectusAuth()
    if (!token) {
        return (<div>This page need you login</div>)
    }

    return (
        <>
            <div>About</div>
            <Text ellipsis>{token}</Text>
            <TestPriceInputForm />
        </>
    )
}

export default About;

type PriceInputFormFieldType = {
    price: PriceValue
}

function TestPriceInputForm() {
    const onFinish: FormProps<PriceInputFormFieldType>['onFinish'] = (values) => {
        console.log('Received values from form: ', values);
    };

    const checkPrice = (_: unknown, value: { number: number }) => {
        if (value.number > 0) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('Price must be greater than zero!'));
    };

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
    );
}
