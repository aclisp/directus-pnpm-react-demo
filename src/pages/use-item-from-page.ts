import { readItem } from '@directus/sdk'
import { useRequest } from 'ahooks'
import { Form } from 'antd'
import { useParams, useSearchParams } from 'react-router'
import { useDirectus } from '../directus'
import { queryToNestedObject } from '../utils/query-to-nested-object'

export function useItemFromPage(collection: string, fields: string[]) {
    const [form] = Form.useForm()
    const params = useParams()
    const [searchParams] = useSearchParams()
    const directus = useDirectus()

    const prefill = queryToNestedObject(searchParams)
    const isEdit = Boolean(params.id && params.id != '+')

    const { data } = useRequest(async () => {
        if (!params.id || !isEdit) {
            return prefill
        }

        return await directus.request(readItem(
            collection, params.id, { fields },
        ))
    }, {
        onSuccess: data => form.setFieldsValue(data),
    })

    return {
        directus,
        form,
        id: params.id,
        data,
        isEdit,
    }
}
