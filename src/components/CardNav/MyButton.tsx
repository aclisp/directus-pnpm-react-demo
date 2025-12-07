import { Button, Flex } from 'antd'
import { useNavigate } from 'react-router'

export function MyButton({
    icon: Icon,
    text,
    color,
    href,
}: {
    icon: React.ElementType
    text: string
    color: string
    href: string
}) {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(href)
    }

    return (
        <Button onClick={handleClick} color="default" variant="text" style={{ height: 'auto' }}>
            <Flex vertical align="center" gap={12} style={{ paddingTop: 12, paddingBottom: 12 }}>
                <Icon style={{ fontSize: 24, color }} />
                <div>{text}</div>
            </Flex>
        </Button>
    )
}
