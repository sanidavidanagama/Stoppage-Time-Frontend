import Layout from '../components/Layout'

export default function Fixture() {
  return (
    <Layout>
      <section className="page-fade">
        <div className="section-head">
          <div>
            <div className="section-tag">Runs the live pipeline</div>
            <h2 className="stamp">New Fixture Analysis</h2>
          </div>
        </div>
        <p style={{ color: 'var(--muted)' }}>Coming up next.</p>
      </section>
    </Layout>
  )
}
