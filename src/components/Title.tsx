import type { Item } from './types'

interface TitleProps {
    title: string
    data?: Item
}

/**
 * A custom component for page title
 */
export function Title({ title, data }: TitleProps) {
    const titleString = title + (data?.name ? ` - ${data.name}` : '')
    return <title>{titleString}</title>
}
