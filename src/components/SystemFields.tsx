import { Form } from 'antd'
import { datetime } from '../directus/datetime'
import { username } from '../directus/users'
import type { Item } from './types'

/**
 * A custom component to view the directus system fields
 */
export function SystemFields({ data }: { data?: Item }) {
    return (
        <div className="form-grid">
            <Form.Item className="form-item" label="创建人">
                <div>{username(data?.user_created)}</div>
            </Form.Item>
            <Form.Item className="form-item" label="创建时间">
                <div>{datetime(data?.date_created)}</div>
            </Form.Item>
            <Form.Item className="form-item" label="更新人">
                <div>{username(data?.user_updated)}</div>
            </Form.Item>
            <Form.Item className="form-item" label="更新时间">
                <div>{datetime(data?.date_updated)}</div>
            </Form.Item>
        </div>
    )
}
