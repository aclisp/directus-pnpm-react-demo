import { Link } from 'react-router'

interface LinkRenderProps {
    /** The value to be rendered as a link */
    value: unknown
    record: Record<string, unknown>
    collection: string
}

export function LinkRender({ value, record, collection }: LinkRenderProps) {
    const id = String(record.id)
    return (
        <Link to={`/${collection}/${id}`}>
            {String(value)}
        </Link>
    )
}
