import type { Item } from '@/components/types'
import { useDirectus } from '@/directus'
import { asset } from '@/directus/assets'
import { red } from '@ant-design/colors'
import { AuditOutlined } from '@ant-design/icons'
import { readItems } from '@directus/sdk'
import { useRequest } from 'ahooks'
import { Button, Divider, Image, theme } from 'antd'
import dayjs from 'dayjs'
import { Link } from 'react-router'
import styles from './Gala.module.css'

export default function Gala() {
    const directus = useDirectus()

    const { data } = useRequest(async () => {
        return await directus.request(readItems('cat_posts', {
            fields: ['id', 'name', 'date_posted', 'mp_link', 'hero_image'],
            filter: { status: { _eq: 'published' } },
        }))
    })

    return (
        <div className={styles.page}>
            <title>广东省拥军青少年舞蹈展演</title>
            <div>
                <Image placeholder preview={false} alt="海报" src={asset(directus, 'a0016265-9ce5-469d-a052-c836f3d16697')} />
                <div className={styles.panel}>
                    <LinkButton to="certificate" text="证书查询" icon={AuditOutlined} color={red[3]} />
                </div>
                <div className={styles['article-list']}>
                    <div className={styles['article-list-header']}>最新活动</div>
                    <div className={styles['article-list-items']}>
                        {data?.map(item => <Item key={item.id} item={item} />)}
                    </div>
                </div>
            </div>
        </div>
    )
}

function Item({
    item,
}: {
    item: Item
}) {
    const directus = useDirectus()
    return (
        <>
            <a href={item.mp_link} className={styles['article-list-anchor']}>
                <div className={styles['article-list-item']}>
                    <div className={styles['article-list-item-left']}>
                        <div>{item.name}</div>
                        <div className={styles['article-list-item-date']}>{dayjs(item.date_posted).format('YYYY-MM-DD')}</div>
                    </div>
                    <div className={styles['article-list-item-right']}>
                        <Image height="100%" placeholder preview={false} alt="头图" src={asset(directus, item.hero_image)} />
                    </div>
                </div>
            </a>
            <Divider size="middle" />
        </>
    )
}

function LinkButton({
    to,
    text,
    icon: Icon,
    color,
    twoToneColor,
}: {
    to: string
    text: string
    icon: React.ElementType
    color?: string
    twoToneColor?: string
}) {
    const { token } = theme.useToken()
    return (
        <Link to={to}>
            <Button color="default" variant="text" className={styles['link-button']}>
                <Icon style={{ fontSize: token.fontSizeHeading3, color }} twoToneColor={twoToneColor} />
                <div>{text}</div>
            </Button>
        </Link>
    )
}
