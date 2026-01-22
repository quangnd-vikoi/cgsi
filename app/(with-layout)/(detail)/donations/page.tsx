"use client";

import { useState, useEffect } from "react";
import Title from "@/components/Title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OneTimeForm from "./_components/OnetimeForm";
import RecurringForm from "./_components/RecurringForm";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getDonationPlans } from "@/lib/services/profileService";
import type { DonationPlanResponse } from "@/types";
import { Loader2 } from "lucide-react";
import { ErrorState } from "@/components/ErrorState";

const Donations = () => {
	const [plans, setPlans] = useState<DonationPlanResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchPlans = async () => {
			setLoading(true);
			const response = await getDonationPlans();

			if (response.success && response.data) {
				setPlans(response.data);
				setError(null);
			} else {
				setError(response.error || "Failed to load donation plans");
			}

			setLoading(false);
		};

		fetchPlans();
	}, []);

	if (loading) {
		return (
			<div className="max-w-[480px] mx-auto flex-1 flex items-center justify-center">
				<div className="flex flex-col items-center gap-3">
					<Loader2 className="h-8 w-8 animate-spin text-cgs-blue" />
					<p className="text-sm text-typo-secondary">Loading donation plans...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="max-w-[480px] mx-auto flex-1 flex items-center justify-center">
				<ErrorState
					title="Unable to Load Donation Plans"
					description={error}
					type="error"
					className="w-[322px]"
				/>
			</div>
		);
	}

	return (
		<div className="max-w-[480px] mx-auto flex-1 flex flex-col h-full">
			<div className="shrink-0">
				<Title
					title="Donation"
					rightContent={
						<Dialog>
							<DialogTrigger asChild>
								<p className="px-3 text-cgs-blue text-xs font-medium cursor-pointer hover:opacity-50">
									Learn More
								</p>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[528px] p-0 gap-2 md:gap-4 max-h-[730px]">
								<DialogHeader className="pad-x pt-6">
									<DialogTitle className="text-left">
										Support Change for Charity
									</DialogTitle>
								</DialogHeader>
								<div className="flex flex-col gap-4 pad-x text-sm md:text-base font-normal text-typo-secondary max-h-[450px] md:max-h-none overflow-auto">
									<p>Making a positive impact on someone’s life need not be complicated.</p>
									<p>
										The COVID-19 pandemic, while devastating in its impact both
										economically and socially, has brought forth our true Singaporean
										spirit. Together as a nation, we stand united and donated generously
										to support the most vulnerable amongst us in our community.
									</p>
									<p>
										Through our partnership with Community Chest, CGSI aims to further
										this spirit of altruism and bring sunshine to those who need it most.
										The Change for Charity programme, a nationally-backed initiative, aims
										to promote a culture of giving, where donating becomes a part of our
										everyday life.
									</p>

									<p>
										Your donations will be matched and multiplied. Both the Singapore
										Government and CGSI will match your donations, making your
										contributions count. Donations made to Community Chest will be
										eligible for 250% tax deductions. Go ahead, donate an amount that you
										are comfortable with today and uplift the lives of individuals who
										need assistance!
									</p>

									<p>
										Together, let’s create a culture of giving and building a sustainable
										future so we can all prosper as one.
									</p>
								</div>
								<DialogFooter className="justify-end rounded-b-lg pad-x flex-row">
									<DialogClose asChild>
										<Button type="button" className="px-3 py-2">
											Close
										</Button>
									</DialogClose>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					}
				/>
			</div>

			{/* Content */}
			<div className="bg-white rounded-xl flex-1 flex flex-col overflow-hidden min-h-0">
				<Tabs defaultValue="onetime" className="flex flex-1 flex-col gap-0 min-h-0">
					{/* Thanh tab */}
					<div className="pad-x">
						<TabsList className="w-full pt-6 shrink-0 ">
							<TabsTrigger className="w-1/2 pb-2" value="onetime">
								One-Time Donation
							</TabsTrigger>
							<TabsTrigger className="w-1/2 pb-2" value="recurring">
								Recurring Donation
							</TabsTrigger>
						</TabsList>
					</div>

					{/* Nội dung co giãn */}
					<div className="flex-1 min-h-0 flex flex-col overflow-hidden">
						<TabsContent value="onetime" className="h-full flex flex-col m-0 flex-1">
							<OneTimeForm plans={plans} />
						</TabsContent>
						<TabsContent value="recurring" className="h-full flex flex-col m-0 flex-1">
							<RecurringForm plans={plans} />
						</TabsContent>
					</div>
				</Tabs>
			</div>
		</div>
	);
};

export default Donations;
