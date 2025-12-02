export interface CollectionField {
    /** Support nested field's path by array */
    field: string[]
    title: string
    /** What this field will be rendered to */
    render?: CollectionFieldRenderImage
}

export interface CollectionFieldRenderImage {
    type: 'image'
    height?: string | number
    width?: string | number
    maxWidth?: string | number
    preview?: boolean
}
