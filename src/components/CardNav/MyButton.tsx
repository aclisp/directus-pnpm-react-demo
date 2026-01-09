import { Button, Flex, theme } from 'antd'
import { useNavigate } from 'react-router'

export function MyButton({
    icon: Icon,
    text,
    color,
    href,
    twoToneColor,
}: {
    icon: React.ElementType
    text: string
    color?: string
    twoToneColor?: string
    href: string
}) {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(href)
    }

    const { token } = theme.useToken()

    return (
        <Button onClick={handleClick} color="default" variant="text" style={{ height: 'auto' }}>
            <Flex vertical align="center" gap={token.sizeSM} style={{ paddingTop: token.paddingContentVertical, paddingBottom: token.paddingContentVertical }}>
                <Icon style={{ fontSize: token.fontSizeHeading3, color }} twoToneColor={twoToneColor} />
                <div>{text}</div>
            </Flex>
        </Button>
    )
}
