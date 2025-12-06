import { Form1 } from '@/components/Form1'
import { FormAction } from '@/components/FormAction'
import { LookupSelect, type LookupSelectValueType } from '@/components/LookupSelect'
import { Title } from '@/components/Title'
import { reviseFormValuesForUpdate } from '@/utils/revise-form-values-for-update'
import { createItem, updateItem } from '@directus/sdk'
import { Button, Form, type FormProps } from 'antd'
import { useItemFromPage } from './hooks/use-item-from-page'

interface FormValues {
    product_id: string
    category_id: number
}

export function ProductCategoryPage() {
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
    } = useItemFromPage('product_category', [
        'id',
        'product_id.id',
        'product_id.name',
        'category_id.id',
        'category_id.name',
        'category_id.parent_id.id',
        'category_id.parent_id.name',
    ])

    const onFinish: FormProps<FormValues>['onFinish'] = async (values) => {
        const item = reviseFormValuesForUpdate(values)
        if (isEdit) {
            const data = await directus.request(updateItem('product_category', id!, item, { fields }))
            updatePage(data)
        } else {
            const data = await directus.request(createItem('product_category', item, { fields }))
            updatePage(data)
        }
        navigate(-1)
    }

    return (
        <>
            <Title title="产品类别" data={data} />
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
                    <Form.Item<FormValues> className="form-item" label="类别" name="category_id">
                        <LookupSelect
                            collection="category"
                            collectionFields={[
                                { field: ['name'], title: '品类名称' },
                                { field: ['parent_id', 'name'], title: '上级品类' },
                            ]}
                        />
                    </Form.Item>
                </div>
            </Form1>
        </>
    )
}
