import { Button } from 'antd'
import { Link } from 'react-router'
import styles from './DancingCatLanding.module.css'

const { VITE_WEBSITE_TITLE, VITE_WEBSITE_BEIAN } = import.meta.env

export default function DancingCatLanding() {
    return (
        <div className={styles.page}>
            <title>{VITE_WEBSITE_TITLE}</title>
            <div>Dancing Cat</div>
            <div>
                <Link to="/certificate">
                    <Button color="default" variant="text">
                        <div>证书查询</div>
                    </Button>
                </Link>
            </div>
            <div>{VITE_WEBSITE_BEIAN}</div>
        </div>
    )
}
