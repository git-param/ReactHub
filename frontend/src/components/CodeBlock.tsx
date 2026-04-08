import React, { useState, useCallback } from 'react';
import styles from '../css/components/CodeBlock.module.css';

interface CodeBlockProps {
    code: string;
    language?: 'tsx' | 'css' | 'bash';
    showLineNumbers?: boolean;
}

function highlightSyntax(code: string): React.ReactNode[] {
    const lines = code.split('\n');
    return lines.map((line, i) => {
        const parts: React.ReactNode[] = [];
        let remaining = line;
        let key = 0;

        // Comment highlighting
        if (remaining.trimStart().startsWith('//') || remaining.trimStart().startsWith('/*') || remaining.trimStart().startsWith('*')) {
            return <span key={i} style={{ color: '#4b5563' }}>{remaining}</span>;
        }

        // Process the line for syntax tokens
        const tokenRegex = /(\/\/.*$|'[^']*'|"[^"]*"|`[^`]*`|\b(import|export|from|const|let|var|function|return|if|else|interface|type|default|true|false|null|undefined|void|new|class|extends|implements|typeof|instanceof|as|in|of|for|while|do|switch|case|break|continue|throw|try|catch|finally|async|await|yield|enum|readonly|public|private|protected|static|abstract|declare|module|namespace|require)\b|\b(string|number|boolean|any|never|unknown|object|React|ReactNode|HTMLDivElement|KeyboardEvent|FC|useState|useEffect|useRef|useCallback|useContext|useMemo|AnimatePresence|motion)\b|\b(\d+)\b)/g;

        let lastIndex = 0;
        let match;

        while ((match = tokenRegex.exec(remaining)) !== null) {
            // Text before the match
            if (match.index > lastIndex) {
                parts.push(<span key={key++}>{remaining.slice(lastIndex, match.index)}</span>);
            }

            const token = match[0];

            if (token.startsWith('//')) {
                parts.push(<span key={key++} style={{ color: '#4b5563' }}>{token}</span>);
            } else if (token.startsWith("'") || token.startsWith('"') || token.startsWith('`')) {
                parts.push(<span key={key++} style={{ color: '#86efac' }}>{token}</span>);
            } else if (match[2]) {
                // Keywords
                parts.push(<span key={key++} style={{ color: '#c084fc' }}>{token}</span>);
            } else if (match[3]) {
                // Types/classes
                parts.push(<span key={key++} style={{ color: '#67e8f9' }}>{token}</span>);
            } else if (match[4]) {
                // Numbers
                parts.push(<span key={key++} style={{ color: '#fbbf24' }}>{token}</span>);
            } else {
                parts.push(<span key={key++}>{token}</span>);
            }

            lastIndex = match.index + match[0].length;
        }

        if (lastIndex < remaining.length) {
            parts.push(<span key={key++}>{remaining.slice(lastIndex)}</span>);
        }

        return parts.length > 0 ? <span key={i}>{parts}</span> : <span key={i}>{remaining}</span>;
    });
}

const CodeBlock: React.FC<CodeBlockProps> = ({
    code,
    showLineNumbers = true,
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [code]);

    const lines = code.split('\n');
    const highlightedLines = highlightSyntax(code);

    return (
        <div className={styles.wrapper} style={{ backgroundColor: '#0d0917' }}>
            {/* Copy button */}
            <button
                onClick={handleCopy}
                className={styles.copyButton}
                style={{
                    backgroundColor: copied ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                    color: copied ? '#4ade80' : 'rgba(255, 255, 255, 0.5)',
                    border: `1px solid ${copied ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                }}
            >
                {copied ? (
                    <>
                        <svg className={styles.copyIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                    </>
                ) : (
                    <>
                        <svg className={styles.copyIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                    </>
                )}
            </button>

            {/* Code area */}
            <div className={styles.codeArea}>
                <pre className={styles.codePre} style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                    {highlightedLines.map((highlighted, i) => (
                        <div key={i} className={styles.codeLine}>
                            {showLineNumbers && (
                                <span
                                    className={styles.lineNumber}
                                    style={{
                                        color: 'rgba(255, 255, 255, 0.2)',
                                        minWidth: lines.length > 99 ? '2.5rem' : '1.5rem',
                                    }}
                                >
                                    {i + 1}
                                </span>
                            )}
                            <span className={styles.lineContent}>{highlighted}</span>
                        </div>
                    ))}
                </pre>
            </div>
        </div>
    );
};

export default CodeBlock;
