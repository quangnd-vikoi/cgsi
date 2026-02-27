import { Skeleton } from "@/components/ui/skeleton";

const CampaignsSkeleton = () => (
	<section className="bg-background-section">
		<div className="py-6 md:py-8 lg:py-10 container-default">
			<Skeleton className="h-6 w-48 mb-4 md:mb-6" />
			<div className="flex gap-4">
				<Skeleton className="h-[320px] md:h-[380px] basis-[55%] lg:basis-[57%] shrink-0" />
				<Skeleton className="h-[320px] md:h-[380px] basis-[40%] lg:basis-[25%] shrink-0" />
			</div>
		</div>
	</section>
);

export default CampaignsSkeleton;
