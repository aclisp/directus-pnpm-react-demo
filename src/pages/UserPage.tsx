import { Form1 } from '@/components/Form1'
import { FormAction } from '@/components/FormAction'
import { ImageUpload } from '@/components/ImageUpload'
import { Title } from '@/components/Title'
import { datetime } from '@/directus/datetime'
import { reviseFormValuesForUpdate } from '@/utils/revise-form-values-for-update'
import { updateUser } from '@directus/sdk'
import { Button, Form, Input, type FormProps } from 'antd'
import { useUserFromPage, type User } from './hooks/use-user-from-page'

export function UserPage() {
    const {
        navigate,
        directus,
        form,
        id,
        data,
        loading,
        isDirty,
        fields,
        updatePage,
        handleValuesChange,
    } = useUserFromPage()

    const onFinish: FormProps<User>['onFinish'] = async (values) => {
        const item = reviseFormValuesForUpdate(values)
        const data = await directus.request(updateUser(id!, item, { fields }))
        updatePage(data as User)
    }

    const logout = async () => {
        await directus.logout().catch(() => { /* empty */ })
        navigate('/login')
    }

    return (
        <>
            <Title title="用户信息" data={data} />
            <Form1 loading={loading} form={form} onFinish={onFinish} onValuesChange={handleValuesChange}>
                <FormAction label="操作">
                    <Button type="primary" htmlType="submit" disabled={!isDirty}>保存</Button>
                    <Button onClick={logout}>退出登录</Button>
                </FormAction>

                <div className="form-grid">
                    <Form.Item<User> className="form-item" label="名字" name="first_name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item<User> className="form-item" label="姓氏" name="last_name">
                        <Input />
                    </Form.Item>
                    <Form.Item<User> className="form-item" label="状态">
                        {data?.status}
                    </Form.Item>
                    <Form.Item<User> className="form-item" label="Email">
                        {data?.email}
                    </Form.Item>
                    <Form.Item<User> className="form-item" label="上次访问">
                        {datetime(data?.last_access)}
                    </Form.Item>
                    <Form.Item<User> className="form-item" label="语言">
                        {data?.language}
                    </Form.Item>
                    <Form.Item<User> className="form-item" label="头衔" name="title">
                        <Input />
                    </Form.Item>
                    <Form.Item<User> className="form-item" label="地址" name="location">
                        <Input />
                    </Form.Item>
                    <Form.Item<User> className="form-item" label="角色">
                        {data?.role?.name}
                    </Form.Item>
                    <Form.Item<User> className="form-item">
                    </Form.Item>
                    <Form.Item<User> className="form-item" label="头像" name="avatar">
                        <ImageUpload />
                    </Form.Item>
                    <Form.Item<User> className="form-item" label="备注" name="description">
                        <Input.TextArea autoSize={{ minRows: 5, maxRows: 6 }} />
                    </Form.Item>
                </div>
            </Form1>
        </>
    )
}
