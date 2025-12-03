import { readItems } from '@directus/sdk'
import { useRequest } from 'ahooks'
import type { TableColumnsType } from 'antd'
import { Table } from 'antd'
import { useDirectus } from '../directus'
import { ActionRender } from './ActionRender'
import { ImageRender } from './ImageRender'
import { LinkRender } from './LinkRender'
import type { CollectionField } from './types'
import { UserRender } from './UserRender'

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
    /** Index to the collection's title field */
    collectionTitle?: string[]
    /** Show `edit` button in the action column, default is `false` */
    showEdit?: boolean
}

export const RelatedList: React.FC<RelatedListProps> = (props) => {
    const {
        foreignKeyField,
        foreignKeyValue,
        collection,
        collectionFields,
        collectionTitle,
        showEdit = false,
    } = props

    const columns: TableColumnsType = collectionFields.map((x) => {
        const column = {
            key: x.field.join('.'),
            dataIndex: x.field,
            title: x.title,
            width: x.width,
            minWidth: x.width,
            hidden: x.hidden,
        }
        if (x.render?.type == 'image') {
            return {
                ...column, render: value => (
                    <ImageRender
                        value={value}
                        {...x.render}
                    />
                ),
            }
        } else if (x.render?.type == 'link') {
            return {
                ...column, render: (value, record) => (
                    <LinkRender
                        value={value}
                        record={record}
                        collection={collection}
                        foreignKeyField={foreignKeyField}
                        foreignKeyValue={foreignKeyValue}
                    />
                ),
            }
        } else if (x.render?.type == 'user') {
            return {
                ...column, render: value => (
                    <UserRender
                        user={value}
                    />
                ),
            }
        } else {
            return column
        }
    })

    const directus = useDirectus()

    const { data, refresh } = useRequest(async () => {
        if (foreignKeyValue == undefined) {
            return undefined
        }

        // Ensure that the id field is always included
        const fields = columns.map(x => String(x.key)).filter(x => x != 'action').concat('id')
        return await directus.request(readItems(collection, {
            fields,
            filter: { [foreignKeyField]: { _eq: foreignKeyValue } },
        }))
    }, {
        refreshDeps: [foreignKeyValue],
    })

    // The last column contains the row actions
    columns.push({
        key: 'action',
        title: '操作',
        width: 65,
        minWidth: 65,
        fixed: 'end',
        render: (_, record) => (
            <ActionRender
                refresh={refresh}
                record={record}
                collection={collection}
                showEdit={showEdit}
                collectionTitle={collectionTitle}
                foreignKeyField={foreignKeyField}
                foreignKeyValue={foreignKeyValue}
            />
        ),
    })

    return (
        <Table
            rowKey="id"
            dataSource={data}
            columns={columns}
            size="small"
            pagination={false}
            tableLayout="auto"
            scroll={{
                x: 600,
            }}
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
