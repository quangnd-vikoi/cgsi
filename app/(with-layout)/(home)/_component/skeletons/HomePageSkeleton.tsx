import CampaignsSkeleton from "./CampaignsSkeleton";
import InvestmentSkeleton from "./InvestmentSkeleton";
import EventsSkeleton from "./EventsSkeleton";

const HomePageSkeleton = () => (
	<div>
		<CampaignsSkeleton />
		<div className="py-6 md:py-12">
			<InvestmentSkeleton />
		</div>
		<EventsSkeleton />
	</div>
);

export default HomePageSkeleton;
