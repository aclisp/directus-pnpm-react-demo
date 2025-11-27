import { Typography } from "antd";
import { useDirectusAuth } from "./directus";

const { Text } = Typography;

export function About() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_directus, token] = useDirectusAuth()
    if (!token) {
        return (<div>This page need you login</div>)
    }

    return (
        <>
            <div>About</div>
            <Text ellipsis>{token}</Text>
        </>
    )
}

export default About;
