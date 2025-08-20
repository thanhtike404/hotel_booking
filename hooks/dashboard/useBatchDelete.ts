"use client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseBatchDeleteOptions<T> {
    mutationFn: (ids: string[]) => Promise<T>;
    getSuccessMessage?: (result: T) => string;
    getErrorMessage?: (error: any) => string;
}

export function useBatchDelete<T>({
    mutationFn,
    getSuccessMessage,
    getErrorMessage,
}: UseBatchDeleteOptions<T>) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isPending, setIsPending] = useState(false);
    const { toast } = useToast();

    const handleBatchDelete = async () => {
        if (selectedIds.length === 0) return;

        const confirmed = confirm(
            `Are you sure you want to delete ${selectedIds.length} item(s)? This action cannot be undone.`
        );

        if (!confirmed) return;

        try {
            setIsPending(true);
            const result = await mutationFn(selectedIds);
            setSelectedIds([]);

            toast({
                title: "Success",
                description: getSuccessMessage
                    ? getSuccessMessage(result)
                    : `Successfully deleted ${selectedIds.length} item(s)`,
                variant: "default",
            });
        } catch (error: any) {
            console.error("Batch delete failed:", error);

            toast({
                title: "Error",
                description: getErrorMessage
                    ? getErrorMessage(error)
                    : error.message || "Failed to delete items. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsPending(false);
        }
    };

    return {
        selectedIds,
        setSelectedIds,
        handleBatchDelete,
        isPending,
    };
}
