import LiquidEther from '@/components/LiquidEther/LiquidEther'
import styles from './DancingCatLanding.module.css'

const { VITE_WEBSITE_TITLE, VITE_WEBSITE_BEIAN } = import.meta.env

export default function DancingCatLanding() {
    return (
        <div className={styles.page}>
            <title>{VITE_WEBSITE_TITLE}</title>
            <div className={styles['liquid-ether']}>
                <LiquidEther
                    colors={['#5227FF', '#FF9FFC', '#B19EEF']}
                    mouseForce={20}
                    cursorSize={100}
                    isViscous
                    viscous={30}
                    iterationsViscous={32}
                    iterationsPoisson={32}
                    resolution={0.5}
                    isBounce={false}
                    autoDemo
                    autoSpeed={0.5}
                    autoIntensity={2.2}
                    takeoverDuration={0.25}
                    autoResumeDelay={3000}
                    autoRampDuration={0.6}
                />
            </div>
            <div className={styles.main}>
                悦舞喵
            </div>
            <div className={styles.footer}>
                <a className={styles.beian} href="https://beian.miit.gov.cn">
                    {VITE_WEBSITE_BEIAN}
                </a>
            </div>
        </div>
    )
}
