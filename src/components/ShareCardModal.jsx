import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import ShareCard from './ShareCard'

export default function ShareCardModal({ open, onClose, session, bet, stage }) {
  const cardRef = useRef(null)
  const [downloading, setDownloading] = useState(false)

  if (!open) return null

  const handleDownload = async () => {
    if (!cardRef.current) return
    setDownloading(true)
    try {
      const canvas = await html2canvas(cardRef.current, { backgroundColor: null, scale: 3, useCORS: true })
      const link = document.createElement('a')
      const slug = [session?.home_team, session?.away_team].filter(Boolean).join('-').replace(/\s+/g, '') || 'bet'
      link.download = `stoppage-time-${slug}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="overlay open" onClick={onClose}>
      <button className="overlay-close" onClick={onClose} aria-label="Close">×</button>
      <div onClick={(e) => e.stopPropagation()}>
        <ShareCard ref={cardRef} session={session} bet={bet} stage={stage} />
        <div className="share-actions">
          <button className="btn btn-primary" onClick={handleDownload} disabled={downloading}>
            {downloading ? 'Rendering…' : 'Download Card'}
          </button>
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
