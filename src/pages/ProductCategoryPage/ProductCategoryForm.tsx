import { Form1 } from '@/components/Form1'
import { FormAction } from '@/components/FormAction'
import { LookupSelect, type LookupSelectValueType } from '@/components/LookupSelect'
import type { Item } from '@/components/types'
import { Button, Form, type FormInstance, type FormProps } from 'antd'

export interface FormValues {
    product_id: string
    category_id: number
}

interface _FormProps {
    form: FormInstance
    data: Item | undefined
    loading: boolean
    isDirty: boolean
    saving: boolean
    onFinish: FormProps<FormValues>['onFinish']
    handleValuesChange: FormProps<FormValues>['onValuesChange']
    prefill: Record<string, unknown>
}

export function ProductCategoryForm({
    form,
    loading,
    isDirty,
    saving,
    onFinish,
    handleValuesChange,
    prefill,
}: _FormProps) {
    return (
        <Form1 loading={loading} form={form} onFinish={onFinish} onValuesChange={handleValuesChange}>
            <FormAction label="操作">
                <Button type="primary" htmlType="submit" disabled={!isDirty} loading={saving}>保存</Button>
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
                <Form.Item<FormValues> className="form-item" label="类别" name="category_id" rules={[{ required: true }]}>
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
    )
}
