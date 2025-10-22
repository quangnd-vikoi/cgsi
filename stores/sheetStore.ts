// stores/sheetStore.ts
import { create } from "zustand";
import { SheetType } from "@/types";

interface SheetStore {
	openSheet: SheetType;
	setOpenSheet: (type: SheetType) => void;
	closeSheet: () => void;
}

export const useSheetStore = create<SheetStore>((set) => ({
	openSheet: null,
	setOpenSheet: (type) => set({ openSheet: type }),
	closeSheet: () => set({ openSheet: null }),
}));
