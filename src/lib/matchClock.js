// Builds the pipeline visualization straight from agent_logs — one stop
// per real step, in the order it actually happened, headed by its own
// step_type (Observing/Planning/ToolCalling/Thinking/Reflecting) rather
// than a fixed football-clock metaphor that doesn't fit every run. A
// trailing synthetic "Result" stop is appended for the final outcome
// (order placed / skipped / errored) since that isn't itself a logged
// step but is still worth showing.

const STEP_TYPE_LABELS = {
  Observing: 'Observing',
  Planning: 'Planning',
  ToolCalling: 'Tool Calling',
  Thinking: 'Thinking',
  Reflecting: 'Reflecting',
}

const STEP_TYPE_MARKERS = {
  Observing: 'OBS',
  Planning: 'PLN',
  ToolCalling: 'CALL',
  Thinking: 'THK',
  Reflecting: 'RFL',
}

const TOOL_LABELS = {
  pipeline: 'Pipeline',
  planning: 'Planning Agent',
  tactics: 'Tactics Agent',
  consult_tactics: 'Tactics Agent',
  news: 'News Agent',
  get_fixture_news: 'News Agent',
  h2h: 'H2H Agent',
  get_h2h: 'H2H Agent',
  get_head_to_head: 'H2H Agent',
  reasoning: 'Reasoning Agent',
  betting: 'Betting Agent',
  unified: 'Unified Agent',
}

export function toolLabel(tool) {
  return TOOL_LABELS[tool] || tool || 'Agent'
}

export function stepTypeLabel(stepType) {
  return STEP_TYPE_LABELS[stepType] || stepType || 'Step'
}

function stepMarker(stepType) {
  return STEP_TYPE_MARKERS[stepType] || (stepType ? stepType.slice(0, 3).toUpperCase() : '•')
}

export function isTerminalStatus(status) {
  return ['awaiting_order', 'skipped', 'completed', 'error'].includes(status)
}

function byCreatedAt(a, b) {
  const ta = a.created_at ? new Date(a.created_at).getTime() : 0
  const tb = b.created_at ? new Date(b.created_at).getTime() : 0
  return ta - tb
}

// One stop per log entry, chronological, plus a trailing "Result" stop.
export function buildStops(logs = []) {
  const stops = [...logs].sort(byCreatedAt).map((log) => ({
    id: log.id,
    marker: stepMarker(log.step_type),
    label: stepTypeLabel(log.step_type),
    subtitle: toolLabel(log.tool),
    log,
    isResult: false,
  }))
  stops.push({ id: 'result', marker: 'FT', label: 'Result', subtitle: 'Outcome', isResult: true })
  return stops
}

// Index of the stop that's "current" right now: the last real log while a
// run is in flight, or the trailing Result stop once it's terminal. -1
// means nothing has landed yet (session created, no steps logged so far).
export function activeStopIndex(status, stops) {
  const realCount = stops.length - 1
  if (isTerminalStatus(status)) return stops.length - 1
  return realCount > 0 ? realCount - 1 : -1
}
