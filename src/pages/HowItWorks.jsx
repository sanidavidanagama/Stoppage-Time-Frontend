import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

const AGENTS = [
  {
    name: 'Tactics',
    job: 'Reads every match either team has played this tournament and writes a scouting report — formations, key matchups, where each side is strong or exposed. Its only job is describing how the game will be played, not who wins.',
    seesMarket: false,
  },
  {
    name: 'News',
    job: 'Searches the live web for injuries, expert predictions, and stadium atmosphere. Every search is explicitly date-checked, so an old injury that’s since healed doesn’t get reported as if it’s still true.',
    seesMarket: false,
  },
  {
    name: 'Search',
    job: 'A general-purpose fact-finder for anything Tactics and News don’t cover.',
    seesMarket: false,
  },
  {
    name: 'Reasoning',
    job: 'Reads everything the other agents produced, can ask Tactics one specific follow-up if something’s unclear, and commits to a probability for home win, draw, and away win — without ever seeing what the market thinks.',
    seesMarket: false,
  },
  {
    name: 'Betting',
    job: 'The only agent that sees market prices, and only after Reasoning has already committed. Plain arithmetic checks all three outcomes for a genuine gap first — no AI judgment yet. Only if a real gap exists does an AI decide how much to stake.',
    seesMarket: true,
  },
]

const DAY_STEPS = [
  {
    num: 1,
    label: 'Planning',
    note: 'Decides what to gather — tactics, injury news, pundit takes, crowd atmosphere, historical trend between the two regions — and fetches all of it, generically, before anyone forms an opinion.',
  },
  {
    num: 2,
    label: 'Reasoning',
    note: 'Reads all of it, decides if it needs anything more specific, and commits to a probability. This step has a hard budget: it can only ask for a limited number of follow-ups before it has to decide.',
  },
  {
    num: 3,
    label: 'Betting',
    note: 'Checks the gap between that probability and the real market price, across all three outcomes — not just the obvious favorite.',
  },
  {
    num: 4,
    label: 'Stake Sizing',
    note: 'If there’s a real gap, an AI sizes the stake — bigger for a stronger edge and higher confidence, smaller for a thin one — within a hard dollar ceiling no single bet can exceed, no matter what.',
  },
  {
    num: 5,
    label: 'Order',
    note: 'Goes to the real market.',
  },
  {
    num: 6,
    label: 'Reflecting',
    note: 'Hours later, once the match has finished, looks back at what happened and decides — carefully, so as not to overreact to one result — whether anything genuinely worth remembering should update a short shared note that Reasoning and Betting read before their next decision.',
  },
]

export default function HowItWorks() {
  return (
    <Layout>
      <section className="page-fade">
        <div className="section-head">
          <div>
            <div className="section-tag">The real system, in plain language</div>
            <h2 className="stamp">How It Works</h2>
          </div>
        </div>

        {/* 1. What this is */}
        <div className="hiw-section">
          <p className="hiw-lede">
            Stoppage Time is an AI agent that watches the World Cup and bets real money on it,
            live, in a public arena competition. But the interesting part isn’t the betting —
            it’s that every decision it makes is fully auditable. You can see exactly what it
            read, what it thought, and why it landed on a number. That’s the actual point of
            this project: not <em>can an AI predict football</em>, but{' '}
            <strong>can an AI’s reasoning hold up when you look directly at it.</strong>
          </p>
        </div>

        {/* 2. The one rule everything is built around */}
        <div className="hiw-section">
          <div className="hiw-kicker">The one rule</div>
          <h3>It never gets to peek at the answer first</h3>
          <p className="hiw-lede">
            Most betting systems, human or AI, have the same failure mode: they see the market’s
            price before they form their own opinion, and their opinion quietly drifts toward
            agreeing with it. That defeats the purpose — if you always end up agreeing with the
            market, you can never find the cases where the market is wrong.
          </p>
          <p className="hiw-lede" style={{ marginTop: 12 }}>
            So there’s a hard wall in the middle of the pipeline. The part that forms an opinion
            — reads the tactics, the injury news, the history — <strong>never sees the market
            price at all.</strong> It commits to a probability first. Only afterward does a
            separate part of the system compare that number against what the market thinks, and
            decide whether the gap is worth acting on.
          </p>

          <div className="principle-diagram">
            <div className="principle-flow">
              <div className="principle-card">
                <div className="pc-label">Planning</div>
                <div className="pc-note">Gathers tactics, news, history</div>
              </div>
              <span className="principle-arrow">→</span>
              <div className="principle-card highlight">
                <div className="pc-label">Reasoning</div>
                <div className="pc-note">Commits to a probability — blind to the market</div>
              </div>
              <div className="principle-wall"><span>NO MARKET DATA CROSSES HERE</span></div>
              <span className="principle-arrow">→</span>
              <div className="principle-card">
                <div className="pc-label">Betting</div>
                <div className="pc-note">Compares that number to the real price</div>
              </div>
              <span className="principle-arrow">→</span>
              <div className="principle-card">
                <div className="pc-label">Order</div>
                <div className="pc-note">Placed only if the gap is real</div>
              </div>
            </div>
            <div className="principle-caption">
              <span className="gold">↑ Market price joins right here</span> — after Reasoning
              has already committed, never before.
            </div>
          </div>
        </div>

        {/* 3. Meet the agents */}
        <div className="hiw-section">
          <div className="hiw-kicker">The pipeline</div>
          <h3>Five specialists, each doing one job</h3>
          <p className="hiw-lede">None of them do each other’s jobs.</p>

          <div className="agent-grid">
            {AGENTS.map((a) => (
              <div className="agent-card" key={a.name}>
                <div className="ac-name">{a.name}</div>
                <div className="ac-job">{a.job}</div>
                <div className={`ac-market ${a.seesMarket ? 'yes' : 'no'}`}>
                  Sees the market: {a.seesMarket ? 'Yes' : 'No'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Two ways it makes a decision */}
        <div className="hiw-section">
          <div className="hiw-kicker">Two shapes, one discipline</div>
          <h3>Two ways it makes a decision</h3>
          <p className="hiw-lede">
            Stoppage Time actually runs two different architectures, built for two different
            competition formats.
          </p>

          <div className="compare-grid">
            <div className="compare-col">
              <h4>Multi-Agent</h4>
              <p>
                Everything above — five specialists, each with a narrow job, working in sequence.
                Built for close inspection: every step is its own recorded decision, so you can
                trace exactly where a final number came from.
              </p>
            </div>
            <div className="compare-col">
              <h4>Unified</h4>
              <p>
                A single, much larger call to a more powerful model — one prompt containing the
                full tactical history, all the news, and the market context, asked to reason
                through everything and produce one final decision in one shot. Built for a
                competition format that specifically requires one prompt, one output, no
                multi-step trail. Less inspectable step-by-step, but it holds to the same core
                discipline: form the read on the match, then weigh it against the market — not
                the other way around.
              </p>
            </div>
          </div>
        </div>

        {/* 5. A day in the life of a bet */}
        <div className="hiw-section">
          <div className="hiw-kicker">Start to finish</div>
          <h3>A day in the life of a bet</h3>
          <p className="hiw-lede">Roughly what happens, in order, for one real fixture.</p>

          <div className="clock-track" style={{ marginTop: 28 }}>
            <div className="clock-stops" style={{ gridTemplateColumns: `repeat(${DAY_STEPS.length}, minmax(72px, 1fr))` }}>
              <div className="clock-line" />
              {DAY_STEPS.map((s) => (
                <div className="clock-stop done" key={s.num}>
                  <div className="marker">{s.num}</div>
                  <div className="clock-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="day-steps-list">
            {DAY_STEPS.map((s) => (
              <div className="day-step" key={s.num}>
                <span className="ds-num">{s.num}</span>
                <p><strong>{s.label}.</strong> {s.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Keeping itself honest */}
        <div className="hiw-section">
          <div className="hiw-kicker">Accountability</div>
          <h3>Keeping itself honest</h3>
          <p className="hiw-lede">
            Every single step above gets written down twice: once to the agent’s own private
            record, and once to the competition’s official reasoning ledger — a public,
            standardized trail anyone judging the competition can inspect. Nothing about the
            reasoning is hidden after the fact. If a decision was good, that’s visible. If it
            wasn’t, that’s visible too.
          </p>

          <div className="ledger-diagram">
            <div className="principle-card highlight" style={{ maxWidth: 220 }}>
              <div className="pc-label">Every Step</div>
              <div className="pc-note">Written down the moment it happens</div>
            </div>
            <div className="ledger-arrows"><span>↓</span><span>↓</span></div>
            <div className="ledger-destinations">
              <div className="principle-card">
                <div className="pc-label">Private Record</div>
                <div className="pc-note">The agent’s own internal log</div>
              </div>
              <div className="principle-card">
                <div className="pc-label">Public Ledger</div>
                <div className="pc-note">What anyone judging the competition can inspect</div>
              </div>
            </div>
          </div>
        </div>

        {/* 7. Real stakes, real lessons */}
        <div className="hiw-section">
          <div className="hiw-kicker">Not a simulation</div>
          <h3>Real stakes, real lessons</h3>
          <p className="hiw-lede">
            Every bet is real money, placed live during the tournament. That’s produced some
            genuinely humbling moments: a match that swung from a comfortable lead to a
            last-minute loss with real money on the line, and a night where a badly-tuned stake
            size briefly put a meaningful chunk of the bankroll at risk on a single bet before
            hard dollar caps were added. Both of those are part of the actual build history, not
            smoothed over — the caps and safeguards in the system today exist because of specific
            real mistakes, not because they were designed perfectly the first time.
          </p>
        </div>

        {/* 8. Source */}
        <div className="hiw-section">
          <div className="hiw-kicker">Source</div>
          <h3>Look for yourself</h3>
          <ul className="hiw-sources">
            <li>
              <a href="https://github.com/sanidavidanagama/Stoppage-Time" target="_blank" rel="noreferrer">
                → GitHub repository
              </a>
            </li>
            <li>
              <Link to="/stats">→ Live stats &amp; current record</Link>
            </li>
            <li>
              <span className="pending">→ Stair AI World Cup Arena — link coming soon</span>
            </li>
          </ul>
        </div>
      </section>
    </Layout>
  )
}
