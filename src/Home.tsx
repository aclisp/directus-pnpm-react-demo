import { Flex } from 'antd'
import { Title } from './components/Title'

export function Home() {
    return (
        <Flex vertical gap="large">
            <Title title="首页" />
            <div>首页</div>
        </Flex>
    )
}

export default Home
