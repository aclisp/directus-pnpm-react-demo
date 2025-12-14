import { readItems } from '@directus/sdk'
import { useRequest } from 'ahooks'
import { Button, Flex, theme } from 'antd'
import dayjs from 'dayjs'
import { Link } from 'react-router'
import { Title } from './components/Title'
import type { Item } from './components/types'
import { useDirectus } from './directus'

export function Home() {
    const { token } = theme.useToken()

    return (
        <>
            <Title title="我的回忆录A" />
            <Flex
                vertical
                justify="space-between"
                style={{
                    margin: 'auto',
                    minHeight: 'calc(100dvh - 96px)',
                    maxWidth: '600px',
                }}
            >
                <Flex vertical gap="large">
                    <div style={{ fontSize: '24px', marginLeft: 'auto', marginRight: 'auto' }}>回忆久了，记忆就失了真。</div>
                    <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>有关编程的想法和连接</div>
                    <BlogList />
                </Flex>
                <Flex justify="center" align="center" style={{ marginTop: '10rem' }}>
                    <span style={{ fontSize: token.fontSizeSM }}>© 2025</span>
                    <Button
                        color="default"
                        variant="link"
                        href="https://beian.miit.gov.cn"
                        styles={{
                            content: {
                                color: token.colorTextSecondary,
                                fontSize: token.fontSizeSM,
                            },
                        }}
                    >
                        粤ICP备2021138173号
                    </Button>
                </Flex>
            </Flex>
        </>
    )
}

export default Home

function BlogList() {
    const directus = useDirectus()
    const { data } = useRequest(async () => {
        return await directus.request(readItems('blog', {
            fields: ['id', 'permalink', 'title', 'date_created'],
            filter: { status: { _eq: 'published' } },
            sort: ['-date_created'],
        }))
    })

    return (
        <Flex vertical gap="middle">
            <div>文章目录</div>
            <Flex vertical gap={2}>
                {data?.map(blog => <BlogItem key={blog.id} blog={blog} />)}
            </Flex>
        </Flex>
    )
}

function BlogItem({ blog }: { blog: Item }) {
    const { token } = theme.useToken()

    return (
        <Flex wrap style={{ columnGap: 8 }}>
            <Link to={`/blog/${blog.permalink}`} style={{ color: token.colorText }}>{blog.title}</Link>
            <span style={{ color: token.colorTextTertiary }}>{formatTime(blog.date_created)}</span>
        </Flex>
    )
}

function formatTime(datetime: string | undefined | null): string {
    if (!datetime) {
        return ''
    }

    const d = dayjs(datetime)
    return d.format('YYYY年M月')
}
