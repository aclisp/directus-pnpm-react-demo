export interface CollectionField {
    /** Support nested field's path by array */
    field: string[]
    /** Used as antd Table Column dataIndex, in case where it should be different from `field` */
    // dataIndex?: string[]
    /** Used as antd Table Column title */
    title: string
    /** Used as antd Table Column width and minWidth */
    width?: number
    /** Hidden column is used to provide infomation to some renders, default to `false` */
    hidden?: boolean
    /** What this field will be rendered to */
    render?: CollectionFieldRenderImage | CollectionFieldRenderLink | CollectionFieldRenderUser | CollectionFieldRenderO2M
}

export interface CollectionFieldRenderImage {
    type: 'image'
    // Props forward to ImageRender with reasonable defaults
    height?: string | number
    width?: string | number
    maxWidth?: string | number
    preview?: boolean
}

export interface CollectionFieldRenderLink {
    type: 'link'
}

export interface CollectionFieldRenderUser {
    type: 'user'
}

export interface CollectionFieldRenderO2M {
    type: 'o2m'
    // Props forward to O2MRender with reasonable defaults
    render?: (item: Item) => React.ReactNode
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Item = Record<string, any>

/**
 * The directus item that must have `id` field
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Item2 = Record<string, any> & {
    id: string | number
}
