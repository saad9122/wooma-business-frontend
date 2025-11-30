'use client';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Users, Search, Filter } from 'lucide-react';
import { DataTablePagination } from './TablePagination';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  total: number
}

function PropertiesTable<TData, TValue>({ columns, data, total }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const router = useRouter()

  const searchParams = useSearchParams()

  const page = Number(searchParams.get("page") ?? 1)
  const limit = Number(searchParams.get("limit") ?? 10)

  const updateUrl = (page: number, limit: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(page + 1))
    params.set("limit", String(limit))
    router.push(`?${params.toString()}`)
  }

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    pageCount: page
  });

  return (
    <div className="relative mt-4 p-16">
      {/* Table Container */}
      <div className="bg-white/95 rounded-md border border-primary-text *:overflow-hidden relative">
        
        {/* Header Section */}
        <div className="relative z-10 p-6 border-b border-gray-200/70 from-gray-50/80 to-white/60 backdrop-blur-sm">
        <h1>Properties</h1>
        </div>

        {/* Table */}
        <div className="relative z-10 overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup, groupIndex) => (
                <TableRow 
                  key={headerGroup.id} 
                  className="border-b transition-all duration-200"
                >
                  {headerGroup.headers.map((header, headerIndex) => {
                    return (
                      <TableHead 
                        key={header.id} 
                        className="font-semibold py-4 px-6 relative group" 
                        style={{ width: `${header.getSize()}%` }}
                      >
                        {/* Header decoration */}
                        <div className="absolute inset-0 transition-colors duration-200" />
                        <div className="relative">
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </div>
                        
                        {/* Column separator */}
                        {headerIndex < headerGroup.headers.length - 1 && (
                          <div className="absolute right-0 top-3 bottom-3 w-px from-transparent via-gray-300 to-transparent opacity-50" />
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, rowIndex) => (
                  <TableRow 
                    key={row.id} 
                    data-state={row.getIsSelected() && 'selected'} 
                    className={`group transition-all duration-200 hover:from-green-50/30 hover:to-green-100/20 border-b border-gray-100/70 ${
                      rowIndex % 2 === 0 ? 'bg-white/40' : 'bg-gray-50/20'
                    }`}
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => (
                      <TableCell 
                        key={cell.id} 
                        className="py-4 px-6 relative group-hover:text-gray-900 transition-colors duration-200"
                      >
                        {/* Cell hover effect */}
                        <div className="absolute inset-0 transition-colors duration-200" />
                        <div className="relative">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      </TableCell>
                    ))}
                    
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-gray-50/50 transition-colors duration-200">
                  <TableCell 
                    colSpan={columns.length} 
                    className="h-40 text-center relative"
                  >
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gray-300/20 blur-xl" />
                        <div className="relative p-4 bg-gray-100/80 rounded-full">
                          <Users className="w-8 h-8 text-gray-400" />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-medium text-gray-600 mb-1">No users found</p>
                        <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer with Pagination */}
        <div className="relative z-10 p-6 border-t border-gray-200/70 from-white/60 to-gray-50/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
              </div>
            </div>
            
            <div className="relative">
              {/* Pagination glow effect */}
              <div className="absolute inset-0 bg-green-500/5 rounded-xl blur-sm" />
              <div className="relative">
                <DataTablePagination table={table} total={total}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertiesTable;