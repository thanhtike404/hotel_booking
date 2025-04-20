"use client";

import { columns } from "./columns";
import { DataTable } from "@/components/dataTable/data-table";
import { useQuery } from "@tanstack/react-query";

export default function CitiesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/cities");
      const data = await response.json();
      return data;
    },
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Cities</h2>
        <p className="text-muted-foreground">Manage hotel locations by city</p>
      </div>
      <DataTable isLoading={isLoading} columns={columns} data={data || []} />
    </div>
  );
}
