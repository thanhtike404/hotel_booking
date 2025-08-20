"use client";
import { columns } from "./columns";
import { DataTable } from "@/components/dataTable/data-table";
import { useBookings, useBatchDeleteBookings } from "@/hooks/dashboard/useBookings";
import { useBatchDelete } from "@/hooks/dashboard/useBatchDelete";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { BookingFilter } from "@/components/dashboard/bookings/BookingFilter";
export default function Page() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
  });
  const { data, isLoading } = useBookings(
    filters
  );

  const bookingDeleteMutation = useBatchDeleteBookings();

  const { selectedIds, setSelectedIds, handleBatchDelete, isPending } =
    useBatchDelete({
      mutationFn: bookingDeleteMutation.mutateAsync,
      getSuccessMessage: (result: any) =>
        `Successfully deleted ${result.deletedCount} booking(s)`,
    });




  const handleFilterChange = (newFilters: any) => {
    setFilters({
      ...newFilters,
      page: 1, // Reset to first page when filters change
      limit: filters.limit,
    });
  };


  const handlePageChange = (page: number) => {
    setFilters({
      ...filters,
      page,
    });
  };

  const handlePageSizeChange = (limit: number) => {
    setFilters({
      ...filters,
      limit,
      page: 1,
    });
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Bookings</h2>
        <p className="text-muted-foreground">Booking List</p>
      </div>
      <BookingFilter onFilterChange={handleFilterChange} />
      <DataTable
        isLoading={isLoading}
        columns={columns}
        data={data?.bookings || []}
        onSelectionChange={setSelectedIds}
        pagination={{
          page: filters.page,
          limit: filters.limit,
          totalCount: data?.pagination.totalCount || 0,
          totalPages: data?.pagination.totalPages || 0,
          hasNextPage: data?.pagination.hasNextPage || false,
          hasPreviousPage: data?.pagination.hasPreviousPage || false,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange,
        }}
        batchActions={
          selectedIds.length > 0 ? (
            <Button
              variant="destructive"
              onClick={handleBatchDelete}
              disabled={isPending}
              className="flex items-center gap-2"
            >
              {isPending ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete Selected ({selectedIds.length})
            </Button>
          ) : null
        }
      />
    </div>
  );
}
