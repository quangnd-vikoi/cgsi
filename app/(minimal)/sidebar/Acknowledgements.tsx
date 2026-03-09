"use client";

import React, { useEffect, useState } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import CustomSheetTitle from "./_components/CustomSheetTitle";
import Group from "./_components/Group";
import { getAcknowledgementList, getAcknowledgementDetail } from "@/lib/services/profileService";
import type { IAcknowledgementItem, AcknowledgementDetailResponse } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AgreementCategory {
	category: string;
	records: IAcknowledgementItem[];
}

const formatDate = (dateString: string): string => {
	if (!dateString) return "";
	const date = new Date(dateString);
	return date.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
};

const stripHtmlTags = (html: string): string => {
	return html
		.replace(/<[^>]*>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
};

const AgreementItem = ({
	record,
	onClick,
	loading,
}: {
	record: IAcknowledgementItem;
	onClick: () => void;
	loading: boolean;
}) => {
	const displayTitle = stripHtmlTags(record.title);

	return (
		<button
			onClick={onClick}
			disabled={loading}
			className="w-full text-left hover:opacity-80 transition-opacity cursor-pointer p-4 disabled:opacity-60"
		>
			<div className="flex justify-between items-start mb-3">
				<div className="text-sm md:text-base font-normal text-typo-primary">{displayTitle}</div>
				{loading ? (
					<Loader2 className="w-5 h-5 text-cgs-blue flex-shrink-0 mt-0.5 animate-spin" />
				) : (
					<ChevronRight className="w-5 h-5 text-cgs-blue flex-shrink-0 mt-0.5" strokeWidth={2} />
				)}
			</div>

			<div className="flex justify-between text-xs md:text-sm text-typo-tertiary font-normal">
				<span>Version No. {record.versionNo}</span>
				<span>Accepted: {formatDate(record.acceptedOn)}</span>
			</div>
		</button>
	);
};

const Acknowledgements = () => {
	const [categories, setCategories] = useState<AgreementCategory[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [loadingId, setLoadingId] = useState<string | null>(null);
	const [dialogData, setDialogData] = useState<AcknowledgementDetailResponse | null>(null);

	useEffect(() => {
		const fetchAcknowledgements = async () => {
			setLoading(true);
			setError(null);

			const response = await getAcknowledgementList();

			if (response.success && response.data) {
				const data = response.data;
				setCategories([
					{ category: "Text Based Agreements", records: data.textBase || [] },
					{ category: "Online Based Agreements", records: data.onlineBase || [] },
				]);
			} else {
				setError(response.error || "Failed to load acknowledgements");
			}

			setLoading(false);
		};

		fetchAcknowledgements();
	}, []);

	const handleItemClick = async (agreementId: string) => {
		setLoadingId(agreementId);

		const response = await getAcknowledgementDetail(agreementId);

		if (response.success && response.data) {
			setDialogData(response.data);
		}

		setLoadingId(null);
	};

	if (loading) {
		return (
			<div className="h-full flex flex-col">
				<div className="flex-shrink-0 mb-6">
					<CustomSheetTitle backTo={"profile"} title="Acknowledgements" />
				</div>
				<div className="flex-1 flex items-center justify-center">
					<Loader2 className="w-8 h-8 animate-spin text-cgs-blue" />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="h-full flex flex-col">
				<div className="flex-shrink-0 mb-6">
					<CustomSheetTitle backTo={"profile"} title="Acknowledgements" />
				</div>
				<div className="flex-1 flex items-center justify-center">
					<div className="text-center text-typo-tertiary">
						<p className="text-sm">{error}</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="h-full flex flex-col">
			<div className="flex-shrink-0 mb-6">
				<CustomSheetTitle backTo={"profile"} title="Acknowledgements" />
			</div>

			<div className="text-base md:text-lg text-typo-primary font-semibold">Agreements List</div>
			<div className="mt-2 text-sm md:text-base text-typo-secondary">
				Details of agreements and declarations you have acknowledged are displayed here for your
				reference.
			</div>
			<div className="pb-6 pt-3 flex flex-col gap-10 overflow-y-auto flex-1">
				{categories.map((categoryData, index) => (
					<Group key={index} title={categoryData.category}>
						{categoryData.records.length > 0 ? (
							categoryData.records.map((record) => (
								<AgreementItem
									key={record.agreementId}
									record={record}
									onClick={() => handleItemClick(record.agreementId)}
									loading={loadingId === record.agreementId}
								/>
							))
						) : (
							<div className="text-xs text-typo-tertiary text-center font-normal p-4">
								No Records Retrieved
							</div>
						)}
					</Group>
				))}
			</div>

			<Dialog open={!!dialogData} onOpenChange={(open) => !open && setDialogData(null)}>
				<DialogContent className="max-w-3xl max-h-[80vh] flex flex-col p-0 gap-0">
					<DialogHeader className="flex-shrink-0 p-4 md:p-6 pb-3 md:pb-3">
						<DialogTitle className="text-base md:text-lg font-semibold text-typo-primary pr-8">
							{dialogData && stripHtmlTags(dialogData.title)}
						</DialogTitle>
						{dialogData && (
							<div className="flex gap-4 text-xs md:text-sm text-typo-tertiary">
								<span>Version No. {dialogData.versionNo}</span>
								<span>Accepted: {formatDate(dialogData.acceptedOn)}</span>
							</div>
						)}
					</DialogHeader>
					<div
						className="flex-1 overflow-y-auto p-4 md:p-6 pt-0 md:pt-0 text-sm text-typo-secondary"
						dangerouslySetInnerHTML={{
							__html: dialogData?.htmlContent || "",
						}}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Acknowledgements;
