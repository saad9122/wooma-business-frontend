// Property interface for list view
export interface Property {
  id: string;
  name: string;
  city: string;
  address: string;
  postcode: string;
  no_of_reports: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Report interface
export interface Report {
  id: string;
  type: ReportType;
  status: ReportStatus;
  created_at: string;
  updated_at: string;
  completion_date?: string;
  notes?: string;
}

// Property with reports for detail view
export interface PropertyWithReports extends Property {
  reports: Report[];
}

// Create property request (only required fields)
export interface CreatePropertyRequest {
  address: string;
  city: string;
  postcode: string;
}

// Update property request
export interface UpdatePropertyRequest {
  id: string;
  address?: string;
  city?: string;
  postcode?: string;
}

// Report-related enums
export enum ReportType {
  CHECKIN = "checkin",
  CHECKOUT = "checkout",
  INVENTORY = "inventory",
  MID_TENANCY = "mid-tenancy",
}

export enum ReportStatus {
  IN_PROGRESS = "in_progress",
  TENANT_REVIEW = "tenant_review",
  COMPLETE = "complete",
}

// Filters for property list
export interface PropertyListFilters {
  city?: string;
  postcode?: string;
  search?: string; // Search based on address
  is_active?: boolean;
}

// Filters for property detail reports
export interface PropertyReportsFilters {
  report_type?: ReportType | ReportType[];
  report_status?: ReportStatus | ReportStatus[];
  start_date?: string; // ISO date format
  end_date?: string; // ISO date format
}


