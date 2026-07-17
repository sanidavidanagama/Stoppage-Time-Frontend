// <input type="datetime-local"> gives back a zoneless string like
// "2026-07-04T18:00" — the browser already shows/collects it in the
// user's own local timezone, there's just no offset attached to the
// string itself. Parse the components explicitly and build the Date via
// the local-time constructor (new Date(y, m, d, h, min) is always
// local-time by spec, unlike Date-string parsing which has more room for
// cross-engine ambiguity for zoneless strings) so the local -> UTC
// conversion below is unambiguous.
export function localDateTimeToUTCISOString(localValue) {
  if (!localValue) return undefined
  const [datePart, timePart] = localValue.split('T')
  if (!datePart || !timePart) return undefined
  const [year, month, day] = datePart.split('-').map(Number)
  const [hour, minute] = timePart.split(':').map(Number)
  const local = new Date(year, month - 1, day, hour, minute)
  if (Number.isNaN(local.getTime())) return undefined
  return local.toISOString()
}

// For displaying what a datetime-local value resolves to in UTC, so the
// conversion isn't invisible to the person filling in the form.
export function formatUTCPreview(localValue) {
  const iso = localDateTimeToUTCISOString(localValue)
  if (!iso) return null
  return iso.replace('.000Z', 'Z')
}
