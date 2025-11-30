import { readFieldsByCollection, readItem, readRelations } from '@directus/sdk'
import { useRequest } from 'ahooks'
import type { CollapseProps } from 'antd'
import { Collapse, Table } from 'antd'
import { useDirectus } from '../directus'

export function DebugItem({ collection, id }: {
    collection: string
    id?: string | number
}) {
    const directus = useDirectus()

    const { data: fields } = useRequest(async () => {
        return await directus.request(readFieldsByCollection(collection))
    })

    const { data: relations } = useRequest(async () => {
        const relations = await directus.request(readRelations())
        return relations.filter(record => (
            record.meta.many_collection == collection || record.meta.one_collection == collection
        ))
    })

    const { data: values } = useRequest(async () => {
        if (id === undefined) {
            return undefined
        }
        return await directus.request(readItem(collection, id))
    })

    const items: CollapseProps['items'] = [
        {
            key: 'values',
            label: `${collection} values`,
            children: <pre>{JSON.stringify(values, null, 4)}</pre>,
        },
        {
            key: 'fields',
            label: `${collection} fields`,
            children: (
                <Table rowKey="field" dataSource={fields} pagination={false} size="small">
                    <Table.Column title="field" dataIndex="field" />
                    <Table.Column title="type" dataIndex="type" />
                    <Table.Column title="interface" dataIndex={['meta', 'interface']} />
                </Table>
            ),
        },
        {
            key: 'relations',
            label: `${collection} relations`,
            children: (
                <Table
                    rowKey={record => `${record.meta.many_collection},${record.meta.many_field},${record.meta.one_collection},${record.meta.one_field}`}
                    dataSource={relations}
                    pagination={false}
                    size="small"
                >
                    <Table.Column title="many_collection" dataIndex={['meta', 'many_collection']} />
                    <Table.Column title="many_field" dataIndex={['meta', 'many_field']} />
                    <Table.Column title="one_collection" dataIndex={['meta', 'one_collection']} />
                    <Table.Column title="one_field" dataIndex={['meta', 'one_field']} />
                    <Table.Column title="junction_field" dataIndex={['meta', 'junction_field']} />
                </Table>
            ),
        },
    ]

    return (
        <Collapse items={items} size="small" />
    )
}
