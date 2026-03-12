import { create } from "zustand";
import type { UserType } from "@/constants/userTypes";

interface UserTypeState {
	userType: UserType | null;
	setUserType: (type: UserType | null) => void;
	clearUserType: () => void;
}

export const useUserTypeStore = create<UserTypeState>()((set) => ({
	userType: null,
	setUserType: (type) => set({ userType: type }),
	clearUserType: () => set({ userType: null }),
}));
