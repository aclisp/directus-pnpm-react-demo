import { CaretDownOutlined, CaretRightOutlined, CheckOutlined, CopyOutlined } from '@ant-design/icons'
import { Button, Space, theme } from 'antd'
import clsx from 'clsx'
import { useRef, useState } from 'react'
import styles from './CopiablePre.module.css'

export function CopiablePre({
    title,
    collapsed = false,
    children,
}: {
    title: string
    collapsed?: boolean
    children: React.ReactNode
}) {
    const preRef = useRef<HTMLPreElement>(null)
    const [copied, setCopied] = useState(false)
    const [hideContent, setHideContent] = useState(collapsed)

    const handleCopy = async () => {
        if (preRef.current) {
            const text = preRef.current.innerText // Get the text inside <pre>
            await navigator.clipboard.writeText(text)
            setCopied(true)

            // Reset the "Copied!" state after 2 seconds
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const handleHideContent = () => {
        setHideContent(hideContent => !hideContent)
    }

    const { token } = theme.useToken()

    return (
        <div style={{ borderWidth: 1, borderStyle: 'solid', borderColor: token.colorBorder, borderRadius: token.borderRadius }}>
            <Space size={token.sizeXXS}>
                <Space.Compact>
                    <Button variant="text" color="default" icon={hideContent ? <CaretRightOutlined /> : <CaretDownOutlined />} onClick={handleHideContent} />
                    <Button variant="text" color="default" icon={copied ? <CheckOutlined /> : <CopyOutlined />} onClick={handleCopy} />
                </Space.Compact>
                <span style={{ wordBreak: 'break-all' }}>{title}</span>
            </Space>
            <pre ref={preRef} className={clsx(styles.pre, { [styles.collapsed]: hideContent })}>
                {children}
            </pre>
        </div>
    )
}
