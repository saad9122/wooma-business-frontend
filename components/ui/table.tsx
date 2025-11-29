import * as React from "react";

export function Table(props: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="relative w-full overflow-x-auto rounded-xl border border-border bg-card">
      <table
        className="w-full caption-bottom text-sm text-left border-collapse"
        {...props}
      />
    </div>
  );
}

export function TableHeader(
  props: React.HTMLAttributes<HTMLTableSectionElement>
) {
  return (
    <thead
      className="bg-muted/60 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
      {...props}
    />
  );
}

export function TableBody(
  props: React.HTMLAttributes<HTMLTableSectionElement>
) {
  return <tbody className="divide-y divide-border" {...props} />;
}

export function TableRow(props: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className="hover:bg-accent/40 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
      {...props}
    />
  );
}

export function TableHead(props: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className="px-4 py-3 text-xs font-medium text-muted-foreground" {...props} />
  );
}

export function TableCell(
  props: React.TdHTMLAttributes<HTMLTableCellElement>
) {
  return <td className="px-4 py-3 align-middle" {...props} />;
}


