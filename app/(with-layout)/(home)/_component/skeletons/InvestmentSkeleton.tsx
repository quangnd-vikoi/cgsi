import { Skeleton } from "@/components/ui/skeleton";

const InvestmentCardSkeleton = () => (
	<div className="relative border border-stroke-secondary rounded-md w-full overflow-hidden">
		<div className="p-6 w-3/4">
			{/* Title + available badge */}
			<div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 md:mb-2">
				<Skeleton className="h-5 md:h-6 w-28 md:w-36" />
				<Skeleton className="h-4 w-20" />
			</div>
			{/* Description — hidden on mobile, matches max-w-[70%] 2-line text */}
			<div className="mt-3 space-y-2 hidden md:block">
				<Skeleton className="h-4 w-[70%]" />
				<Skeleton className="h-4 w-[50%]" />
			</div>
		</div>
		{/* Image placeholder — absolute bottom-right, mirrors real card */}
		<div className="absolute right-6 bottom-0 h-full flex items-end">
			<Skeleton className="w-[90px] h-[120px] rounded-none" />
		</div>
	</div>
);

const InvestmentSkeleton = () => (
	<div className="bg-white container-default">
		<Skeleton className="h-7 w-48" />
		<div className="flex flex-col md:flex-row gap-4 mt-6">
			<InvestmentCardSkeleton />
			<InvestmentCardSkeleton />
		</div>
	</div>
);

export default InvestmentSkeleton;
