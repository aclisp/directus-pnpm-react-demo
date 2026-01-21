import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Theme } from './Theme'

/**
 * index.html 添加了过审用的 title 和 beian。
 * 初始化时，移除它们，将由 react 来渲染
 */
const removeTitle = () => {
    const title = document.getElementsByTagName('title')[0]
    if (title) {
        title.remove()
    }
}

const removeBeian = () => {
    const beian = document.getElementById('beian')
    if (beian) {
        beian.remove()
    }
}

const removeLoader = () => {
    const loader = document.getElementById('initial-loader')
    if (loader) {
        // 添加隐藏类，触发 CSS 渐隐过渡效果
        loader.classList.add('initial-loader-hidden')

        // 延迟移除，等待过渡效果完成（这里设置 500ms，匹配 CSS 中的 0.5s）
        setTimeout(() => {
            loader.remove()
        }, 500)
    }
}

removeTitle()
removeBeian()

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Theme />
    </StrictMode>,
)

removeLoader()
