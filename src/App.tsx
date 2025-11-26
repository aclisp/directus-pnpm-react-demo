import { Button, DatePicker, Space, version } from "antd";
import { version as reactVersion } from "react";

export function App() {
  return (
    <div style={{ padding: '24px' }} >
      antd@{version}, react@{reactVersion}
      <br />
      <br />
      <Space>
        <DatePicker />
        <Button type="primary">Submit</Button>
      </Space>
    </div>
  );
}

export default App;
