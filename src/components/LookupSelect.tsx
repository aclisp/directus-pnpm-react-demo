import { readItems } from "@directus/sdk";
import { useRequest } from "ahooks";
import type { TableProps } from "antd";
import { Modal, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { useDirectus } from "../directus";


type LookupSelectValueType = Record<string, unknown> & {
    id: string | number;
}

type LookupSelectProps = {
    /** The DOM element ID */
    id?: string;
    value?: LookupSelectValueType;
    onChange?: (value: LookupSelectValueType | null) => void;
    /** Defaults to the `name` property in `LookupValue` */
    displayField?: string;
    /** Clear the lookup relationship by nullifying the value, defaults to `false` */
    allowClear?: boolean;
    /** The "looked up" collection name */
    lookupCollection: string;
    /** The fields of the lookup collection */
    lookupCollectionFields: {
        field: string;
        title: string;
    }[]
}

type SelectionType = {
    keys: React.Key[];
    values: LookupSelectValueType[];
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
        lookupCollection,
        lookupCollectionFields
    } = props;

    // Controller state for modal visibility
    const [isSelectOpen, setIsSelectOpen] = useState(false);

    // Notify external component
    const triggerChange = (changedValue: LookupSelectValueType | null) => {
        onChange?.(changedValue);
    };

    // Display the selection modal
    const showSelection = () => {
        setIsSelectOpen(true);
    }

    // Clear the value
    const clearSelection = () => {
        triggerChange(null)
    }

    // Handler for when the modal returns a selection
    const handleSelection = (selectedValue: LookupSelectValueType | null) => {
        setIsSelectOpen(false)
        triggerChange(selectedValue);
    }

    // Handler for when the modal is cancelled/closed with or without selection
    const handleCancel = () => {
        setIsSelectOpen(false)
    }

    // Determine the display value for the Input
    const displayValue = String(value?.[displayField] ?? '');

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
                lookupCollection={lookupCollection}
                lookupCollectionFields={lookupCollectionFields}
                currentValue={value}
                onSelect={handleSelection} // Pass back selected item
                onCancel={handleCancel}    // Close modal
            />
        </span>
    )
}

function LookupSelectionModal({
    open,
    lookupCollection,
    lookupCollectionFields,
    currentValue,
    onSelect,
    onCancel,
}: {
    open: boolean;
    // Fields needed for Directus request and table display
    lookupCollection: string;
    lookupCollectionFields: { field: string; title: string }[];
    // Current value passed down to pre-select the row
    currentValue?: LookupSelectValueType;
    // Callbacks to communicate back to the parent
    onSelect: (value: LookupSelectValueType | null) => void;
    onCancel: () => void;
}) {
    const directus = useDirectus();
    const [selectionList, setSelectionList] = useState<LookupSelectValueType[]>([]);
    const [selection, setSelection] = useState<SelectionType>(valueToSelection(currentValue));

    // Columns are derived from props
    const selectionListColumns = lookupCollectionFields.map(x => ({
        key: x.field,
        dataIndex: x.field,
        title: x.title
    }));

    // Effect 1: Synchronize selection state when the external value changes
    useEffect(() => {
        setSelection(valueToSelection(currentValue));
    }, [currentValue]);

    // Effect 2: Fetch data when the modal opens
    const { run } = useRequest(async () => {
        // Ensure that the id field is always included
        const fields = lookupCollectionFields.map(x => x.field).concat('id');
        return await directus.request(readItems(lookupCollection, { fields }));
    }, {
        onSuccess: (data) => setSelectionList(data as LookupSelectValueType[]),
        manual: true,
    })
    useEffect(() => {
        if (open) run()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    // Handler for OK button
    const handleOk = () => {
        if (selection.values.length > 0) {
            onSelect(selection.values[0]); // Pass the selected value back to parent
        } else {
            onSelect(null); // Clearing the value
        }
    };

    // Handler for Cancel/Close
    const handleCancel = () => {
        onCancel();
        // Reset the selection to value passed from parent
        setSelection(valueToSelection(currentValue))
    };

    // Configuration for Antd Table row selection
    const rowSelection: TableProps<LookupSelectValueType>['rowSelection'] = {
        type: 'radio',
        selectedRowKeys: selection.keys,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelection({ keys: selectedRowKeys, values: selectedRows });
        }
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
            <Table<LookupSelectValueType>
                rowKey="id"
                dataSource={selectionList}
                columns={selectionListColumns}
                rowSelection={rowSelection}
                onRow={(record) => ({
                    onClick: () => handleRowClick(record)
                })}
                pagination={false}
                size="small"
            />
        </Modal>
    )
};
