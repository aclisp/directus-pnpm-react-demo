import { aggregate, readItem, readItems } from '@directus/sdk'
import { useDebounce, useRequest } from 'ahooks'
import type { TableProps } from 'antd'
import { Flex, Input, Modal, Select, Table, theme } from 'antd'
import { useEffect, useState } from 'react'
import { useDirectus } from '../directus'
import { ImageRender } from './ImageRender'
import type { CollectionField, Item } from './types'

export type LookupSelectValueType = Record<string, unknown> & {
    id: string | number
}

interface LookupSelectProps {
    /** The DOM element ID */
    id?: string
    value?: LookupSelectValueType
    onChange?: (value: LookupSelectValueType | null) => void
    /** Defaults to the `name` property in `LookupValue` */
    displayField?: string
    /** Clear the lookup relationship by nullifying the value, defaults to `false` */
    allowClear?: boolean
    /** The "looked up" collection name */
    collection: string
    /** The fields of the lookup collection */
    collectionFields: CollectionField[]
    /** Once initialValue is set, other options are not available */
    initialValue?: LookupSelectValueType
}

interface SelectionType {
    keys: React.Key[]
    values: LookupSelectValueType[]
}

function valueToSelection(value?: LookupSelectValueType): SelectionType {
    return value
        ? { keys: [value.id], values: [value] }
        : { keys: [], values: [] }
}

export const LookupSelect: React.FC<LookupSelectProps> = (props) => {
    const {
        id,
        value,
        onChange,
        displayField = 'name',
        allowClear = false,
        collection,
        collectionFields,
        initialValue,
    } = props

    // Controller state for modal visibility
    const [isSelectOpen, setIsSelectOpen] = useState(false)

    // Notify external component
    const triggerChange = (changedValue: LookupSelectValueType | null) => {
        onChange?.(changedValue)
    }

    // Display the selection modal
    const showSelection = () => {
        setIsSelectOpen(true)
    }

    // Clear the value
    const clearSelection = () => {
        triggerChange(null)
    }

    // Handler for when the modal returns a selection
    const handleSelection = (selectedValue: LookupSelectValueType | null) => {
        setIsSelectOpen(false)
        triggerChange(selectedValue)
    }

    // Handler for when the modal is cancelled/closed with or without selection
    const handleCancel = () => {
        setIsSelectOpen(false)
    }

    // Determine the display value for the Input
    const displayValue = String(value?.[displayField] ?? '')

    return (
        <span id={id}>
            <Select
                allowClear={allowClear}
                open={false}
                value={displayValue}
                onOpenChange={showSelection}
                onClear={clearSelection}
            />
            <LookupSelectionModal
                open={isSelectOpen}
                collection={collection}
                collectionFields={collectionFields}
                currentValue={value}
                onSelect={handleSelection} // Pass back selected item
                onCancel={handleCancel} // Close modal
                initialValue={initialValue}
            />
        </span>
    )
}

function LookupSelectionModal({
    open,
    collection,
    collectionFields,
    currentValue,
    onSelect,
    onCancel,
    initialValue,
}: {
    open: boolean
    // Fields needed for Directus request and table display
    collection: string
    collectionFields: CollectionField[]
    // Current value passed down to pre-select the row
    currentValue?: LookupSelectValueType
    // Callbacks to communicate back to the parent
    onSelect: (value: LookupSelectValueType | null) => void
    onCancel: () => void
    // Once initialValue is set, other options are not available
    initialValue?: LookupSelectValueType
}) {
    const directus = useDirectus()
    const [selectionList, setSelectionList] = useState<LookupSelectValueType[]>([])
    const [selection, setSelection] = useState<SelectionType>(() => valueToSelection(currentValue))

    // Columns are derived from props
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

    // Ensure that the id field is always included
    const fields = columns.map(x => x.key).concat('id')

    // Limit the count of directus readItems request
    const limit = 10

    const {
        showSearch,
        setShowSearch,
        searchValue,
        setSearchValue,
    } = useSearchRequest({
        collection,
        fields,
        limit,
        onSuccess: data => setSelectionList(data as LookupSelectValueType[]),
    })

    // Effect 1: Synchronize selection state when the external value changes
    useEffect(() => {
        setSelection(valueToSelection(currentValue))
    }, [currentValue])

    // Effect 2: Fetch data when the modal opens
    const { run } = useRequest(async () => {
        // If there's initialValue, then use it and exclude others.
        if (initialValue) {
            const data = await directus.request(readItem(collection, initialValue.id, { fields }))
            return [data]
        }

        // Get the data list as the options for selection.
        const dataList = await directus.request(readItems(collection, {
            fields,
            limit,
        }))

        // If there's currentValue, then get it and merge it into the final result.
        if (currentValue) {
            const data = await directus.request(readItem(collection, currentValue.id, { fields }))
            if (dataList.find(v => v.id == data.id) === undefined) {
                dataList.unshift(data)
                dataList.pop()
            }
        }

        // Determine if 'Search' shoud be present
        directus.request(aggregate(collection, {
            aggregate: { count: '*' },
        })).then((data) => {
            if (Number(data[0]?.count) > limit) {
                setShowSearch(true)
            }
        })

        return dataList
    }, {
        onSuccess: data => setSelectionList(data as LookupSelectValueType[]),
        manual: true,
    })
    useEffect(() => {
        if (open) run()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    // Handler for OK button
    const handleOk = () => {
        if (selection.values.length > 0) {
            onSelect(selection.values[0]) // Pass the selected value back to parent
        } else {
            onSelect(null) // Clearing the value
        }
    }

    // Handler for Cancel/Close
    const handleCancel = () => {
        onCancel()
        // Reset the selection to value passed from parent
        setSelection(valueToSelection(currentValue))
    }

    // Configuration for Antd Table row selection
    const rowSelection: TableProps<LookupSelectValueType>['rowSelection'] = {
        type: 'radio',
        selectedRowKeys: selection.keys,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelection({ keys: selectedRowKeys, values: selectedRows })
        },
    }

    // Handle row click to select the item
    const handleRowClick = (record: LookupSelectValueType) => {
        setSelection({ keys: [record.id], values: [record] })
    }

    return (
        <Modal
            closable={false}
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Flex vertical gap="small">
                {showSearch && (
                    <Input
                        placeholder="搜索..."
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                    />
                )}
                <Table<LookupSelectValueType>
                    rowKey="id"
                    dataSource={selectionList}
                    columns={columns}
                    rowSelection={rowSelection}
                    onRow={record => ({
                        onClick: () => handleRowClick(record),
                    })}
                    pagination={false}
                    size="small"
                />
                {showSearch && <SearchHint />}
            </Flex>
        </Modal>
    )
}

function useSearchRequest({
    collection,
    fields,
    limit,
    onSuccess,
}: {
    collection: string
    fields: string[]
    limit: number
    onSuccess: (data: Item[]) => void
}) {
    const directus = useDirectus()
    const [showSearch, setShowSearch] = useState(false)
    const [searchValue, setSearchValue] = useState('')

    const debouncedSearchTerm = useDebounce(searchValue.trim(), { wait: 500 })
    const { run: runSearchRequest } = useRequest(async () => {
        return await directus.request(readItems(
            collection,
            {
                fields,
                limit,
                search: debouncedSearchTerm,
            },
        ))
    }, {
        manual: true,
        onSuccess,
    })
    useEffect(() => {
        if (debouncedSearchTerm) {
            runSearchRequest()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm])

    return {
        showSearch,
        setShowSearch,
        searchValue,
        setSearchValue,
    }
}

function SearchHint() {
    const { token } = theme.useToken()
    return (
        <div style={{ color: token.colorTextTertiary }}>备注：请搜索更多选择项</div>
    )
}
