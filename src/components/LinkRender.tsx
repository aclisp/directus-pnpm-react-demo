import { Link } from 'react-router'

interface LinkRenderProps {
    /** The value to be rendered as a link */
    value: unknown
    record: Record<string, unknown>
    collection: string
    foreignKeyField: string
    foreignKeyValue?: string | number
}

/**
 * Solely used by RelatedList for antd Table Column render.
 */
export function LinkRender({
    value,
    record,
    collection,
    foreignKeyField,
    foreignKeyValue,
}: LinkRenderProps) {
    return (
        <Link to={`/form/${collection}/${record.id}?${foreignKeyField}.id=${foreignKeyValue}`}>
            {String(value)}
        </Link>
    )
}
