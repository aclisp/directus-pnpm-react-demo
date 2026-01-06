import type { Item } from '@/components/types'
import { useDirectus } from '@/directus'
import { readItem } from '@directus/sdk'
import { useRequest } from 'ahooks'
import { Form, type FormInstance } from 'antd'
import { useState } from 'react'
import { useNavigate, type NavigateFunction } from 'react-router'

interface UsableItem {
    id: string | undefined
    data: Item | undefined
    directus: ReturnType<typeof useDirectus>
    form: FormInstance
    prefill: Record<string, unknown>
    loading: boolean
    isEdit: boolean
    isDirty: boolean
    fields: string[]
    navigate: NavigateFunction
    updatePage: (data: Item) => void
    handleValuesChange: () => void
    setIsDirty: React.Dispatch<React.SetStateAction<boolean>>
    refreshRequest: () => void
}

interface UsableItemOptions {
    fields: string[]
    prefill: Record<string, unknown>
}

export function useItem(collection: string, id: string | undefined, {
    fields,
    prefill,
}: UsableItemOptions): UsableItem {
    const [form] = Form.useForm()
    const directus = useDirectus()
    const navigate = useNavigate() // Depends on the page router

    // Whether it is a 'New Item' form or an 'Edit Item' form
    const isEdit = Boolean(id !== '+')

    // The item data is a reactive state to update the page
    const [data, setData] = useState<Item>()
    // Dirty state is used to enable Save button
    const [isDirty, setIsDirty] = useState(!isEdit)

    // Update the page with item data
    const updatePage = (data: Item) => {
        // Set the form managed data (which is part of the whole data)
        form.resetFields()
        form.setFieldsValue(data)
        // Set non-form managed data
        setData(data)
        // Reset dirty if it is an 'Edit Item' form as the page is just refreshed
        setIsDirty(!isEdit)
    }
    const checkFormDirty = () => {
        // Set dirty if ANY field has been touched
        const fieldsTouched = form.isFieldsTouched(true)
        setIsDirty(fieldsTouched)
    }
    const handleValuesChange = () => {
        // On 'New Item' form there is no need to handle values change
        if (!isEdit) {
            return
        }

        checkFormDirty()
    }

    // Request the initial data
    const prefillId = JSON.stringify(prefill)
    const { loading, refresh: refreshRequest } = useRequest(async () => {
        if (!id || !isEdit) {
            return prefill
        }

        return await directus.request(readItem(
            collection, id, { fields },
        ))
    }, {
        onSuccess: data => updatePage(data),
        refreshDeps: [id, prefillId],
    })

    return {
        id,
        data,
        directus,
        form,
        prefill,
        loading,
        isEdit,
        isDirty,
        fields,
        navigate,
        updatePage,
        handleValuesChange,
        setIsDirty,
        refreshRequest,
    }
}
