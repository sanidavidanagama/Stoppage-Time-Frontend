import Layout from '../components/Layout'

const ROWS = [
  { num: '01', name: 'Sanida — Manager', role: 'Building & running the arena' },
  { num: '02', name: 'Planning Agent', role: 'Pulls fixture, market & context data' },
  { num: '03', name: 'Tactics Agent', role: 'Consulted independently, no shared priors' },
  { num: '04', name: 'News Agent', role: 'Grounded search for team news' },
  { num: '05', name: 'H2H Agent', role: 'Historical head-to-head record' },
  { num: '06', name: 'Reasoning Agent', role: 'Combines context into a probability' },
  { num: '07', name: 'Betting Agent', role: 'Edge gate + stake sizing' },
]

export default function TeamSheet() {
  return (
    <Layout>
      <section className="page-fade">
        <div className="section-head">
          <div>
            <div className="section-tag">The people &amp; the pipeline</div>
            <h2 className="stamp">Team Sheet</h2>
          </div>
        </div>

        <div className="teamsheet">
          <div>
            {ROWS.map((row) => (
              <div className="squad-row" key={row.num}>
                <div><span className="num">{row.num}</span>{row.name}</div>
                <div className="role">{row.role}</div>
              </div>
            ))}
          </div>

          <div>
            <p style={{ color: 'var(--muted)', lineHeight: 1.8, fontSize: 14.5 }}>
              Stoppage Time runs every World Cup 2026 fixture through one of two pipelines: a
              <strong style={{ color: 'var(--chalk)' }}> multi-agent</strong> run — planning,
              then tactics/news/H2H consulted independently, then reasoning, then a betting agent
              that decides whether the edge is real — or a single <strong style={{ color: 'var(--chalk)' }}>unified</strong> call
              that reasons through everything at once and never skips a decision. Every step,
              LLM call, and tool call in a run is written to an auditable log before any stake is
              placed, and the actual order only ever gets confirmed by hand. The name is the
              thesis: the edge that matters shows up late, once the market has priced in
              everything obvious.
            </p>
            <p style={{ marginTop: 18 }}>
              <a href="https://github.com/sanidavidanagama/Stoppage-Time" target="_blank" rel="noreferrer" style={{ color: 'var(--gold)', fontFamily: "'IBM Plex Mono'", fontSize: 13 }}>
                → github.com/sanidavidanagama/Stoppage-Time
              </a>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  )
}
