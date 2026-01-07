import { Form1 } from '@/components/Form1'
import { FormAction } from '@/components/FormAction'
import { LookupSelect, type LookupSelectValueType } from '@/components/LookupSelect'
import type { Item } from '@/components/types'
import { Button, Form, Input, type FormInstance, type FormProps } from 'antd'

export interface FormValues {
    value: string
    specification_definition_id: string
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

export function ProductSpecValueForm({
    form,
    data,
    loading,
    isDirty,
    saving,
    hideAction,
    onFinish,
    handleValuesChange,
    prefill,
}: _FormProps) {
    return (
        <Form1 loading={loading} form={form} onFinish={onFinish} onValuesChange={handleValuesChange}>
            <FormAction label="操作" hidden={hideAction}>
                <Button type="primary" htmlType="submit" disabled={!isDirty} loading={saving}>保存</Button>
            </FormAction>
            <div className="form-grid">
                <Form.Item className="form-item" label="产品">
                    <div>{data?.specification_definition_id.product_id.name}</div>
                </Form.Item>
                <Form.Item<FormValues> className="form-item" label="规格名称" name="specification_definition_id">
                    <LookupSelect
                        collection="specification_definition"
                        collectionFields={[
                            { field: ['name'], title: '产品规格' },
                        ]}
                        initialValue={prefill.specification_definition_id as LookupSelectValueType}
                    />
                </Form.Item>
                <Form.Item<FormValues> className="form-item" label="规格值" name="value" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
            </div>
        </Form1>
    )
}
