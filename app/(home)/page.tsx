import Campaigns from "./_component/Campaigns";
import Events from "./_component/Events";
import Investment from "./_component/Investment";
import ProductInformation from "./_component/ProductInformation";

export default function Home() {
	return (
		<div className="">
			<Campaigns />
			<div className="py-6 md:py-12">
				<Investment />
			</div>
			<Events />

			<ProductInformation />
		</div>
	);
}
