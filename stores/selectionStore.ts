// stores/selectionStore.ts
import { create } from "zustand";

interface SelectedItem {
	id: string;
	name: string;
	code: string;
	issuePrice?: string;
	minUnits?: string;
	openingDate?: string;
	closingDate: string;
	hasDetails: boolean;
	isCompact?: boolean;
	subscribed: boolean;
}

interface SelectionStore {
	selectedId: string | null;
	selectedItem: SelectedItem | null;
	subscribedProductIds: string[];
	setSelectedId: (id: string | null) => void;
	setSelectedItem: (item: SelectedItem | null) => void;
	markProductSubscribed: (id: string) => void;
	clearSelection: () => void;
}

export const useSelectionStore = create<SelectionStore>((set) => ({
	selectedId: null,
	selectedItem: null,
	subscribedProductIds: [],
	setSelectedId: (id) => set({ selectedId: id }),
	setSelectedItem: (item) => set({ selectedItem: item, selectedId: item?.id ?? null }),
	markProductSubscribed: (id) =>
		set((state) => ({
			subscribedProductIds: state.subscribedProductIds.includes(id)
				? state.subscribedProductIds
				: [...state.subscribedProductIds, id],
		})),
	clearSelection: () => set({ selectedId: null, selectedItem: null }),
}));
