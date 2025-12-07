import { MyButton } from './MyButton'
import { MyCard } from './MyCard'

type CardType = typeof MyCard
type CardNavType = CardType & {
    Button: typeof MyButton
}

const CardNav = MyCard as CardNavType
CardNav.Button = MyButton

export { CardNav }
