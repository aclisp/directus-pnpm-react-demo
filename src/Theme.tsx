import 'antd/dist/reset.css'
import 'github-markdown-css/github-markdown.css'
import './index.css'

import { useMount, useTheme } from 'ahooks'
import { ConfigProvider, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import 'dayjs/locale/zh-cn'
import { ThemeApp } from './ThemeApp'

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
                },
            }}
        >
            <ThemeApp />
        </ConfigProvider>
    )
}
