import { useState, useCallback } from "react";
import { toast } from "@/components/ui/toaster";

type ExportFn = () => Promise<{ success: boolean; error: string | null }>;

/**
 * Shared hook for server-side Excel export.
 * Manages loading state and toast feedback in one place.
 *
 * Usage:
 *   const { exporting, handleExport } = useExport();
 *   <Button onClick={() => handleExport(() => exportHoldings(accountNo))} disabled={exporting} />
 */
export function useExport() {
	const [exporting, setExporting] = useState(false);

	const handleExport = useCallback(async (exportFn: ExportFn) => {
		if (exporting) return;
		setExporting(true);
		try {
			const result = await exportFn();
			if (result.success) {
				toast.success("Export Complete", "File downloaded successfully.");
			} else {
				toast.error("Export Unsuccessful", result.error || "We were unable to export your file. Please try again later.");
			}
		} catch {
			toast.error("Export Unsuccessful", "We were unable to export your file. Please try again later.");
		} finally {
			setExporting(false);
		}
	}, [exporting]);

	return { exporting, handleExport };
}
