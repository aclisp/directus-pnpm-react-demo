import type { Item } from './types'

interface TitleProps {
    title: string
    data?: Item
}

export function Title({ title, data }: TitleProps) {
    const titleString = title + (data?.name ? ` - ${data.name}` : '')
    return <title>{titleString}</title>
}
