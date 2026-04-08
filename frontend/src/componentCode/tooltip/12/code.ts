export const code = `
import styles from "./Component.module.css"
import { useState } from "react"

export default function Tooltip() {

  const [visible, setVisible] = useState(false)

  return (
    <div className={styles.container}>

      <button
        className={styles.button}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        Hover me
      </button>

      {visible && (
        <div className={styles.tooltip}>
          This is a tooltip
        </div>
      )}

    </div>
  )
}
`