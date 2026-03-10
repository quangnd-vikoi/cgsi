import type { APIResponse } from "@/lib/api/types";

export interface ExportColumn<T> {
	header: string;
	accessor: keyof T | ((row: T) => string | number);
}

interface ExportOptions<T> {
	filename: string;
	columns: ExportColumn<T>[];
	data: T[];
}

export async function exportToExcel<T>({ filename, columns, data }: ExportOptions<T>) {
	const XLSX = await import("xlsx");

	const headers = columns.map((c) => c.header);
	const rows = data.map((row) =>
		columns.map((col) => {
			if (typeof col.accessor === "function") return col.accessor(row);
			return row[col.accessor] as string | number;
		})
	);

	const aoa = [headers, ...rows];
	const ws = XLSX.utils.aoa_to_sheet(aoa);

	// Auto-size columns
	ws["!cols"] = columns.map((_, colIdx) => {
		let maxLen = headers[colIdx].length;
		for (const row of rows) {
			const val = row[colIdx];
			const len = val != null ? String(val).length : 0;
			if (len > maxLen) maxLen = len;
		}
		return { wch: Math.min(maxLen + 2, 40) };
	});

	const wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
	XLSX.writeFile(wb, `${filename}.xlsx`);
}

export async function fetchAllForExport<TResponse, TItem>(
	fetcher: (pageSize: number, pageIndex: number) => Promise<APIResponse<TResponse>>,
	extractItems: (data: TResponse) => TItem[],
): Promise<TItem[]> {
	const res = await fetcher(10000, 0);
	if (!res.success || !res.data) return [];
	return extractItems(res.data);
}
