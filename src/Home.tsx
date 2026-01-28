import { EyeInvisibleOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { readItems } from '@directus/sdk'
import { useRequest } from 'ahooks'
import { Button, Flex, Skeleton, Tag, theme } from 'antd'
import dayjs from 'dayjs'
import { Link } from 'react-router'
import { Title } from './components/Title'
import type { Item } from './components/types'
import { useDirectusAuth } from './directus'

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
                    <div style={{ fontSize: token.fontSizeHeading3, marginLeft: 'auto', marginRight: 'auto' }}>回忆久了，记忆就失了真。</div>
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

function BlogList() {
    const { directus, token } = useDirectusAuth()

    const filter = { _or: [{ status: { _eq: 'published' } }] }
    if (token) {
        // authenticated user can see blogs of any status
        filter._or.pop()
    }

    const { data, loading } = useRequest(async () => {
        return await directus.request(readItems('blog', {
            fields: ['id', 'permalink', 'title', 'date_created', 'status'],
            filter,
            sort: ['-date_created'],
        }))
    }, {
        refreshDeps: [token],
    })

    const { token: { sizeXXS } } = theme.useToken()

    const blogList = (
        <Flex vertical gap={sizeXXS}>
            {data?.map(blog => <BlogItem key={blog.id} blog={blog} />)}
        </Flex>
    )

    return (
        <Flex vertical gap="middle">
            <div>文章目录</div>
            {loading
                ? <Skeleton active title={false} paragraph={{ rows: 3, width: ['65%', '50%', '80%'] }} />
                : blogList}
        </Flex>
    )
}

function BlogItem({ blog }: { blog: Item }) {
    const { token } = theme.useToken()

    return (
        <Flex wrap style={{ columnGap: token.sizeXS }}>
            <BlogStatus status={blog.status} />
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

function BlogStatus({ status }: { status: string }) {
    switch (status) {
        case 'archived':
            return <Tag><EyeInvisibleOutlined /></Tag>
        case 'draft':
            return <Tag color="warning"><QuestionCircleOutlined /></Tag>
        default:
            return <></>
    }
}
