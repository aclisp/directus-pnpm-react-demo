import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { App, Button, ConfigProvider, theme } from 'antd'
import { Link } from 'react-router'

export function ActionRender({ record, collection, showEdit }: {
    record: Record<string, unknown>
    collection: string
    showEdit: boolean
}) {
    const id = String(record.id)
    return (
        <>
            {showEdit && <EditButton collection={collection} id={id} />}
            <DeleteButton collection={collection} id={id} />
        </>
    )
}

interface EditOrDeleteProps {
    collection: string
    id: string
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

function DeleteButton({ collection, id }: EditOrDeleteProps) {
    const { modal } = App.useApp()
    const { token } = theme.useToken()
    const onDelete = () => {
        modal.confirm({
            content: '确定删除吗？',
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
