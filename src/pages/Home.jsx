import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import ProbBar from '../components/ProbBar'
import Flag from '../components/Flag'

export default function Home() {
  const navigate = useNavigate()

  return (
    <Layout>
      <div className="page-fade">
        <div className="hero">
          <img className="hero-logo" src="/Stoppage Time.png" alt="" />
          <div className="kicker">World Cup 2026 · Arena Agent</div>
          <h1 className="stamp">
            The edge arrives
            <br />
            <span className="a">late.</span>
          </h1>
          <p className="sub">
            An agent pipeline that watches every World Cup fixture, reasons through it, and only
            bets when the market is wrong. Every decision is logged, timed, and open to review —
            and every bet becomes a card you can hold.
          </p>
          <div className="cta-row">
            <button className="btn btn-primary" onClick={() => navigate('/stats')}>
              View Live Stats
            </button>
            <button className="btn btn-ghost" onClick={() => navigate('/fixture')}>
              Run New Analysis
            </button>
          </div>
        </div>

        <div className="home-teaser">
          <div className="teaser-copy">
            <div className="lbl">Every settled bet, collectible</div>
            <p>
              Each fixture analysis compiles into a shareable card — teams, stage, stake,
              probability split, and the one line of reasoning that mattered. Built for the
              portfolio, not just the ledger.
            </p>
            <button className="btn btn-ghost" style={{ marginTop: 10 }} onClick={() => navigate('/history')}>
              See Bet History →
            </button>
          </div>
          <div className="mini-card-wrap">
            <div className="share-card" style={{ width: 220, padding: '16px 15px 14px', transform: 'scale(0.92)' }}>
              <div className="sc-top">
                <div className="sc-stage">Round of 16</div>
                <img src="/Stoppage Time.png" alt="" />
              </div>
              <div className="sc-teams">
                <div className="sc-team">
                  <Flag team="Argentina" />
                  <div className="name">ARG</div>
                </div>
                <div className="sc-vs">VS</div>
                <div className="sc-team">
                  <Flag team="Japan" />
                  <div className="name">JPN</div>
                </div>
              </div>
              <ProbBar home={0.64} draw={0.21} away={0.15} pick="home" compact />
              <div className="sc-stats">
                <div className="sc-stat"><div className="v">+6.2pp</div><div className="l">Edge</div></div>
                <div className="sc-stat"><div className="v">$42</div><div className="l">Stake</div></div>
                <div className="sc-stat"><div className="v">1.34</div><div className="l">Odds</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
