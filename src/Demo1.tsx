import { readItems, readMe, serverInfo } from '@directus/sdk'
import { useRequest } from 'ahooks'
import type { DescriptionsProps } from 'antd'
import { Avatar, Card, ColorPicker, Descriptions, Flex, Switch } from 'antd'
import { useNavigate } from 'react-router'
import { Title } from './components/Title'
import { useDirectus, useDirectusAuth } from './directus'
import { asset } from './directus/assets'

export function Demo1() {
    return (
        <Flex vertical gap="large">
            <Title title="演示" />
            <div>演示</div>
            <ProductList />
            <ServerInfo />
            <UserInfo />
        </Flex>
    )
}

function ServerInfo() {
    const directus = useDirectus()
    const { data } = useRequest(async () => {
        return await directus.request(serverInfo())
    })
    const items: DescriptionsProps['items'] = [
        { key: 'project_name', label: '项目名称', children: <div>{data?.project.project_name}</div> },
        // @ts-expect-error project_color
        { key: 'project_color', label: '主题色', children: <ColorPicker value={data?.project.project_color} showText /> },
        { key: 'default_language', label: '默认语言', children: <div>{data?.project.default_language}</div> },
        { key: 'public_registration', label: '是否允许注册账号', children: <Switch checked={data?.project.public_registration} /> },
        { key: 'public_registration_verify_email', label: '注册时是否校验 Email', children: <Switch checked={data?.project.public_registration_verify_email} /> },
        // @ts-expect-error version
        { key: 'version', label: '版本号', children: <div>{data?.version}</div> },
        { key: 'query_limit_default', label: '查询上限(缺省值)', children: <div>{data?.queryLimit?.default}</div> },
        { key: 'query_limit_max', label: '查询上限(最大值)', children: <div>{data?.queryLimit?.max}</div> },
    ]
    return (
        <Descriptions title="服务信息" items={items} />
    )
}

function UserInfo() {
    const directus = useDirectus()
    const { data } = useRequest(async () => {
        return await directus.request(readMe())
    })
    const items: DescriptionsProps['items'] = [
        {
            key: 'full_name', label: '姓名', children: (
                <div>
                    {data?.first_name}
                    {' '}
                    {data?.last_name}
                </div>
            ),
        },
        { key: 'email', label: 'Email', children: <div>{data?.email}</div> },
    ]
    return (
        <Descriptions title="用户信息" items={items} />
    )
}

function ProductList() {
    const navigate = useNavigate()

    const { directus, token } = useDirectusAuth()

    const { data } = useRequest(async () => {
        return await directus.request(readItems('product', {
            fields: [
                'id',
                'status',
                'name',
                'description',
                'brand_id.name',
                'brand_id.image',
                'images.directus_files_id',
                'categories.category_id.id',
                'categories.category_id.name',
            ],
        }))
    })

    if (!token) {
        return (<></>)
    }

    const onClickCard = (productId: string) => {
        navigate(`/form/product/${productId}`)
    }

    return (
        <Flex wrap gap="large">
            {data?.map(product => (
                <Card
                    onClick={() => onClickCard(product.id)}
                    key={product.id}
                    hoverable
                    style={{ width: 300 }}
                    cover={(
                        <img
                            draggable={false}
                            alt="image"
                            src={asset(directus, product.images[0]?.directus_files_id, { token })}
                        />
                    )}
                >
                    <Card.Meta
                        avatar={<Avatar shape="square" src={asset(directus, product.brand_id?.image, { token })} />}
                        title={product.name}
                        description={product.description}
                    />
                    <Flex vertical style={{ marginTop: 20 }}>
                        <div>{product.status}</div>
                        {/* @ts-expect-error category is any type */}
                        {product.categories.map(category => (
                            <div key={category.category_id.id}>{category.category_id.name}</div>
                        ))}
                    </Flex>
                </Card>
            ))}
        </Flex>
    )
}
