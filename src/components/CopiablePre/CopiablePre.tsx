import { CaretDownOutlined, CaretRightOutlined, CheckOutlined, CopyOutlined } from '@ant-design/icons'
import { Button, Space } from 'antd'
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

    return (
        <div style={{ border: '1px solid #D9D9D9', borderRadius: '6px' }}>
            <Space size={4}>
                <Button variant="text" color="default" icon={hideContent ? <CaretRightOutlined /> : <CaretDownOutlined />} onClick={handleHideContent} />
                <Button variant="text" color="default" icon={copied ? <CheckOutlined /> : <CopyOutlined />} onClick={handleCopy} />
                <span style={{ fontWeight: 500 }}>{title}</span>
            </Space>
            <pre ref={preRef} className={clsx(styles.pre, { [styles.collapsed]: hideContent })}>
                {children}
            </pre>
        </div>
    )
}
