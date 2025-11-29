"use client";

import * as React from "react";
import { useGetPropertiesListQuery } from "@/features/properties/api/propertyApi";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 10;

export function PropertiesTable() {
  const [page, setPage] = React.useState(1);

  const { data, isLoading, isFetching, error, refetch } =
    useGetPropertiesListQuery({
      page,
      limit: PAGE_SIZE,
      sort_by: "updated_at",
      sort_order: "desc",
    });

  const properties = data?.data ?? [];
  const pagination = data?.pagination;

  const totalPages = pagination?.total_pages ?? 1;

  const handlePrevious = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  if (isLoading) {
    return (
      <div className="mt-6 rounded-xl border border-border bg-card px-4 py-6 text-sm text-muted-foreground">
        Loading properties…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-6 text-sm">
        <div className="mb-3 font-medium text-destructive">
          Failed to load properties.
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <section className="mt-8 space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div className="text-xs text-muted-foreground">
          {pagination ? (
            <>
              Showing{" "}
              <span className="font-medium">
                {(pagination.page - 1) * pagination.limit + 1}
              </span>{" "}
              –{" "}
              <span className="font-medium">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{" "}
              of <span className="font-medium">{pagination.total}</span>{" "}
              properties
            </>
          ) : null}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Address</TableHead>
            <TableHead>Last activity</TableHead>
            <TableHead className="text-right">Total reports</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3}>
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No properties found yet.
                </div>
              </TableCell>
            </TableRow>
          ) : (
            properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell>
                  <div className="text-sm font-medium text-foreground">
                    {property.address}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {property.city}, {property.postcode}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-secondary-text">
                  {formatDate(property.updated_at)}
                </TableCell>
                <TableCell className="text-right text-sm font-semibold">
                  {property.no_of_reports}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between gap-4 pt-1 text-xs text-muted-foreground">
        <div>
          Page <span className="font-medium">{page}</span> of{" "}
          <span className="font-medium">{totalPages}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={page <= 1 || isFetching}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={page >= totalPages || isFetching}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
