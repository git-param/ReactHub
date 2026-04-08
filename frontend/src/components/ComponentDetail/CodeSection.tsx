import type { Component } from "../../types/component"
import { getComponentSource } from "../../utils/componentLoader"
import styles from '../../css/ComponentDetail/CodeSection.module.css'

type Props = {
  component: Component
}

export default function CodeSection({ component }: Props) {
  const staticSource = getComponentSource(component)
  const code = staticSource?.code || component.componentCode

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert(`${label} copied!`)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className={styles.wrapper}>
      {/* Source Code */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Source Code</h2>
          {code && (
            <button
              onClick={() => copyToClipboard(code, "Code")}
              className={styles.copyButtonIndigo}
            >
              Copy Code
            </button>
          )}
        </div>
        <pre className={styles.codeBlockGreen}>
          <code>{code || "No code available for this component."}</code>
        </pre>
      </div>

      {/* CSS Code (only for admin-added components) */}
      {component.cssCode && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>CSS</h2>
            <button
              onClick={() => copyToClipboard(component.cssCode!, "CSS")}
              className={styles.copyButtonViolet}
            >
              Copy CSS
            </button>
          </div>
          <pre className={styles.codeBlockBlue}>
            <code>{component.cssCode}</code>
          </pre>
        </div>
      )}

      {/* Usage / Import Code (only for admin-added components) */}
      {component.usageCode && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Usage / Import</h2>
            <button
              onClick={() => copyToClipboard(component.usageCode!, "Usage code")}
              className={styles.copyButtonEmerald}
            >
              Copy Usage
            </button>
          </div>
          <pre className={styles.codeBlockAmber}>
            <code>{component.usageCode}</code>
          </pre>
        </div>
      )}
    </div>
  )
}
