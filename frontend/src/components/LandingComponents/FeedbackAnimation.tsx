import feedbackData from "../../data/Feedback.json";
import type { Feedback } from "../../types/feedback";
import styles from "../../css/Landing/FeedbackAnimation.module.css";

function FeedbackAnimation() 
{
    const feedbacks = feedbackData.feedbacks as Feedback[];

    // duplicate items so scrolling feels continuous
    const rowItems = [...feedbacks, ...feedbacks, ...feedbacks];

    return ( 
        <>
            <section className={styles.feedbackSection}> <h2 className={styles.feedbackTitle}>What Developers Say</h2>
                <p className={styles.feedbackSubtitle}>
                    Feedback from developers using our components
                </p>
                {/* Row 1 → left */}
                <MarqueeRow feedbacks={rowItems} direction="left" />
                {/* Row 2 → right */}
                <MarqueeRow feedbacks={rowItems} direction="right" />
                {/* Row 3 → left */}
                <MarqueeRow feedbacks={rowItems} direction="left" />
            </section>
        </>
    );
}

interface MarqueeRowProps 
{
    feedbacks: Feedback[];
    direction: "left" | "right";
}

function MarqueeRow({ feedbacks, direction }: MarqueeRowProps) 
{
    return ( 
        <div className={styles.marquee}>
            <div className={`${styles.marqueeTrack} ${styles[direction]}`}>
                {feedbacks.map((fb, i) => (
                    <div className={styles.feedbackCard} key={`${fb.id}-${i}`}> <p className={styles.feedbackText}>{fb.message}</p>

                        <div className={styles.feedbackFooter}>
                            <span className={styles.feedbackUser}>@{fb.name}</span>

                            <span className={styles.feedbackRating}>
                                {"⭐".repeat(fb.rating)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FeedbackAnimation;
