export interface CollectionField {
    /** Support nested field's path by array */
    field: string[]
    title: string
    width?: number
    /** Hidden column is used to provide infomation to some renders, default to `false` */
    hidden?: boolean
    /** What this field will be rendered to */
    render?: CollectionFieldRenderImage | CollectionFieldRenderLink | CollectionFieldRenderUser
}

export interface CollectionFieldRenderImage {
    type: 'image'
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Item = Record<string, any>
