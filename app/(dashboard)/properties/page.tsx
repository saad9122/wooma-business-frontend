"use client"
import { useGetPropertiesListQuery } from "@/app/features/properties/api/propertyApi";
import { PropertiesActions } from "@/app/features/properties/components/PropertiesActions";
import PropertiesTable from "@/app/features/properties/components/table/PropertiesTable";
import { propertiesColumn } from "@/app/features/properties/components/table/PropertiesTableColumns";
import { EmptyState } from "@/app/features/shared/_components/EmptyState";
import { LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";


const Properties = () => {
  const searchParams = useSearchParams()

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const searchQuery = searchParams.get("q") || undefined;

  const { data, isLoading, isFetching, error, refetch } =
    useGetPropertiesListQuery({
      page,
      limit,
      search: searchQuery,
      sort_by: "updated_at",
      sort_order: "desc",
    });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <LoaderCircle size={48} strokeWidth={2} className="animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div>
      {/* <UserSearch/> */}
      {/* {data && data.data.data.length > 0 ? ( */}
      <PropertiesActions />
      {data ? (

        <PropertiesTable
          columns={propertiesColumn}
          data={data.data}
          total={11}
        />
      ) : (
        <EmptyState
          title="No properties found"
          description={"There are no properties available yet."}
        />
      )}
    </div>
  )
}

export default Properties


