import { Form1 } from '@/components/Form1'
import { FormAction } from '@/components/FormAction'
import { LookupSelect, type LookupSelectValueType } from '@/components/LookupSelect'
import { RelatedList } from '@/components/RelatedList'
import type { Item } from '@/components/types'
import { Button, Form, Input, type FormInstance, type FormProps } from 'antd'
import { useNavigate } from 'react-router'
import { ProductSpecValueDrawer } from '../ProductSpecValuePage/ProductSpecValueDrawer'

export interface FormValues {
    name: string
    product_id: string
}

interface _FormProps {
    form: FormInstance
    data: Item | undefined
    loading: boolean
    isEdit: boolean
    isDirty: boolean
    saving: boolean
    hideAction?: boolean
    onFinish: FormProps<FormValues>['onFinish']
    handleValuesChange: FormProps<FormValues>['onValuesChange']
    prefill: Record<string, unknown>
}

export function ProductSpecForm({
    form,
    data,
    loading,
    isEdit,
    isDirty,
    saving,
    hideAction,
    onFinish,
    handleValuesChange,
    prefill,
}: _FormProps) {
    const navigate = useNavigate()

    const createProductSpecValue = () => {
        const params = new URLSearchParams({
            'specification_definition_id.id': data?.id,
            'specification_definition_id.name': data?.name,
            'specification_definition_id.product_id.id': data?.product_id.id,
            'specification_definition_id.product_id.name': data?.product_id.name,
        })
        navigate(`/form/specification_values/+?` + params.toString())
    }

    return (
        <Form1 loading={loading} form={form} onFinish={onFinish} onValuesChange={handleValuesChange}>
            <FormAction label="操作" hidden={hideAction}>
                <Button type="primary" htmlType="submit" disabled={!isDirty} loading={saving}>保存</Button>
                {isEdit && <Button onClick={createProductSpecValue}>新增规格值</Button>}
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
                <Form.Item<FormValues> className="form-item" label="规格名称" name="name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
            </div>
            {isEdit && <ProductSpecValues data={data} />}
        </Form1>
    )
}

function ProductSpecValues({ data }: { data?: Item }) {
    return (
        <Form.Item>
            <RelatedList
                foreignKeyField="specification_definition_id"
                foreignKeyValue={data?.id}
                collection="specification_values"
                collectionFields={[
                    { field: ['value'], title: '规格值' },
                ]}
                showEdit
                showTitle
                collectionTitle={['value']}
                drawer={ProductSpecValueDrawer}
                prefill={{
                    specification_definition_id: {
                        id: data?.id,
                        name: data?.name,
                        product_id: {
                            id: data?.product_id.id,
                            name: data?.product_id.name,
                        },
                    },
                }}
            />
        </Form.Item>
    )
}
