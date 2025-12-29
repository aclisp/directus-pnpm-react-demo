import { Form1 } from '@/components/Form1'
import { FormAction } from '@/components/FormAction'
import { Title } from '@/components/Title'
import { useDirectusAuth } from '@/directus'
import { readItems } from '@directus/sdk'
import { useRequest } from 'ahooks'
import { Button, Tree } from 'antd'
import { useNavigate } from 'react-router'

export function CategoryListPage() {
    const navigate = useNavigate()

    const { directus, token } = useDirectusAuth()

    const { data, loading } = useRequest(async () => {
        return await directus.request(readItems('category', {
            fields: [
                'id',
                'name',
                'children',
                'children.id',
                'children.name',
                'children.children.id',
                'children.children.name',
            ],
            filter: {
                parent_id: { _null: true },
            },
        }))
    })

    if (!token) {
        return (<></>)
    }

    const onClickItem = (id: string) => {
        navigate(`/form/category/${id}`)
    }

    const createItem = () => {
        navigate('/form/category/+')
    }

    return (
        <>
            <Title title="品类管理" />
            <Form1 loading={loading}>
                <FormAction label="操作">
                    <Button onClick={createItem}>添加品类</Button>
                </FormAction>
                <Tree
                    showLine
                    fieldNames={{
                        key: 'id',
                        title: 'name',
                        children: 'children',
                    }}
                    treeData={data}
                    onSelect={id => onClickItem(id[0] as string)}
                />
            </Form1>
        </>
    )
}
