"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Hotel } from "@/types/hotel";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const columns: ColumnDef<Hotel>[] = [
  {
    accessorKey: "user.name",
    header: "Username",
    meta: {
      search: true,
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <h1 className="text-yellow-500">{row.original.user.name}</h1>
      </div>
    ),
  },
];
