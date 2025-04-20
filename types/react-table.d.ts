// src/types/react-table.d.ts
import '@tanstack/react-table';

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue> {
        search?: boolean;
        calendar?: boolean;
        // Add other custom meta properties
    }
}