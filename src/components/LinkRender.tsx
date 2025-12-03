import { Link } from 'react-router'

interface LinkRenderProps {
    /** The value to be rendered as a link */
    value: unknown
    record: Record<string, unknown>
    collection: string
    foreignKeyField: string
    foreignKeyValue?: string | number
}

export function LinkRender({
    value,
    record,
    collection,
    foreignKeyField,
    foreignKeyValue,
}: LinkRenderProps) {
    return (
        <Link to={`/${collection}/${record.id}?${foreignKeyField}.id=${foreignKeyValue}`}>
            {String(value)}
        </Link>
    )
}
