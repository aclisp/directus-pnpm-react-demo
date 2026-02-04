import { useDirectus } from '@/directus'
import { useMount } from 'ahooks'
import { App, Button, Form, Input, Radio, Select, type FormProps } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import styles from './CertificateQuery.module.css'

interface FormValues {
    certificate_type: 'student' | 'teacher' | 'institute'
    awarded_to: string
    id_type: 'id_card' | 'passport' | 'id_card_hk' | 'others'
    id_number: string
}

export default function CertificateQuery() {
    const [form] = Form.useForm<FormValues>()
    const directus = useDirectus()
    const navigate = useNavigate()
    const [querying, setQuerying] = useState(false)
    const { modal } = App.useApp()

    useMount(() => {
        form.setFieldsValue({
            certificate_type: 'student',
            awarded_to: '',
            id_type: 'id_card',
            id_number: '',
        })
    })

    const onFinish: FormProps<FormValues>['onFinish'] = async (values) => {
        setQuerying(true)
        await new Promise(resolve => setTimeout(resolve, 2000))
        setQuerying(false)
        modal.warning({
            title: '没有查询到证书',
        })
    }

    return (
        <div className={styles.page}>
            <title>证书查询</title>
            <Form form={form} onFinish={onFinish} className={styles.form} layout="vertical">
                <Form.Item<FormValues> label="证书类别" name="certificate_type" rules={[{ required: true }]}>
                    <Radio.Group options={[
                        { value: 'student', label: '学员' },
                        { value: 'teacher', label: '教师' },
                        { value: 'institute', label: '机构' },
                    ]}
                    />
                </Form.Item>
                <Form.Item<FormValues> label="姓名" name="awarded_to" rules={[{ required: true }]}>
                    <Input autoFocus />
                </Form.Item>
                <Form.Item<FormValues> label="证件类型" name="id_type" rules={[{ required: true }]}>
                    <Select options={[
                        { value: 'id_card', label: '身份证' },
                        { value: 'passport', label: '护照' },
                        { value: 'id_card_hk', label: '港澳台居住证/身份证' },
                        { value: 'others', label: '其他' },
                    ]}
                    />
                </Form.Item>
                <Form.Item<FormValues> label="证件号码" name="id_number" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label={null} className={styles['form-buttons']}>
                    <Button loading={querying} size="large" type="primary" htmlType="submit">
                        {querying ? '请稍候' : '查询'}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
