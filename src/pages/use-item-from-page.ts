import { readItem } from '@directus/sdk'
import { useRequest } from 'ahooks'
import { Form } from 'antd'
import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router'
import type { Item } from '../components/types'
import { useDirectus } from '../directus'
import { queryToNestedObject } from '../utils/query-to-nested-object'

/**
 * This hook can only be called from the Page component.
 */
export function useItemFromPage(collection: string, fields: string[]) {
    const [form] = Form.useForm()
    const params = useParams() // Depends on the Page's url
    const [searchParams] = useSearchParams() // Depends on the Page's url
    const directus = useDirectus()

    // The item data is a reactive state to update the page
    const [data, setData] = useState<Item>()
    // Dirty state is used to enable Save button
    const [isDirty, setIsDirty] = useState(false)

    // The prefilled data is coming from the Page's url query string
    const prefill = queryToNestedObject(searchParams)
    // Whether it is a 'New Item' form or an 'Edit Item' form
    const isEdit = Boolean(params.id && params.id != '+')
    // Update the page with item data
    const updatePage = (data: Item) => {
        // Set the form managed data (which is part of the whole data)
        form.setFieldsValue(data)
        // Set non-form managed data
        setData(data)
        // Reset dirty as the page is just refreshed
        setIsDirty(false)
    }
    const checkFormDirty = () => {
        // Set dirty if ANY field has been touched
        const fieldsTouched = form.isFieldsTouched(true)
        setIsDirty(fieldsTouched)
    }
    const handleValuesChange = () => {
        checkFormDirty()
    }

    // Request the initial data
    useRequest(async () => {
        if (!params.id || !isEdit) {
            return prefill
        }

        return await directus.request(readItem(
            collection, params.id, { fields },
        ))
    }, {
        onSuccess: data => updatePage(data),
    })

    return {
        directus,
        form,
        id: params.id,
        data,
        isEdit,
        isDirty,
        fields,
        updatePage,
        handleValuesChange,
    }
}
