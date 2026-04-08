import { useMemo } from "react"
import type { Component } from "../../types/component"
import { getPreviewComponent } from "../../utils/componentLoader"
import styles from '../../css/ComponentDetail/PreviewSection.module.css'

type Props = {
  component: Component
}

export default function PreviewSection({ component }: Props) {

  const PreviewComponent = useMemo(
    () => getPreviewComponent(component),
    [component]
  )

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Live Preview</h2>

      <div className={styles.previewContainer}>
        {PreviewComponent ? (
          <div className={styles.previewContent}>
            <PreviewComponent />
          </div>
        ) : (
          "Preview unavailable"
        )}
      </div>
    </div>
  )
}
