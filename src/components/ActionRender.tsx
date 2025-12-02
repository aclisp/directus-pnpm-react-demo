import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { App, Button, ConfigProvider, theme } from 'antd'
import { get } from 'lodash'
import { Link } from 'react-router'

export function ActionRender({ record, collection, showEdit, collectionTitle }: {
    record: Record<string, unknown>
    collection: string
    showEdit: boolean
    collectionTitle?: string[]
}) {
    const id = String(record.id)
    let name: string | undefined
    if (collectionTitle) {
        name = get(record, collectionTitle)
    } else if (Object.hasOwn(record, 'name')) {
        name = String(record.name)
    } else if (Object.hasOwn(record, 'title')) {
        name = String(record.title)
    }
    return (
        <>
            {showEdit && <EditButton collection={collection} id={id} />}
            <DeleteButton collection={collection} id={id} name={name} />
        </>
    )
}

interface EditOrDeleteProps {
    collection: string
    id: string
    /** The `name` field in the collection is used for deletion hint */
    name?: string
}

function EditButton({ collection, id }: EditOrDeleteProps) {
    return (
        <Link to={`/${collection}/${id}`}>
            <Button
                variant="text"
                size="small"
                color="primary"
                icon={<EditOutlined />}
            />
        </Link>
    )
}

function DeleteButton({ collection, id, name }: EditOrDeleteProps) {
    const { modal } = App.useApp()
    const { token } = theme.useToken()
    const content = name ? `确定删除【${name}】吗？` : '确定删除吗？'
    const onDelete = () => {
        modal.confirm({
            content,
            onOk: () => {
                console.log(`Delete ${collection} by id = ${id}`)
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
