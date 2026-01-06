import { useDirectus } from '@/directus'
import { nestedObjectToQuery } from '@/utils/nested-object-to-query'
import { PlusOutlined } from '@ant-design/icons'
import { readItems } from '@directus/sdk'
import { useRequest } from 'ahooks'
import type { DrawerProps, TableColumnsType } from 'antd'
import { Button, Flex, Table } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ActionRender } from './ActionRender'
import { ImageRender } from './ImageRender'
import { LinkRender } from './LinkRender'
import { O2MRender } from './O2MRender'
import type { CollectionField } from './types'
import { UserRender } from './UserRender'

export interface RelatedItemEditingEvent {
    record: Record<string, unknown>
    collection: string
    foreignKeyField: string
    foreignKeyValue?: string | number
}

export interface RelatedItemDrawerProps extends DrawerProps {
    prefill: Record<string, unknown>
    relatedItemId: string | undefined
    onFormFinish: (isEdit: boolean) => void
}

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
    /** Show table title, which has the button to add a related item */
    showTitle?: boolean
    /** Called when an action (Add, Edit or Delete) on a related item is finished */
    onActionFinish?: () => void
    /** Drawer component to Add or Edit a related item */
    drawer?: React.ComponentType<RelatedItemDrawerProps>
    /** Drawer form prefill */
    prefill?: Record<string, unknown>
}

/**
 * A custom component for the directus O2M field type
 */
export const RelatedList: React.FC<RelatedListProps> = (props) => {
    const {
        foreignKeyField,
        foreignKeyValue,
        collection,
        collectionFields,
        collectionTitle,
        showEdit = false,
        showTitle = false,
        onActionFinish,
        drawer: Drawer,
        prefill = {},
    } = props

    const {
        drawerOpen,
        relatedId,
        handleAddItem,
        handleEditItem,
        closeDrawer,
    } = useRelatedItemDrawer()

    const navigate = useNavigate()
    const handleAddItemWithNavigate = () => {
        let queryString = nestedObjectToQuery(prefill).toString()
        if (queryString) {
            queryString = '?' + queryString
        }
        navigate(`/form/${collection}/+${queryString}`)
    }

    const columns: TableColumnsType = collectionFields.map((x) => {
        const column = {
            key: x.field.join('.'),
            dataIndex: x.field,
            title: x.title,
            width: x.width,
            minWidth: x.width,
            hidden: x.hidden,
        }
        if (x.render?.type === 'image') {
            return {
                ...column, render: value => (
                    <ImageRender
                        value={value}
                        {...x.render}
                    />
                ),
            }
        } else if (x.render?.type === 'o2m') {
            return {
                ...column, render: value => (
                    <O2MRender
                        value={value}
                        {...x.render}
                    />
                ),
            }
        } else if (x.render?.type === 'link') {
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
        } else if (x.render?.type === 'user') {
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

    const { data, refresh: refreshRequest } = useRequest(async () => {
        if (foreignKeyValue === undefined) {
            return undefined
        }

        // Ensure that the id field is always included
        const fields = columns.map(x => String(x.key)).filter(x => x !== 'action').concat('id')
        return await directus.request(readItems(collection, {
            fields,
            filter: { [foreignKeyField]: { _eq: foreignKeyValue } },
        }))
    }, {
        refreshDeps: [foreignKeyValue],
    })

    const handleActionFinish = () => {
        refreshRequest()
        onActionFinish?.()
    }

    // The last column contains the row actions
    columns.push({
        key: 'action',
        title: '操作',
        width: 65,
        minWidth: 65,
        fixed: 'end',
        render: (_, record) => (
            <ActionRender
                onActionFinish={handleActionFinish}
                record={record}
                collection={collection}
                showEdit={showEdit}
                collectionTitle={collectionTitle}
                foreignKeyField={foreignKeyField}
                foreignKeyValue={foreignKeyValue}
                onEdit={Drawer ? handleEditItem : undefined}
            />
        ),
    })

    const title = () => {
        return (
            <Flex justify="end">
                <Flex justify="center" style={{ width: 48 }}>
                    <Button
                        variant="text"
                        size="small"
                        color="primary"
                        icon={<PlusOutlined />}
                        onClick={Drawer ? handleAddItem : handleAddItemWithNavigate}
                    />
                </Flex>
            </Flex>
        )
    }

    return (
        <>
            <Table
                rowKey="id"
                dataSource={data}
                columns={columns}
                size="small"
                pagination={false}
                tableLayout="auto"
                scroll={{
                    x: 591,
                }}
                bordered
                styles={{
                    header: {
                        cell: {
                            fontWeight: 'normal',
                        },
                    },
                }}
                title={showTitle ? title : undefined}
            />
            {Drawer && (
                <Drawer
                    prefill={prefill}
                    relatedItemId={relatedId}
                    open={drawerOpen}
                    onClose={() => {
                        closeDrawer()
                        handleActionFinish() // Call this in case the indirect relational data is updated
                    }}
                    onFormFinish={() => {
                        closeDrawer()
                        handleActionFinish()
                    }}
                />
            )}
        </>
    )
}

function useRelatedItemDrawer() {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [relatedId, setRelatedId] = useState<string>()

    const handleAddItem = () => {
        setRelatedId('+')
        setDrawerOpen(true)
    }

    const handleEditItem = (e: RelatedItemEditingEvent) => {
        setRelatedId(String(e.record.id))
        setDrawerOpen(true)
    }

    const closeDrawer = () => {
        setDrawerOpen(false)
    }

    return {
        drawerOpen,
        relatedId,
        handleAddItem,
        handleEditItem,
        closeDrawer,
    }
}
