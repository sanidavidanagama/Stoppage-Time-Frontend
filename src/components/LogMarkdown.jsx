import ReactMarkdown from 'react-markdown'

// Agent log responses/prompts come back as markdown-formatted prose (the
// LLM writes **bold**, lists, etc. into it) — render it properly instead
// of leaving the raw ** and - characters sitting in the text. Scoped to
// log content specifically; bet_reason and other copy elsewhere stays
// plain text.
export default function LogMarkdown({ children }) {
  if (!children) return <p>—</p>
  return (
    <div className="log-markdown">
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  )
}
