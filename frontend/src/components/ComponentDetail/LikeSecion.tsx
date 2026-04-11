import { useEffect, useState } from "react"
import axios from "axios"
import styles from '../../css/ComponentDetail/LikeSection.module.css'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

type Props = {
  componentId: string
}

export default function LikeSection({ componentId }: Props) {

  const [liked, setLiked] = useState(false)

  const user = JSON.parse(localStorage.getItem("authUser") || "null")

  useEffect(() => {
    const checkLike = async () => {
      if (!user) return
      try {
        const { data: component } = await axios.get(`${API_BASE_URL}/api/components/${componentId}`)
        const votes = component.votes || []
        if (votes.includes(user.id)) setLiked(true)
      } catch {
        // Votes endpoint is not wired yet in backend; keep UI stable.
      }
    }
    checkLike()
  }, [componentId, user?.id])

  const toggleVote = async () => {
    if (!user)
      return alert("Login required")
    try {
      const { data: component } = await axios.get(`${API_BASE_URL}/api/components/${componentId}`)
      let votes: string[] = component.votes || []
      if (votes.includes(user.id)) {
        votes = votes.filter((id: string) => id !== user.id)
        setLiked(false)
      } else {
        votes.push(user.id)
        setLiked(true)
      }
      await axios.patch(`${API_BASE_URL}/api/components/${componentId}`, { votes })
    } catch {
      alert("Voting API is not available yet.")
    }
  }

  return (
    <div className={styles.wrapper}>
      <button onClick={toggleVote} className={`${styles.likeButton} ${liked ? styles.liked : styles.unliked}`}>
        ❤️ Like
      </button>
    </div>
  )
}