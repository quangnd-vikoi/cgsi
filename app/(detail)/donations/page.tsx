import Link from "next/link";
import Title from "@/components/Title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OneTimeForm from "./_components/OnetimeForm";
import RecurringForm from "./_components/RecurringForm";

const Donations = () => {
	return (
		<div className="max-w-[640px] mx-auto flex flex-col h-full">
			<Title
				title="Donation"
				rightContent={
					<Link href={"#"}>
						<p className="px-3 text-enhanced-blue text-xs font-medium">Learn More</p>
					</Link>
				}
			/>

			{/* Form chiếm toàn bộ phần còn lại */}
			<div className="bg-white rounded-xl flex-1 flex flex-col">
				<Tabs defaultValue="onetime" className="flex-1 flex flex-col gap-0">
					<TabsList className="w-full pad-x pt-6">
						<TabsTrigger className="w-1/2 pb-2" value="onetime">
							One-Time Donation
						</TabsTrigger>
						<TabsTrigger className="w-1/2 pb-2" value="recurring">
							Recurring Donation
						</TabsTrigger>
					</TabsList>

					{/* phần nội dung co giãn */}
					<div className="flex-1 overflow-auto">
						<TabsContent value="onetime" className="h-full">
							<OneTimeForm />
						</TabsContent>
						<TabsContent value="recurring" className="h-full">
							<RecurringForm />
						</TabsContent>
					</div>
				</Tabs>
			</div>
		</div>
	);
};

export default Donations;
