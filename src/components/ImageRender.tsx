import { Image } from 'antd'
import { useDirectusAuth } from '../directus'
import { asset } from '../directus/assets'
import type { CollectionFieldRenderImage } from './types'

type ImageRenderProps = Omit<CollectionFieldRenderImage, 'type'> & {
    /** The value to be rendered as an image */
    value: unknown
}

export function ImageRender(props: ImageRenderProps) {
    const {
        value,
        height = 24,
        width = 'auto',
        maxWidth = 48,
        preview = false,
    } = props
    const [directus, token] = useDirectusAuth()
    return (
        <Image
            preview={preview}
            height={height}
            width={width}
            styles={{
                image: {
                    maxWidth,
                    objectFit: 'contain',
                },
            }}
            alt="image"
            src={asset(directus, String(value), { token })}
        />
    )
}
