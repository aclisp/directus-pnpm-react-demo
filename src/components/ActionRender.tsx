import { useDirectus } from '@/directus'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { deleteItem } from '@directus/sdk'
import { App, Button, ConfigProvider, theme } from 'antd'
import { get } from 'lodash'
import { Link } from 'react-router'

interface ActionRenderProps {
    refresh: () => void
    record: Record<string, unknown>
    collection: string
    showEdit: boolean
    collectionTitle?: string[]
    foreignKeyField: string
    foreignKeyValue?: string | number
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
}: EditOrDeleteProps) {
    return (
        <Link to={`/form/${collection}/${record.id}?${foreignKeyField}.id=${foreignKeyValue}`}>
            <Button
                variant="text"
                size="small"
                color="primary"
                icon={<EditOutlined />}
            />
        </Link>
    )
}

function DeleteButton({
    collection,
    record,
    name,
    refresh,
}: EditOrDeleteProps) {
    const directus = useDirectus()
    const { modal } = App.useApp()
    const { token } = theme.useToken()
    const content = name ? `确定删除【${name}】吗？` : '确定删除吗？'
    const onDelete = () => {
        modal.confirm({
            content,
            onOk: () => {
                directus.request(deleteItem(collection, String(record.id))).then(refresh)
            },
            autoFocusButton: 'cancel',
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
