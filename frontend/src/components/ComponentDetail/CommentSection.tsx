import { useEffect, useState } from "react"
import axios from "axios"
import styles from '../../css/ComponentDetail/CommentSection.module.css'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

type Props = {
  componentId: string
}

type Comment = {
  id: string
  userId: string
  username: string
  text: string
  createdAt: number
}

export default function CommentSection({ componentId }: Props) {

  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")

  useEffect(() => 
  {
    const fetchComments = async () => {
      const { data: component } = await axios.get(`${API_BASE_URL}/components/${componentId}`)
      setComments((component.comments || []).reverse())
    }
    fetchComments()
  }, [componentId])


  const addComment = async () => 
  {
    const user = JSON.parse(localStorage.getItem("authUser") || "null")
    if (!user) 
      return alert("Login required")
    const { data: component } = await axios.get(`${API_BASE_URL}/components/${componentId}`)
    const updatedComments = component.comments || []
    const newEntry: Comment = {
      id: crypto.randomUUID(),
      userId: user.id,
      username: user.name,
      text: newComment,
      createdAt: Date.now()
    }
    updatedComments.push(newEntry)
    await axios.patch(`${API_BASE_URL}/components/${componentId}`, { comments: updatedComments })
    setComments([...updatedComments].reverse())
    setNewComment("")
  }
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Comments</h2>
      <div className={styles.commentList}>
        {comments.map((c) => (
          <div key={c.id} className={styles.commentCard}>
            <p className={styles.commentAuthor}>
              {c.username}
            </p>
            <p>{c.text}</p>
          </div>
        ))}
      </div>
      <div className={styles.inputRow}>
        <input value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment..." className={styles.commentInput}/>
        <button onClick={addComment} disabled={!newComment.trim()} className={styles.postButton}>Post</button>
      </div>

    </div>
  )
}