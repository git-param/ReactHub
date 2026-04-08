import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { ComponentMeta } from "../types/component";
import styles from "../css/pages/ComponentDetailPage.module.css";
import PreviewSection from "../components/ComponentDetail/PreviewSection";
import CodeSection from "../components/ComponentDetail/CodeSection";
import LikeSection from "../components/ComponentDetail/LikeSecion";
import CommentSection from "../components/ComponentDetail/CommentSection";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export default function ComponentDetailPage() {
  const { id } = useParams();
  const [component, setComponent] = useState<ComponentMeta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComponent = async () => {
      if (!id) {
        setComponent(null);
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get<ComponentMeta[]>(`${API_BASE_URL}/components`);
        const matchedComponent = data.find(
          (item) => String(item.id) === id || item.slug === id,
        );

        setComponent(matchedComponent ?? null);
      } catch {
        setComponent(null);
      } finally {
        setLoading(false);
      }
    };
    fetchComponent();
  }, [id]);

  if (loading)
    return <div className={styles.loadingState}>Loading...</div>;

  if (!component)
    return <div className={styles.notFoundState}>Component not found</div>;

  return (
    <div className={styles.pageWrapper}>
      <h1 className={styles.title}>
        {component.name ?? component.title}
      </h1>
      <p className={styles.description}>{component.description}</p>
      <PreviewSection component={component} />
      <CodeSection component={component} />
      <LikeSection componentId={component.id} />
      <CommentSection componentId={component.id} />
    </div>
  );
}
