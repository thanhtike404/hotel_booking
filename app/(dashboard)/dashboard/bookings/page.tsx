"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import { DataTable } from "@/components/dataTable/data-table";

export default function Page() {
  const fetchBookings = async () => {
    const data = await axios.get("/api/bookings");
    return data.data.bookings;
  };
  const { data, isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
  });
  console.log(data, "unasdsaved");

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Bookings</h2>
        <p className="text-muted-foreground">Booking List</p>
      </div>
      <DataTable columns={columns} data={data || []} />
    </div>
  );
}
