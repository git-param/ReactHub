import { Link } from "react-router-dom"
import styles from '../../css/ComponentDetail/ComponentDetail.module.css'

export default function ComponentCard({ component }: any) {

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