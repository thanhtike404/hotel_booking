"use client";

import { useState } from "react";
import { columns } from "./columns";
import { DataTable } from "@/components/dataTable/data-table";
import { RoomsFilter } from "@/components/dashboard/RoomsFilter";
import { useRooms, useBatchDeleteRooms } from "@/hooks/dashboard/useRooms";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBatchDelete } from "@/hooks/dashboard/useBatchDelete";
import Link from "next/link";

export default function RoomsPage() {

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
  });

  const { data, isLoading, error } = useRooms(filters);
  const roomDeleteMutation = useBatchDeleteRooms();
  const { selectedIds, setSelectedIds, handleBatchDelete, isPending } =
    useBatchDelete({
      mutationFn: roomDeleteMutation.mutateAsync,
      getSuccessMessage: (result: any) =>
        `Successfully deleted ${result.deletedCount} booking(s)`,
    });


  const handleFilterChange = (newFilters: any) => {
    setFilters({
      ...newFilters,
      page: 1,
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




  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">Failed to load rooms. Please try again.</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4"
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Rooms</h2>
          <p className="text-muted-foreground">
            Manage hotel rooms and availability
          </p>
        </div>
        <Link href="/dashboard/rooms/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Room
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <RoomsFilter
        onFilterChange={handleFilterChange}
        isLoading={isLoading}
      />

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card p-4 rounded-lg border">
            <div className="text-2xl font-bold">{data.pagination.totalCount}</div>
            <div className="text-sm text-muted-foreground">Total Rooms</div>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <div className="text-2xl font-bold text-green-600">
              {data.rooms?.reduce((sum: number, room: any) => sum + room.available, 0) || 0}
            </div>
            <div className="text-sm text-muted-foreground">Available Rooms</div>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">
              {data.rooms?.reduce((sum: number, room: any) => sum + room._count.bookings, 0) || 0}
            </div>
            <div className="text-sm text-muted-foreground">Total Bookings</div>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <div className="text-2xl font-bold text-purple-600">
              ${data.rooms?.reduce((sum: number, room: any) => sum + room.price, 0)?.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-muted-foreground">Total Value/Night</div>
          </div>
        </div>
      )}


      <DataTable
        isLoading={isLoading}
        columns={columns}
        data={data?.rooms || []}
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