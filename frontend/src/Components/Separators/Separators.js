import s from "./SeparatorsStyle.module.css"

// Simple separating lines

const HorizontalSeparator = () => {
    return (
        <hr className={s.horizontal_separator}/>
    )
}

const VerticalSeparator = () => {
    return (
        <div className={s.vertical_separator}/>
    )
}

export {HorizontalSeparator, VerticalSeparator};