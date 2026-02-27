import { Skeleton } from "@/components/ui/skeleton";

const EventsSkeleton = () => (
	<div className="bg-background-section py-6 md:py-12">
		<div className="md:mx-6 xl:mx-auto mx-4 xl:max-w-[1320px]">
			<Skeleton className="h-6 w-40 mb-4 md:mb-8" />
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
				{Array.from({ length: 3 }).map((_, i) => (
					<Skeleton key={i} className="h-[320px] md:h-[380px] rounded" />
				))}
			</div>
		</div>
	</div>
);

export default EventsSkeleton;
