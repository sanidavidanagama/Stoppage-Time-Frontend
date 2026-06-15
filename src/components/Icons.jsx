const iconProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function BarChartIcon({ size = 18, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <rect x="3" y="12" width="4" height="9" rx="0.5" />
      <rect x="9.5" y="7" width="4" height="14" rx="0.5" />
      <rect x="16" y="3" width="4" height="18" rx="0.5" />
    </svg>
  )
}

export function ListIcon({ size = 18, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <line x1="9" y1="6" x2="20" y2="6" />
      <line x1="9" y1="12" x2="20" y2="12" />
      <line x1="9" y1="18" x2="20" y2="18" />
      <circle cx="4.5" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function TrendingUpIcon({ size = 18, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}

export function TerminalIcon({ size = 18, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  )
}

export function LogOutIcon({ size = 18, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

export function ChevronLeftIcon({ size = 16, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

export function ChevronRightIcon({ size = 16, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

export function ChevronDownIcon({ size = 14, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export function PlayIcon({ size = 14, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function TrashIcon({ size = 14, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

export function ActivityIcon({ size = 18, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
}

export function ClockIcon({ size = 14, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

export function ZapIcon({ size = 14, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FileTextIcon({ size = 40, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

export function InboxIcon({ size = 40, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  )
}

export function LockIcon({ size = 20, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

export function UserIcon({ size = 20, ...props }) {
  return (
    <svg {...iconProps} width={size} height={size} {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
