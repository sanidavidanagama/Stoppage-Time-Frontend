export default function StatCard({ label, value, accent, children }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      {value !== undefined ? (
        <p className={`text-2xl font-bold mt-1 ${accent || 'text-gray-900'}`}>{value}</p>
      ) : (
        children
      )}
    </div>
  )
}
