import { useDirectusAuth } from '@/directus'
import { asset2 } from '@/directus/assets'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Flex, Image, Upload, type UploadProps } from 'antd'
import type { Item2 } from './types'

type ImageUploadValueType = string | Item2

interface ImageUploadProps {
    /** The DOM element ID */
    id?: string
    /** The value property as required by the form controlled input */
    value?: ImageUploadValueType
    /** The onChange event as required by the form controlled input */
    onChange?: (value: ImageUploadValueType | null) => void
}

/**
 * A custom component for the directus image field type
 */
export const ImageUpload: React.FC<ImageUploadProps> = (props) => {
    const {
        id,
        value,
        onChange,
    } = props

    const { directus, token, refreshToken } = useDirectusAuth()

    // Notify external component
    const triggerChange = (changedValue: ImageUploadValueType | null) => {
        onChange?.(changedValue)
    }

    const uploadRequest: UploadProps['customRequest'] = async (options, info) => {
        const token = await directus.getToken()
        options.action = new URL('/files', directus.url).toString()
        options.headers ??= {}
        options.headers.Authorization = `Bearer ${token}`
        info.defaultRequest(options)
    }

    const onUploadChange: UploadProps['onChange'] = (info) => {
        if (info.file.status == 'done') {
            triggerChange(info.file.response.data.id)
            refreshToken()
        }
    }

    return (
        <span id={id}>
            <Flex vertical gap="small">
                {value && (
                    <Image
                        preview={true}
                        height={96}
                        width="auto"
                        styles={{
                            image: {
                                maxWidth: 192,
                                objectFit: 'contain',
                            },
                        }}
                        alt="image"
                        src={asset2(directus, value, { token })}
                    />
                )}
                <Upload
                    customRequest={uploadRequest}
                    onChange={onUploadChange}
                    maxCount={1}
                    accept="image/*"
                >
                    <Button icon={<UploadOutlined />}>上传</Button>
                </Upload>
            </Flex>
        </span>
    )
}
