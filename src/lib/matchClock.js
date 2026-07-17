// Maps a session's pipeline status onto the concept's five-stop "match
// clock" (Kickoff / 1st Half / Team Talk / 2nd Half / Full Time), and
// groups agent_logs rows into the three middle stops by tool name, so the
// same visual works both live (polling) and as historical playback.

export const STOPS = [
  { key: 'kickoff', label: 'Kickoff', marker: "0'", agent: 'Data pulled' },
  { key: 'gathering', label: '1st Half', marker: '1H', agent: 'Tactics · News · H2H' },
  { key: 'reasoning', label: 'Team Talk', marker: 'HT', agent: 'Reasoning Agent' },
  { key: 'betting', label: '2nd Half', marker: '2H', agent: 'Betting Agent' },
  { key: 'result', label: 'Full Time', marker: 'FT', agent: 'Order settled' },
]

const STATUS_INDEX = {
  queued: 0,
  planning: 0,
  'tactical analysis': 1,
  searching: 1,
  reasoning: 2,
  betting: 3,
  awaiting_order: 3,
  skipped: 4,
  completed: 4,
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

const BETTING_TOOLS = new Set(['betting'])
const REASONING_TOOLS = new Set(['reasoning', 'unified'])

// Everything else (pipeline, planning, tactics, news, h2h, and their
// tool-call aliases) counts as "gathering context".
export function groupLogs(logs = []) {
  const gathering = []
  const reasoning = []
  const betting = []
  for (const log of logs) {
    const tool = (log.tool || '').toLowerCase()
    if (BETTING_TOOLS.has(tool)) betting.push(log)
    else if (REASONING_TOOLS.has(tool)) reasoning.push(log)
    else gathering.push(log)
  }
  return { gathering, reasoning, betting }
}

export function isTerminalStatus(status) {
  return ['awaiting_order', 'skipped', 'completed', 'error'].includes(status)
}

// Which stop index is "current" right now, given the session status and
// what's actually landed in the logs so far (used to place the marker
// sensibly on an `error` status, which has no fixed index of its own).
export function currentStopIndex(status, groups) {
  if (status === 'error') {
    if (groups.betting.length) return 3
    if (groups.reasoning.length) return 2
    if (groups.gathering.length) return 1
    return 0
  }
  return STATUS_INDEX[status] ?? 0
}
