"use client";

import React, { useEffect, useState } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import CustomSheetTitle from "./_components/CustomSheetTitle";
import Group from "./_components/Group";
import { getAcknowledgementList, getAcknowledgementDetail } from "@/lib/services/profileService";
import type { IAcknowledgementItem, AcknowledgementDetailResponse } from "@/types";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";

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
	return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
};

const AgreementItem = ({
	record,
	onClick,
}: {
	record: IAcknowledgementItem;
	onClick: () => void;
}) => {
	const displayTitle = stripHtmlTags(record.title);

	return (
		<button
			onClick={onClick}
			className="w-full text-left hover:opacity-80 transition-opacity cursor-pointer"
		>
			<div className="flex justify-between items-start mb-3">
				<div className="text-sm font-normal text-typo-primary">{displayTitle}</div>
				<ChevronRight
					className="w-5 h-5 text-enhanced-blue flex-shrink-0 mt-0.5"
					strokeWidth={2}
				/>
			</div>

			<div className="flex justify-between text-xs text-typo-tertiary font-normal">
				<span>Version No. {record.versionNo}</span>
				<span>Accepted: {formatDate(record.acceptedOn)}</span>
			</div>
		</button>
	);
};

const AcknowledgementDetailDialog = ({
	open,
	onOpenChange,
	detail,
	loading,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	detail: AcknowledgementDetailResponse | null;
	loading: boolean;
}) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{loading ? "Loading..." : detail ? stripHtmlTags(detail.title) : "Agreement Details"}
					</DialogTitle>
					{detail && (
						<DialogDescription>
							Version {detail.versionNo} • Accepted: {formatDate(detail.acceptedOn)}
						</DialogDescription>
					)}
				</DialogHeader>
				{loading ? (
					<div className="flex items-center justify-center py-8">
						<Loader2 className="w-6 h-6 animate-spin text-enhanced-blue" />
					</div>
				) : detail?.htmlContent ? (
					<div
						className="prose prose-sm max-w-none text-typo-secondary"
						dangerouslySetInnerHTML={{ __html: detail.htmlContent }}
					/>
				) : detail?.url ? (
					<a
						href={detail.url}
						target="_blank"
						rel="noopener noreferrer"
						className="text-enhanced-blue underline"
					>
						View Agreement Document
					</a>
				) : (
					<p className="text-typo-tertiary">No content available</p>
				)}
			</DialogContent>
		</Dialog>
	);
};

const Acknowledgements = () => {
	const [categories, setCategories] = useState<AgreementCategory[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedDetail, setSelectedDetail] = useState<AcknowledgementDetailResponse | null>(null);
	const [detailLoading, setDetailLoading] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);

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
					{ category: "Interactive Based Agreements", records: data.interactiveBase || [] },
					{ category: "PDF Based Agreements", records: data.pdfBase || [] },
				]);
			} else {
				setError(response.error || "Failed to load acknowledgements");
			}

			setLoading(false);
		};

		fetchAcknowledgements();
	}, []);

	const handleItemClick = async (agreementId: string) => {
		setDialogOpen(true);
		setDetailLoading(true);
		setSelectedDetail(null);

		const response = await getAcknowledgementDetail(agreementId);

		if (response.success && response.data) {
			setSelectedDetail(response.data);
		}

		setDetailLoading(false);
	};

	if (loading) {
		return (
			<div className="h-full flex flex-col">
				<div className="flex-shrink-0 mb-6">
					<CustomSheetTitle backTo={"profile"} title="Acknowledgements" />
				</div>
				<div className="flex-1 flex items-center justify-center">
					<Loader2 className="w-8 h-8 animate-spin text-enhanced-blue" />
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
			<div className="pb-6 pt-3 flex flex-col gap-10 overflow-y-auto flex-1">
				{categories.map((categoryData, index) => (
					<Group key={index} title={categoryData.category}>
						{categoryData.records.length > 0 ? (
							categoryData.records.map((record) => (
								<AgreementItem
									key={record.agreementId}
									record={record}
									onClick={() => handleItemClick(record.agreementId)}
								/>
							))
						) : (
							<div className="text-xs text-typo-tertiary text-center font-normal">
								No Records Retrieved
							</div>
						)}
					</Group>
				))}
			</div>
			<AcknowledgementDetailDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				detail={selectedDetail}
				loading={detailLoading}
			/>
		</div>
	);
};

export default Acknowledgements;
