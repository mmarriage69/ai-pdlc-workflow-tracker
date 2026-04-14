'use client'

import { Tooltip } from '@base-ui/react'

interface StyledTooltipProps {
  content: string
  children: React.ReactNode
}

/**
 * Styled tooltip using @base-ui/react.
 * White background, dark-grey border, renders in a portal so it is
 * never clipped by overflow:hidden parent containers.
 * Renders a `display:contents` wrapper so the trigger adds no layout impact.
 */
export function StyledTooltip({ content, children }: StyledTooltipProps) {
  if (!content) return <>{children}</>

  return (
    <Tooltip.Root>
      <Tooltip.Trigger delay={400} closeDelay={100} render={<div style={{ display: 'contents' }} />}>
        {children}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner sideOffset={6}>
          <Tooltip.Popup
            className="z-50 max-w-xs rounded-md border border-slate-600 bg-white px-3 py-2 text-xs text-slate-700 shadow-lg leading-relaxed whitespace-pre-line"
          >
            {content}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}
