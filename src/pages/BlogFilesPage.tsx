import { Form1 } from '@/components/Form1'
import { FormAction } from '@/components/FormAction'
import { ImageUpload } from '@/components/ImageUpload'
import { LookupSelect, type LookupSelectValueType } from '@/components/LookupSelect'
import { Title } from '@/components/Title'
import { asset2 } from '@/directus/assets'
import { useItemFromPage } from '@/pages/hooks/use-item-from-page'
import { reviseFormValuesForUpdate } from '@/utils/revise-form-values-for-update'
import { CheckOutlined, CopyOutlined } from '@ant-design/icons'
import { createItem, updateItem } from '@directus/sdk'
import type { FormProps } from 'antd'
import { Button, Form, InputNumber } from 'antd'
import { useState } from 'react'

interface FormValues {
    blog_id: string
    directus_files_id: string
    sort: number
}

export function BlogFilesPage() {
    const {
        navigate,
        directus,
        form,
        id,
        data,
        loading,
        isEdit,
        isDirty,
        fields,
        updatePage,
        handleValuesChange,
        prefill,
    } = useItemFromPage('blog_files', [
        'id',
        'blog_id.id',
        'blog_id.title',
        'directus_files_id.id',
        'directus_files_id.title',
        'sort',
    ])

    const [saving, setSaving] = useState(false)

    const onFinish: FormProps<FormValues>['onFinish'] = async (values) => {
        setSaving(true)
        const item = reviseFormValuesForUpdate(values)
        if (isEdit) {
            const data = await directus.request(updateItem('blog_files', id!, item, { fields })).finally(() => setSaving(false))
            updatePage(data)
        } else {
            const data = await directus.request(createItem('blog_files', item, { fields })).finally(() => setSaving(false))
            updatePage(data)
        }
        navigate(-1)
    }

    const handleCopy = async () => {
        const text = `![${data?.directus_files_id.title}](${asset2(directus, data?.directus_files_id)})`
        await navigator.clipboard.writeText(text)
    }

    return (
        <>
            <Title title="文章图片" data={data} />

            <Form1 loading={loading} form={form} onFinish={onFinish} onValuesChange={handleValuesChange}>

                <FormAction label="操作">
                    <Button type="primary" htmlType="submit" disabled={!isDirty} loading={saving}>保存</Button>
                    <CopyButton onClick={handleCopy}>Copy as markdown</CopyButton>
                </FormAction>

                <div className="form-grid">
                    <Form.Item<FormValues> className="form-item" label="文章" name="blog_id">
                        <LookupSelect
                            collection="blog"
                            collectionFields={[
                                { field: ['title'], title: '文章标题' },
                            ]}
                            valueRender={item => item?.title}
                            initialValue={prefill.blog_id as LookupSelectValueType}
                        />
                    </Form.Item>
                    <Form.Item<FormValues> className="form-item" label="图片" name="directus_files_id" rules={[{ required: true }]}>
                        <ImageUpload />
                    </Form.Item>
                    <Form.Item<FormValues> className="form-item" label="序号" name="sort">
                        <InputNumber />
                    </Form.Item>
                </div>

            </Form1>
        </>
    )
}

function CopyButton({
    onClick,
    children,
}: {
    onClick: () => Promise<void>
    children: React.ReactNode
}) {
    const [copied, setCopied] = useState(false)
    const handleClick = async () => {
        await onClick()
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }
    return (
        <Button icon={copied ? <CheckOutlined /> : <CopyOutlined />} onClick={handleClick}>{children}</Button>
    )
}
