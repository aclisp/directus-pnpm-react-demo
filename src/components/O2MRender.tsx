import type { CollectionFieldRenderO2M } from './types'

type O2MRenderProps = Omit<CollectionFieldRenderO2M, 'type'> & {
    /** The value to be rendered as O2M */
    value: Record<string, unknown>[]
}

/**
 * Solely used by RelatedList for antd Table Column render.
 */
export function O2MRender(props: O2MRenderProps) {
    const {
        value,
        render = item => String(item.name),
    } = props
    return (
        <>
            {value.map(data => <div key={String(data.id)}>{render(data)}</div>)}
        </>
    )
}
