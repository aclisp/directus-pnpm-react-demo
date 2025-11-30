import { App, Button, DatePicker, Space, version } from 'antd'
import { version as reactVersion } from 'react'

export function Demo1() {
    const { modal } = App.useApp()

    const onClick = () => {
        modal.info({ title: 'Good', content: 'You are Okay!' })
    }

    return (
        <>
            antd@
            {version}
            , react@
            {reactVersion}
            <br />
            <br />
            <Space>
                <DatePicker />
                <Button type="primary" onClick={onClick}>Submit</Button>
            </Space>
        </>
    )
}

export default Demo1
