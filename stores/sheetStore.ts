// stores/sheetStore.ts
import { create } from "zustand";
import { SheetType } from "@/types";

interface SheetStore {
	openSheet: SheetType | null;
	payload?: unknown;
	setOpenSheet: (type: SheetType, payload?: unknown) => void;
	closeSheet: () => void;
}

export const useSheetStore = create<SheetStore>((set) => ({
	openSheet: null,
	payload: undefined,
	setOpenSheet: (type, payload?) => set({ openSheet: type, payload }),
	closeSheet: () => set({ openSheet: null, payload: undefined }),
}));
