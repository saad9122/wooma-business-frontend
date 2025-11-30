'use client';
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import moment from "moment"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Property } from "../../types/property.types";


export const propertiesColumn: ColumnDef<Property>[] = [
  {
    accessorKey: "address",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
      >
        Address
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const address = row.getValue<string>("address")

      return (
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <div className="truncate max-w-[200px] cursor-help">
                {address || "N/A"}
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="max-w-[400px] max-h-[300px] overflow-y-auto whitespace-pre-wrap break-words p-3"
            >
              <p className="text-sm">{address}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  size: 40,
  },

  {
    accessorKey: "updated_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
      >
        Last Activity
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const updatedAt = row.getValue<string>("updated_at")
      return (
        <div>{moment(updatedAt).format("DD MMM YYYY, hh:mm A")}</div>
      )
    },
    size: 20,
  },

  {
    accessorKey: "no_of_reports",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
      >
        No. of Reports
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),

    cell: ({ row }) => {  
      const count = row.getValue<number>("no_of_reports")
      return <div>{count ?? 0}</div>
    },
    size: 25,
  },
    {
    accessorKey: 'actions',
    header: ({ column }) => {
      return <div className="text-center w-full"></div>;
    },
    cell: ({ row }) => {
      return (
        <div className="flex justify-center gap-4">
          {">"}
        </div>
      );
    },
    size: 20,
  },
  
]
