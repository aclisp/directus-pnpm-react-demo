import { Card, theme } from 'antd'

export function MyCard({
    title,
    children,
}: {
    title: string
    children: React.ReactNode
}) {
    const { token } = theme.useToken()
    return (
        <Card
            title={title}
            size="small"
            styles={{
                title: { fontWeight: 'normal', color: token.colorTextSecondary },
                header: { borderBottom: 'none' },
            }}
        >
            {children}
        </Card>
    )
}
