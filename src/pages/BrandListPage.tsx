import { Form1 } from '@/components/Form1'
import { FormAction } from '@/components/FormAction'
import { Title } from '@/components/Title'
import { useDirectusAuth } from '@/directus'
import { asset } from '@/directus/assets'
import { readItems } from '@directus/sdk'
import { useRequest } from 'ahooks'
import { Button, Card, Flex } from 'antd'
import { useNavigate } from 'react-router'

export function BrandListPage() {
    const navigate = useNavigate()

    const { directus, token } = useDirectusAuth()

    const { data, loading } = useRequest(async () => {
        return await directus.request(readItems('brand', {
            fields: [
                'id',
                'name',
                'image',
            ],
        }))
    })

    if (!token) {
        return (<></>)
    }

    const onClickCard = (id: string) => {
        navigate(`/form/brand/${id}`)
    }

    const createBrand = () => {
        navigate('/form/brand/+')
    }

    return (
        <>
            <Title title="品牌管理" />
            <Form1 loading={loading}>
                <FormAction label="操作">
                    <Button onClick={createBrand}>添加品牌</Button>
                </FormAction>
                <Flex wrap gap="large">
                    {data?.map(item => (
                        <Card
                            onClick={() => onClickCard(item.id)}
                            key={item.id}
                            hoverable
                            style={{ width: 150 }}
                            cover={(
                                <img
                                    draggable={false}
                                    alt="image"
                                    src={asset(directus, item.image, { token })}
                                />
                            )}
                        >
                            <Flex vertical style={{ marginTop: 20 }}>
                                <div>{item.name}</div>
                            </Flex>
                        </Card>
                    ))}
                </Flex>
            </Form1>
        </>
    )
}
