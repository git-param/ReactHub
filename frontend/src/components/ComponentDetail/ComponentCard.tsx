import { Link } from "react-router-dom"
import type { Component } from "../../types/component"
import styles from '../../css/ComponentDetail/ComponentCard.module.css'
type Props = {
  component: Component
}
export default function ComponentCard({ component }: Props) 
{
  return (
    <Link to={`/components/${component.slug}`}>

      <div className={styles.cardWrapper}>
        <img
          src={component.previewImage}
          className={styles.previewImage}
        />
        <h2 className={styles.cardTitle}>{component.name}</h2>
        <p className={styles.cardDescription}>
          {component.description}
        </p>
      </div>
    </Link>
  )
}