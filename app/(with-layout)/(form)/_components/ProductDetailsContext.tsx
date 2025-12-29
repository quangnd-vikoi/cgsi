"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSelectionStore } from "@/stores/selectionStore";
import { subscriptionService } from "@/lib/services/subscriptionService";
import type { ProductSubscriptionDetailResponse } from "@/types";

interface ProductDetailsContextType {
	productDetails: ProductSubscriptionDetailResponse | null;
	loading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
}

const ProductDetailsContext = createContext<ProductDetailsContextType>({
	productDetails: null,
	loading: false,
	error: null,
	refetch: async () => {},
});

export const useProductDetails = () => {
	const context = useContext(ProductDetailsContext);
	if (!context) {
		throw new Error("useProductDetails must be used within ProductDetailsProvider");
	}
	return context;
};

export const ProductDetailsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { selectedId } = useSelectionStore();
	const [productDetails, setProductDetails] = useState<ProductSubscriptionDetailResponse | null>(
		null
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchProductDetails = useCallback(async () => {
		if (!selectedId) {
			setProductDetails(null);
			setLoading(false);
			setError(null);
			return;
		}

		setLoading(true);
		setError(null);

		const result = await subscriptionService.getProductDetails(selectedId.toString());

		if (result.success && result.data) {
			setProductDetails(result.data);
		} else {
			setError(result.error || "Failed to load product details. Please try again later.");
			setProductDetails(null);
		}

		setLoading(false);
	}, [selectedId]);

	useEffect(() => {
		fetchProductDetails();
	}, [fetchProductDetails]);

	return (
		<ProductDetailsContext.Provider
			value={{
				productDetails,
				loading,
				error,
				refetch: fetchProductDetails,
			}}
		>
			{children}
		</ProductDetailsContext.Provider>
	);
};
