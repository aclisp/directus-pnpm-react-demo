import { createItem, updateItem } from '@directus/sdk'
import { Affix, Button, Flex, Form, theme, type FormProps } from 'antd'
import { LookupSelect, type LookupSelectValueType } from '../components/LookupSelect'
import { Title } from '../components/Title'
import { reviseFormValuesForUpdate } from '../utils/revise-form-values-for-update'
import { useItemFromPage } from './use-item-from-page'

interface FormValues {
    product_id: string
    category_id: number
}

export function ProductCategoryPage() {
    const { token } = theme.useToken()

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
            <Form form={form} labelCol={{ span: 4 }} labelAlign="left" colon={false} onFinish={onFinish} onValuesChange={handleValuesChange} styles={{ label: { color: token.colorTextSecondary } }}>
                <Form.Item layout="vertical" label="操作">
                    <Affix>
                        <Flex wrap style={{ paddingTop: 8, paddingBottom: 8, gap: 8, backgroundColor: token.colorBgElevated }}>
                            <Button type="primary" htmlType="submit" disabled={!isDirty}>保存</Button>
                        </Flex>
                    </Affix>
                </Form.Item>

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
            </Form>
        </>
    )
}
