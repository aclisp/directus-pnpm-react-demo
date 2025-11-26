import { Button, DatePicker, Space, version } from "antd";
import { version as reactVersion } from "react";

export function Demo1() {
    return (
        <>
            antd@{version}, react@{reactVersion}
            <br />
            <br />
            <Space>
                <DatePicker />
                <Button type="primary">Submit</Button>
            </Space>
        </>
    )
}

export default Demo1;
