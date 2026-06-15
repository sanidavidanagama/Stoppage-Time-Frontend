export default function StatCard({ label, value, accent, children }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ backgroundColor: '#111111', border: '1px solid #1e1e1e' }}
    >
      <p
        className="text-xs font-medium uppercase tracking-widest mb-1"
        style={{ color: '#474a4a', letterSpacing: '0.1em' }}
      >
        {label}
      </p>
      {value !== undefined ? (
        <p className={`text-2xl font-bold mt-1 ${accent || 'text-white'}`}>{value}</p>
      ) : (
        children
      )}
    </div>
  )
}
