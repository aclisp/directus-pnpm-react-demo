import { Title } from '@/components/Title'
import { useDirectus } from '@/directus'
import { readItems } from '@directus/sdk'
import { useRequest } from 'ahooks'
import { Flex, theme } from 'antd'
import dayjs from 'dayjs'
import Markdown from 'react-markdown'
import { useParams } from 'react-router'

export function BlogPage() {
    const params = useParams()

    const { token } = theme.useToken()

    const directus = useDirectus()

    const { data } = useRequest(async () => {
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

    return (
        <Flex vertical align="center" gap="2rem" style={{ margin: 'auto', maxWidth: '900px' }}>
            <Title title={blog?.title} />
            <div style={{ fontSize: '30px' }}>{blog?.title}</div>

            <div style={{ fontSize: token.fontSizeSM }}>
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
