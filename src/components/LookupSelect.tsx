import { useDirectus } from '@/directus'
import { aggregate, readItem, readItems } from '@directus/sdk'
import { useDebounce, useRequest, useUpdateEffect } from 'ahooks'
import type { PaginationProps, TableColumnsType, TableProps } from 'antd'
import { Flex, Input, Modal, Pagination, Select, Table, theme } from 'antd'
import { useEffect, useState } from 'react'
import { ImageRender } from './ImageRender'
import type { CollectionField, Item, Item2 } from './types'

export type LookupSelectValueType = Item2

interface LookupSelectProps {
    /** The DOM element ID */
    id?: string
    /** The value property as required by the form controlled input */
    value?: LookupSelectValueType
    /** The onChange event as required by the form controlled input */
    onChange?: (value: LookupSelectValueType | null) => void
    /** Defaults to render the `name` property in `LookupValue` */
    valueRender?: (item?: Item2) => string
    /** Clear the lookup relationship by nullifying the value, defaults to `false` */
    allowClear?: boolean
    /** The "looked up" collection name */
    collection: string
    /** The fields of the lookup collection */
    collectionFields: CollectionField[]
    /** Once initialValue is set, other options are not available */
    initialValue?: LookupSelectValueType
    /** Filter the result of select options */
    filter?: Record<string, unknown>
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

/**
 * A custom component for the directus M2O field type
 */
export const LookupSelect: React.FC<LookupSelectProps> = (props) => {
    const {
        id,
        value,
        onChange,
        valueRender = item => String(item?.name ?? ''),
        allowClear = false,
        collection,
        collectionFields,
        initialValue,
        filter,
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
    const displayValue = valueRender(value)

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
                filter={filter}
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
    filter,
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
    filter?: Record<string, unknown>
}) {
    const directus = useDirectus()
    const [selectionList, setSelectionList] = useState<LookupSelectValueType[]>([])
    const [selection, setSelection] = useState<SelectionType>(() => valueToSelection(currentValue))

    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState<number>()

    // Columns are derived from props
    const columns: TableColumnsType<LookupSelectValueType> = collectionFields.map((x) => {
        const column = {
            key: x.field.join('.'),
            dataIndex: x.field,
            title: x.title,
        }
        if (x.render?.type === 'image') {
            return { ...column, render: value => <ImageRender value={value} {...x.render} /> }
        } else {
            return column
        }
    })

    // Ensure that the id field is always included
    const fields = columns.map(x => String(x.key)).concat('id')

    // Effect 1: Synchronize selection state when the external value changes
    useEffect(() => {
        setSelection(valueToSelection(currentValue))
    }, [currentValue])

    // Effect 2: Fetch data when the modal opens
    const { run: runPageRequest, loading } = useRequest(async () => {
        // If there's initialValue, then use it and exclude others.
        if (initialValue) {
            const data = await directus.request(readItem(collection, initialValue.id, { fields }))
            return [data]
        }

        // Get the data list as the options for selection.
        const dataList = await directus.request(readItems(collection, {
            fields,
            filter,
            limit: pageSize,
            page: currentPage,
        }))

        // If there's currentValue, then get it and merge it into the final result.
        // if (currentValue) {
        //     const data = await directus.request(readItem(collection, currentValue.id, { fields }))
        //     if (dataList.find(v => v.id === data.id) === undefined) {
        //         dataList.unshift(data)
        //         dataList.pop()
        //     }
        // }

        return dataList
    }, {
        onSuccess: data => setSelectionList(data as LookupSelectValueType[]),
        manual: true,
    })

    useUpdateEffect(() => {
        runPageRequest()
    }, [currentPage, pageSize])

    const {
        showSearch,
        setShowSearch,
        searchValue,
        setSearchValue,
        searching,
    } = useSearchRequest({
        collection,
        fields,
        filter,
        limit: 10,
        onSuccess: data => setSelectionList(data as LookupSelectValueType[]),
        runPageRequest,
    })

    // Fetch total count and determine if 'Search' shoud be present
    const { run: runAggregateRequest } = useRequest(async () => {
        if (initialValue) {
            return []
        }
        return await directus.request(aggregate(collection, {
            aggregate: { count: '*' },
            query: { filter },
        }))
    }, {
        onSuccess: (data) => {
            const count = Number(data[0]?.count)
            setTotalCount(count)
            if (count > 10) {
                setShowSearch(true)
            }
        },
        manual: true,
    })

    useEffect(() => {
        if (open) {
            runPageRequest()
            runAggregateRequest()
        }
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

    const handlePageChange: PaginationProps['onChange'] = (page, pageSize) => {
        setCurrentPage(page)
        setPageSize(pageSize)
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
                    <Input.Search
                        allowClear
                        loading={searching}
                        placeholder="搜索..."
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                    />
                )}
                <Table<LookupSelectValueType>
                    rowKey="id"
                    loading={loading}
                    dataSource={selectionList}
                    columns={columns}
                    rowSelection={rowSelection}
                    onRow={record => ({
                        onClick: () => handleRowClick(record),
                    })}
                    pagination={false}
                    size="small"
                />
                {showSearch && (
                    <Flex wrap justify="space-between" align="center">
                        {!searchValue
                            && (
                                <Pagination
                                    showTotal={total => `共 ${total} 条`}
                                    simple={{ readOnly: true }}
                                    current={currentPage}
                                    pageSize={pageSize}
                                    total={totalCount}
                                    onChange={handlePageChange}
                                />
                            )}
                        <SearchHint />
                    </Flex>
                )}
            </Flex>
        </Modal>
    )
}

function useSearchRequest({
    collection,
    fields,
    filter,
    limit,
    onSuccess,
    runPageRequest,
}: {
    collection: string
    fields: string[]
    filter?: Record<string, unknown>
    limit: number
    onSuccess: (data: Item[]) => void
    runPageRequest: () => void
}) {
    const directus = useDirectus()
    const [showSearch, setShowSearch] = useState(false)
    const [searchValue, setSearchValue] = useState('')

    const debouncedSearchTerm = useDebounce(searchValue.trim(), { wait: 500 })
    const { run: runSearchRequest, loading: searching } = useRequest(async () => {
        return await directus.request(readItems(
            collection,
            {
                fields,
                filter,
                limit,
                search: debouncedSearchTerm,
            },
        ))
    }, {
        manual: true,
        onSuccess,
    })
    useUpdateEffect(() => {
        if (debouncedSearchTerm) {
            runSearchRequest()
        } else {
            runPageRequest()
        }
    }, [debouncedSearchTerm])

    return {
        showSearch,
        setShowSearch,
        searchValue,
        setSearchValue,
        searching,
    }
}

function SearchHint() {
    const { token } = theme.useToken()
    return (
        <div style={{ color: token.colorTextTertiary }}>备注：请搜索更多选择项</div>
    )
}
