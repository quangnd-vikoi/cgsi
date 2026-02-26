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
	setSelectedId: (id: string | null) => void;
	setSelectedItem: (item: SelectedItem | null) => void;
	clearSelection: () => void;
}

export const useSelectionStore = create<SelectionStore>((set) => ({
	selectedId: null,
	selectedItem: null,
	setSelectedId: (id) => set({ selectedId: id }),
	setSelectedItem: (item) => set({ selectedItem: item, selectedId: item?.id ?? null }),
	clearSelection: () => set({ selectedId: null, selectedItem: null }),
}));
