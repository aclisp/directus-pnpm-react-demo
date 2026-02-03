import 'antd/dist/reset.css'
import 'github-markdown-css/github-markdown.css'
import './index.css'

import { useMount, useTheme } from 'ahooks'
import { ConfigProvider, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import 'dayjs/locale/zh-cn'
import { ThemeApp } from './ThemeApp'

const { VITE_COLOR_PRIMARY } = import.meta.env

export function Theme() {
    const { theme: currentTheme, themeMode, setThemeMode } = useTheme({ localStorageKey: 'antd-theme' })

    useMount(() => {
        if (themeMode !== 'system') {
            setThemeMode('system')
        }
    })

    return (
        <ConfigProvider
            locale={zhCN}
            theme={{
                algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    fontSize: 16,
                    colorPrimary: VITE_COLOR_PRIMARY,
                    borderRadius: 10,
                },
                components: {
                    Button: {
                        // We change: 0 2px 0 (Hard Edge) -> 0 0 4px (Soft Glow)
                        primaryShadow: '0 0 4px rgba(5, 145, 255, 0.15)',
                        dangerShadow: '0 0 4px rgba(255, 38, 5, 0.12)',
                        defaultShadow: '0 0 4px rgba(0, 0, 0, 0.08)',
                    },
                },
            }}
        >
            <ThemeApp />
        </ConfigProvider>
    )
}
