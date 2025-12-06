import classes from './StyledText.module.css'

/**
 * A testing component to demonstrate the usage of CSS modules file.
 */
export function StyledText({ value }: { value: string }) {
    return <span className={classes['isolated-red']}>{value}</span>
}
