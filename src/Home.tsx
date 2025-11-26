import { readMe, serverInfo } from "@directus/sdk";
import { useRequest } from "ahooks";
import { Card, Flex } from "antd";
import { useDirectus } from "./directus";


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

export function Home() {
    return (
        <Flex vertical gap="large">
            <div>首页</div>
            <ServerInfo />
            <UserInfo />
        </Flex>
    )
}

export default Home;
