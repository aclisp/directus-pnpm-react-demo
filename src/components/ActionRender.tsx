import { useDirectus } from '@/directus'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { deleteItem } from '@directus/sdk'
import { App, Button, ConfigProvider, theme } from 'antd'
import { get } from 'lodash-es'
import { useNavigate } from 'react-router'
import type { RelatedItemEditingEvent } from './RelatedList'

interface ActionRenderProps {
    onActionFinish: () => void
    record: Record<string, unknown>
    collection: string
    showEdit: boolean
    collectionTitle?: string[]
    foreignKeyField: string
    foreignKeyValue?: string | number
    onEdit?: (e: RelatedItemEditingEvent) => void
}

/**
 * Solely used by RelatedList for antd Table Column render.
 */
export function ActionRender(props: ActionRenderProps) {
    const { record, collectionTitle, showEdit } = props
    let name: string | undefined
    if (collectionTitle) {
        name = get(record, collectionTitle)
    } else if (Object.hasOwn(record, 'name')) {
        name = String(record.name)
    }
    return (
        <>
            {showEdit && <EditButton name={name} {...props} />}
            <DeleteButton name={name} {...props} />
        </>
    )
}

type EditOrDeleteProps = ActionRenderProps & {
    /** The `name` field in the collection is used for deletion hint */
    name?: string
}

function EditButton({
    collection,
    record,
    foreignKeyField,
    foreignKeyValue,
    onEdit,
}: EditOrDeleteProps) {
    const navigate = useNavigate()
    const handleEdit = () => {
        if (onEdit) {
            onEdit({ record, collection, foreignKeyField, foreignKeyValue })
        } else {
            navigate(`/form/${collection}/${record.id}?${foreignKeyField}.id=${foreignKeyValue}`)
        }
    }
    return (
        <Button
            variant="text"
            size="small"
            color="primary"
            icon={<EditOutlined />}
            onClick={handleEdit}
        />
    )
}

function DeleteButton({
    collection,
    record,
    name,
    onActionFinish,
}: EditOrDeleteProps) {
    const directus = useDirectus()
    const { modal } = App.useApp()
    const { token } = theme.useToken()
    const content = name ? `确定删除【${name}】吗？` : '确定删除吗？'
    const onDelete = () => {
        modal.confirm({
            content,
            onOk: () => {
                directus.request(deleteItem(collection, String(record.id))).then(onActionFinish)
            },
            focusable: {
                autoFocusButton: 'cancel',
            },
        })
    }
    return (
        <ConfigProvider theme={{
            components: {
                Button: {
                    colorPrimaryHover: token.colorErrorHover,
                    colorPrimaryBg: token.colorErrorBgHover,
                },
            },
        }}
        >
            <Button
                variant="text"
                size="small"
                color="primary"
                icon={<DeleteOutlined />}
                onClick={onDelete}
            />
        </ConfigProvider>
    )
}
