import { Title } from '@/components/Title'
import { useDirectusAuth } from '@/directus'
import { FormOutlined } from '@ant-design/icons'
import { readItems } from '@directus/sdk'
import { useRequest } from 'ahooks'
import { Empty, Flex, FloatButton, Skeleton, theme } from 'antd'
import dayjs from 'dayjs'
import Markdown from 'react-markdown'
import { useNavigate, useParams } from 'react-router'

export function BlogPage() {
    const params = useParams()

    const { token: themeToken } = theme.useToken()

    const { directus, token: authToken } = useDirectusAuth()

    const { data, loading } = useRequest(async () => {
        if (!params.permalink) {
            return undefined
        }

        return await directus.request(readItems('blog', {
            fields: ['id', 'title', 'content', 'date_created', 'date_updated'],
            filter: {
                _and: [
                    { permalink: { _eq: params.permalink } },
                ],
            },
        }))
    })

    const blog = data?.[0]

    const navigate = useNavigate()

    const editBlog = () => {
        if (blog) {
            navigate(`/form/blog/${blog.id}`)
        }
    }

    if (data?.length === 0) {
        return (
            <Container title="走错了">
                <Empty description="走错了吧" />
            </Container>
        )
    }

    if (loading) {
        return (
            <Container title="加载中...">
                <Skeleton />
            </Container>
        )
    }

    return (
        <Container title={blog?.title}>
            <div style={{ fontSize: themeToken.fontSizeHeading3 }}>{blog?.title}</div>

            <div style={{ fontSize: themeToken.fontSizeSM }}>
                <div>
                    发表于
                    {formatTime(blog?.date_created)}
                </div>
                {blog?.date_updated && (
                    <div>
                        更新于
                        {formatTime(blog?.date_updated)}
                    </div>
                )}
            </div>

            <div className="markdown-body" style={{ width: '100%' }}>
                <Markdown>{blog?.content}</Markdown>
            </div>

            {authToken && <FloatButton icon={<FormOutlined />} onClick={editBlog} />}
        </Container>
    )
}

function Container({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <Flex vertical align="center" gap="2rem" style={{ margin: 'auto', maxWidth: '900px' }}>
            <Title title={title} />
            {children}
        </Flex>
    )
}

function formatTime(datetime: string | undefined | null): string {
    if (!datetime) {
        return ''
    }

    const d = dayjs(datetime)
    const map = {
        0: '天',
        1: '一',
        2: '二',
        3: '三',
        4: '四',
        5: '五',
        6: '六',
    }
    return `${d.format('YYYY年M月D日')}，星期${map[d.day()]}`
}
