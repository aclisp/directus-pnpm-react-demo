import { readItems } from '@directus/sdk'
import { useRequest } from 'ahooks'
import { Table } from 'antd'
import { useDirectus } from '../directus'
import { ImageRender } from './ImageRender'
import type { CollectionField } from './types'

interface RelatedListProps {
    /** The foreign key references the "parent" table's `id` field */
    foreignKeyField: string
    /** The foreign key's value which is used to filter the related list,
     *  in most cases it should be the `id` of "parent" record */
    foreignKeyValue?: string | number
    /** The collection name to retrieve the related list */
    collection: string
    /** The collection's fields */
    collectionFields: CollectionField[]
}

export const RelatedList: React.FC<RelatedListProps> = (props) => {
    const {
        foreignKeyField,
        foreignKeyValue,
        collection,
        collectionFields,
    } = props

    const columns = collectionFields.map((x) => {
        const column = {
            key: x.field.join('.'),
            dataIndex: x.field,
            title: x.title,
        }
        if (x.render?.type == 'image') {
            return { ...column, render: (value: unknown) => <ImageRender value={value} {...x.render} /> }
        } else {
            return column
        }
    })

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
            styles={{
                header: {
                    cell: {
                        fontWeight: 'normal',
                    },
                },
            }}
        />
    )
}
