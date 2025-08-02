"use client";
import { customerBookingColumns } from "./columns";
import { DataTable } from "@/components/dataTable/data-table";
import { useBookings, useBatchDeleteBookings } from "@/hooks/dashboard/useBookings";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Page() {
  const { data, isLoading } = useBookings();
  const batchDeleteMutation = useBatchDeleteBookings();
  const [selectedBookingIds, setSelectedBookingIds] = useState<string[]>([]);
  const { toast } = useToast();

  const handleBatchDelete = async () => {
    if (selectedBookingIds.length === 0) return;

    const confirmed = confirm(
      `Are you sure you want to delete ${selectedBookingIds.length} booking(s)? This action cannot be undone.`
    );

    if (confirmed) {
      try {
        const result = await batchDeleteMutation.mutateAsync(selectedBookingIds);
        setSelectedBookingIds([]);
        
        // Show success toast
        toast({
          title: "Success",
          description: `Successfully deleted ${result.deletedCount} booking(s)`,
          variant: "default",
        });
      } catch (error: any) {
        console.error("Failed to delete bookings:", error);
        
        // Show error toast
        toast({
          title: "Error",
          description: error.message || "Failed to delete bookings. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Bookings</h2>
        <p className="text-muted-foreground">Booking List</p>
      </div>
      
      <DataTable 
        isLoading={isLoading} 
        columns={customerBookingColumns} 
        data={data || []}
        onSelectionChange={setSelectedBookingIds}
        batchActions={
          selectedBookingIds.length > 0 ? (
            <Button
              variant="destructive"
              onClick={handleBatchDelete}
              disabled={batchDeleteMutation.isPending}
              className="flex items-center gap-2"
            >
              {batchDeleteMutation.isPending ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete Selected ({selectedBookingIds.length})
            </Button>
          ) : null
        }
      />
    </div>
  );
}
