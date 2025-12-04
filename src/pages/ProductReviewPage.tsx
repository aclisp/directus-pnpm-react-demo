import { createItem, updateItem } from '@directus/sdk'
import { Button, Form, Input, InputNumber, type FormProps } from 'antd'
import { Form1 } from '../components/Form1'
import { FormAction } from '../components/FormAction'
import { LookupSelect, type LookupSelectValueType } from '../components/LookupSelect'
import { SystemFields } from '../components/SystemFields'
import { Title } from '../components/Title'
import { reviseFormValuesForUpdate } from '../utils/revise-form-values-for-update'
import { useItemFromPage } from './use-item-from-page'

interface FormValues {
    title: string
    content: string
    rating: number
    product_id: string
    status: string
}

export function ProductReviewPage() {
    const {
        navigate,
        directus,
        form,
        id,
        prefill,
        data,
        isEdit,
        isDirty,
        fields,
        updatePage,
        handleValuesChange,
    } = useItemFromPage('product_reviews', [
        'id',
        'title',
        'content',
        'status',
        'rating',
        'product_id.id',
        'product_id.name',
        'user_created.first_name',
        'user_created.last_name',
        'date_created',
        'user_updated.first_name',
        'user_updated.last_name',
        'date_updated',
    ])

    const onFinish: FormProps<FormValues>['onFinish'] = async (values) => {
        const item = reviseFormValuesForUpdate(values)
        if (isEdit) {
            const data = await directus.request(updateItem('product_reviews', id!, item, { fields }))
            updatePage(data)
        } else {
            const data = await directus.request(createItem('product_reviews', item, { fields }))
            updatePage(data)
        }
        navigate(-1)
    }

    return (
        <>
            <Title title="产品评论" data={data} />
            <Form1 form={form} onFinish={onFinish} onValuesChange={handleValuesChange}>
                <FormAction label="操作">
                    <Button type="primary" htmlType="submit" disabled={!isDirty}>保存</Button>
                </FormAction>

                <div className="form-grid">
                    <Form.Item<FormValues> className="form-item" label="产品" name="product_id">
                        <LookupSelect
                            collection="product"
                            collectionFields={[
                                { field: ['name'], title: '产品名称' },
                            ]}
                            initialValue={prefill.product_id as LookupSelectValueType}
                        />
                    </Form.Item>
                    <Form.Item<FormValues> className="form-item" label="评分" name="rating">
                        <InputNumber />
                    </Form.Item>
                    <Form.Item<FormValues> className="form-item" label="标题" name="title">
                        <Input />
                    </Form.Item>
                </div>

                <Form.Item<FormValues> labelCol={{ span: 2 }} className="form-item-full" label="内容" name="content">
                    <Input.TextArea />
                </Form.Item>

                {isEdit && <SystemFields data={data} />}
            </Form1>
        </>
    )
}
