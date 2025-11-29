import { readItems, readMe, serverInfo } from "@directus/sdk";
import { useRequest } from "ahooks";
import { Avatar, Card, Flex } from "antd";
import { useNavigate } from "react-router";
import { useDirectus, useDirectusAuth } from "./directus";
import { asset } from "./directus/assets";


function ServerInfo() {
    const directus = useDirectus()
    const { data } = useRequest(async () => {
        return await directus.request(serverInfo())
    })
    return (
        <Card title="服务器信息">
            <pre>{JSON.stringify(data, null, 4)}</pre>
        </Card>
    )
}

function UserInfo() {
    const directus = useDirectus()
    const { data } = useRequest(async () => {
        return await directus.request(readMe())
    })
    return (
        <Card title="用户信息">
            <pre>{JSON.stringify(data, null, 4)}</pre>
        </Card>
    )
}

function ProductList() {
    const navigate = useNavigate()

    const [directus, token] = useDirectusAuth()

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
                'categories.category_id.name'
            ]
        }))
    })

    if (!token) {
        return (<></>)
    }

    const onClickCard = (productId: string) => {
        navigate(`/product/${productId}`)
    }

    return (
        <Flex wrap gap="large">
            {data?.map((product) => (
                <Card
                    onClick={() => onClickCard(product.id)}
                    key={product.id}
                    hoverable
                    style={{ width: 300 }}
                    cover={
                        <img
                            draggable={false}
                            alt="image"
                            src={asset(directus, product.images[0]?.directus_files_id, { token })}
                        />
                    }
                >
                    <Card.Meta
                        avatar={<Avatar shape="square" src={asset(directus, product.brand_id?.image, { token })} />}
                        title={product.name}
                        description={product.description}
                    />
                    <Flex vertical style={{ marginTop: 20 }}>
                        <div>{product.status}</div>
                        {/*@ts-expect-error category is any type*/}
                        {product.categories.map((category) => (
                            <div key={category.category_id.id}>{category.category_id.name}</div>
                        ))}
                    </Flex>
                </Card>
            ))}
        </Flex>
    )
}

export function Home() {
    return (
        <Flex vertical gap="large">
            <div>首页</div>
            <ProductList />
            <ServerInfo />
            <UserInfo />
        </Flex>
    )
}

export default Home;
