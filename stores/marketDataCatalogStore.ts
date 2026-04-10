import { create } from "zustand";
import { getMarketDataCatalog } from "@/lib/services/subscriptionService";
import type { IMarketSubscriptionCatalog } from "@/types";

interface LoadCatalogOptions {
	force?: boolean;
}

interface MarketDataCatalogStore {
	catalog: IMarketSubscriptionCatalog | null;
	error: string | null;
	hasLoaded: boolean;
	loading: boolean;
	loadCatalog: (options?: LoadCatalogOptions) => Promise<IMarketSubscriptionCatalog | null>;
}

let catalogRequest: Promise<IMarketSubscriptionCatalog | null> | null = null;

export const useMarketDataCatalogStore = create<MarketDataCatalogStore>((set, get) => ({
	catalog: null,
	error: null,
	hasLoaded: false,
	loading: false,
	loadCatalog: async ({ force = false } = {}) => {
		const { catalog, hasLoaded } = get();

		if (!force && hasLoaded && catalog) {
			return catalog;
		}

		if (catalogRequest) {
			return catalogRequest;
		}

		set({ loading: true, error: null });

		catalogRequest = (async () => {
			try {
				const res = await getMarketDataCatalog();

				if (res.success && res.data) {
					set({
						catalog: res.data,
						error: null,
						hasLoaded: true,
						loading: false,
					});
					return res.data;
				}

				set({
					error: res.error || "Failed to load subscriptions",
					hasLoaded: true,
					loading: false,
				});
				return null;
			} catch {
				set({
					error: "Failed to load subscriptions",
					hasLoaded: true,
					loading: false,
				});
				return null;
			} finally {
				catalogRequest = null;
			}
		})();

		return catalogRequest;
	},
}));
