import Campaigns from "@/components/home/Campaigns";
import Events from "@/components/home/Events";
import Investment from "@/components/home/Investment";

export default function Home() {
	return (
		<div className="">
			<Campaigns />
			<div className="py-6 md:py-12">
				<Investment />
			</div>
			<Events />
		</div>
	);
}
