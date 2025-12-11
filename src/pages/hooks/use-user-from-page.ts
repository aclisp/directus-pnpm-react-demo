import { useDirectus } from '@/directus'
import { queryToNestedObject } from '@/utils/query-to-nested-object'
import { readMe } from '@directus/sdk'
import { useRequest } from 'ahooks'
import { Form } from 'antd'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

export interface User {
    id: string
    status: 'draft' | 'invited' | 'unverified' | 'active' | 'suspended' | 'archived'
    first_name: string | null
    last_name: string | null
    email: string | null
    last_access: string | null
    role: Role | null
    language: string | null
    text_direction: 'ltr' | 'rtl' | 'auto'
    avatar: Avatar | null
    title: string | null
    description: string | null
    location: string | null
}

export interface Role {
    id: string
    name: string
    description: string
    icon: string
}

export interface Avatar {
    id: string
    modified_on?: string
}

const fields = [
    'id',
    'status',
    'first_name',
    'last_name',
    'email',
    'last_access',
    'role.id',
    'role.name',
    'role.description',
    'role.icon',
    'language',
    'text_direction',
    'avatar.id',
    'avatar.modified_on',
    'title',
    'description',
    'location',
]

/**
 * This hook can only be called from the Page component.
 */
export function useUserFromPage() {
    const [form] = Form.useForm()
    const [searchParams] = useSearchParams() // Depends on the Page's url
    const directus = useDirectus()
    const navigate = useNavigate() // Depends on the page router

    // The prefilled data is coming from the Page's url query string
    const prefill = queryToNestedObject(searchParams)

    // The item data is a reactive state to update the page
    const [data, setData] = useState<User>()
    // Dirty state is used to enable Save button
    const [isDirty, setIsDirty] = useState(false)

    // Update the page with item data
    const updatePage = (data: User) => {
        // Set the form managed data (which is part of the whole data)
        form.setFieldsValue(data)
        // Set non-form managed data
        setData(data)
        // Reset dirty if it is an 'Edit Item' form as the page is just refreshed
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
    const { loading } = useRequest(async () => {
        return await directus.request(readMe(
            { fields },
        ))
    }, {
        onSuccess: data => updatePage(data as User),
    })

    return {
        navigate,
        directus,
        form,
        id: data?.id,
        prefill,
        data,
        loading,
        isDirty,
        fields,
        updatePage,
        handleValuesChange,
    }
}
