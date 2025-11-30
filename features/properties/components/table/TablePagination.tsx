"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table } from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  total: number
}

export function DataTablePagination<TData>({
  table,
  total,
}: DataTablePaginationProps<TData>) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const page = Number(searchParams.get("page") ?? 1)
  const limit = Number(searchParams.get("limit") ?? 10)

  const pageCount = Math.ceil(total / limit)

  const updateUrl = (newPage: number, newLimit: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(newPage))
    params.set("limit", String(newLimit))
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex items-center justify-between px-2 mt-4">

      <div className="flex items-center space-x-6 lg:space-x-8">
        {/* Rows per page */}
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={String(limit)}
            onValueChange={(value) => updateUrl(1, Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={limit} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 25, 30, 40].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page info */}
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {page} of {pageCount}
        </div>

        {/* Pagination buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="md"
            className="hidden size-8 lg:flex"
            onClick={() => updateUrl(1, limit)}
            disabled={page <= 1}
          >
            <div className="text-primary-text"> <ChevronsLeft /> </div>

          </Button>
          <Button
            variant="outline"
            size="md"
            className="size-8"
            onClick={() => updateUrl(page - 1, limit)}
            disabled={page <= 1}
          >
            <div className="text-primary-text"> <ChevronLeft /> </div>


          </Button>
          <Button
            variant="outline"
            size="md"
            className="size-8"
            onClick={() => updateUrl(page + 1, limit)}
            disabled={page >= pageCount}
          >
            <div className="text-primary-text"> <ChevronRight /> </div>

          </Button>
          <Button
            variant="outline"
            size="md"
            className="hidden size-8 lg:flex"
            onClick={() => updateUrl(pageCount, limit)}
            disabled={page >= pageCount}
          >
            <div className="text-primary-text"> <ChevronsRight /> </div>
            
          </Button>
        </div>
      </div>
    </div>
  )
}
