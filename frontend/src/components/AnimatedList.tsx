import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';

interface AnimatedListProps {
    items?: string[];
    onItemSelect?: (item: string, index: number) => void;
    showGradients?: boolean;
    enableArrowNavigation?: boolean;
    displayScrollbar?: boolean;
}

function AnimatedList({
    items = [],
    onItemSelect,
    showGradients = true,
    enableArrowNavigation = true,
    displayScrollbar = true,
}: AnimatedListProps) {
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const listRef = useRef<HTMLDivElement>(null);

    const handleSelect = useCallback(
        (index: number) => {
            setSelectedIndex(index);
            onItemSelect?.(items[index], index);
        },
        [items, onItemSelect]
    );

    useEffect(() => {
        if (!enableArrowNavigation) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => {
                    const next = prev < items.length - 1 ? prev + 1 : 0;
                    onItemSelect?.(items[next], next);
                    return next;
                });
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => {
                    const next = prev > 0 ? prev - 1 : items.length - 1;
                    onItemSelect?.(items[next], next);
                    return next;
                });
            }
        };

        const el = listRef.current;
        el?.addEventListener('keydown', handleKeyDown);
        return () => el?.removeEventListener('keydown', handleKeyDown);
    }, [enableArrowNavigation, items, onItemSelect]);

    useEffect(() => {
        if (selectedIndex >= 0 && listRef.current) {
            const selectedEl = listRef.current.querySelector(
                `[data-index="${selectedIndex}"]`
            );
            selectedEl?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }, [selectedIndex]);

    return (
        <div className="scroll-list-container" tabIndex={0} ref={listRef}>
            {showGradients && <div className="scroll-gradient-top" />}
            <div
                className={`scroll-list ${displayScrollbar ? '' : 'hide-scrollbar'}`}
            >
                <AnimatePresence initial={false}>
                    {items.map((item, index) => (
                        <motion.div
                            key={item}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            data-index={index}
                            className={`scroll-list-item ${selectedIndex === index ? 'selected' : ''
                                }`}
                            onClick={() => handleSelect(index)}
                        >
                            <span className="scroll-list-item-text">{item}</span>
                            <span className="scroll-list-item-icon">→</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            {showGradients && <div className="scroll-gradient-bottom" />}
        </div>
    );
}

export default AnimatedList;
