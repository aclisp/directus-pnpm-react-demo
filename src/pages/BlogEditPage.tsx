import { Form1 } from '@/components/Form1'
import { FormAction } from '@/components/FormAction'
import { Title } from '@/components/Title'
import type { Item } from '@/components/types'
import { directusError } from '@/directus/errors'
import { reviseFormValuesForUpdate } from '@/utils/revise-form-values-for-update'
import { EditorView } from '@codemirror/view'
import { createItem, updateItem } from '@directus/sdk'
import MarkdownEditor from '@uiw/react-markdown-editor'
import { App, Button, Form, Input, Radio, type FormProps } from 'antd'
import { useState } from 'react'
import { useItemFromPage } from './hooks/use-item-from-page'

interface FormValues {
    permalink: string
    title: string
    content: string
    status: string
}

export function BlogEditPage() {
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
    } = useItemFromPage('blog', [
        'id',
        'permalink',
        'title',
        'content',
        'status',
    ])

    const [saving, setSaving] = useState(false)

    const { modal } = App.useApp()

    const onFinish: FormProps<FormValues>['onFinish'] = async (values) => {
        setSaving(true)
        const item = reviseFormValuesForUpdate(values)
        let promise: Promise<Item>
        if (isEdit) {
            promise = directus.request(updateItem('blog', id!, item, { fields }))
        } else {
            promise = directus.request(createItem('blog', item, { fields }))
        }
        promise
            .then((data) => {
                updatePage(data)
                navigate(`/blog/${data.permalink}`)
            })
            .catch((error) => {
                modal.error({ content: directusError(error) })
            })
            .finally(() => setSaving(false))
    }

    return (
        <>
            <Title title="Blog" data={data} />
            <Form1 loading={loading} form={form} onFinish={onFinish} onValuesChange={handleValuesChange}>
                <FormAction label="操作">
                    <Button type="primary" htmlType="submit" disabled={!isDirty} loading={saving}>保存</Button>
                </FormAction>

                <div className="form-grid">
                    <Form.Item<FormValues> className="form-item" label="Permalink" name="permalink" rules={[{ required: true, type: 'string', min: 3 }, { pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/, message: 'Permalink必须由小写字母、数字和连字符组成' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item<FormValues> className="form-item" label="标题" name="title" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item<FormValues> className="form-item" label="状态" name="status">
                        <Radio.Group
                            options={[
                                { value: 'draft', label: '草稿' },
                                { value: 'published', label: '正式' },
                                { value: 'archived', label: '归档' },
                            ]}
                        />
                    </Form.Item>
                </div>

                <Form.Item<FormValues> labelCol={{ span: 2 }} className="form-item-full" label="内容" name="content" rules={[{ required: true }]}>
                    <MarkdownEditor
                        minHeight="200px"
                        enablePreview={false}
                        basicSetup={{
                            lineNumbers: false,
                            foldGutter: false,
                        }}
                        extensions={[
                            EditorView.lineWrapping,
                        ]}
                    />
                </Form.Item>
            </Form1>
        </>
    )
}
