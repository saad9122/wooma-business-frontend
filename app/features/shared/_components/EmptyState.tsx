"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Frown } from "lucide-react"
import { ReactNode } from "react"

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: ReactNode
  action?: ReactNode // optional button or link
}

export function EmptyState({
  title = "No results found",
  description = "Try adjusting your filters or search criteria.",
  icon = <Frown className="h-12 w-12 text-muted-foreground" />,
  action,
}: EmptyStateProps) {
  return (
    <Card className="w-full py-14 flex items-center justify-center bg-muted/20 border-dashed shadow-sm rounded-2xl">
      <CardContent className="flex flex-col items-center gap-4 text-center">
        {icon}
        <div>
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        {action && <div className="mt-4">{action}</div>}
      </CardContent>
    </Card>
  )
}
