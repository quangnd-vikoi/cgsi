// stores/selectionStore.ts
import { create } from "zustand";

interface SelectedItem {
	id: number;
	name: string;
	code: string;
	issuePrice?: string;
	minUnits?: string;
	openingDate?: string;
	closingDate: string;
	hasDetails: boolean;
	isCompact?: boolean;
	applied: boolean;
}

interface SelectionStore {
	selectedId: number | null;
	selectedItem: SelectedItem | null;
	setSelectedId: (id: number | null) => void;
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
