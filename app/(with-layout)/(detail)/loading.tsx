import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-white/60 z-50 p-6">
			<div className="max-w-4xl w-full space-y-6">
				<Skeleton className="h-12 w-full" />
				<Skeleton className="h-64 w-full" />
				<Skeleton className="h-32 w-full" />
			</div>
		</div>
	);
}
