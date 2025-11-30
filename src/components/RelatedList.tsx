import { readItems } from '@directus/sdk'
import { useRequest } from 'ahooks'
import { Table } from 'antd'
import { useDirectus } from '../directus'

interface RelatedListProps {
    /** The foreign key references the "parent" table's `id` field */
    foreignKeyField: string
    /** The foreign key's value which is used to filter the related list,
     *  in most cases it should be the `id` of "parent" record */
    foreignKeyValue?: string | number
    /** The collection name to retrieve the related list */
    collection: string
    /** The collection's fields */
    collectionFields: {
        /** Support nested field's path by array */
        field: string[]
        title: string
    }[]
}

export const RelatedList: React.FC<RelatedListProps> = (props) => {
    const {
        foreignKeyField,
        foreignKeyValue,
        collection,
        collectionFields,
    } = props

    const columns = collectionFields.map(x => ({
        key: x.field.join('.'),
        dataIndex: x.field,
        title: x.title,
    }))

    const directus = useDirectus()

    const { data } = useRequest(async () => {
        if (foreignKeyValue == undefined) {
            return undefined
        }

        // Ensure that the id field is always included
        const fields = columns.map(x => x.key).concat('id')
        return await directus.request(readItems(collection, {
            fields,
            filter: { [foreignKeyField]: { _eq: foreignKeyValue } },
        }))
    }, {
        refreshDeps: [foreignKeyValue],
    })

    return (
        <Table
            rowKey="id"
            dataSource={data}
            columns={columns}
            size="small"
            pagination={false}
            bordered
        />
    )
}
