import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserType } from "@/constants/userTypes";

interface UserTypeState {
	userType: UserType | null;
	setUserType: (type: UserType | null) => void;
	clearUserType: () => void;
}

export const useUserTypeStore = create<UserTypeState>()(
	persist(
		(set) => ({
			userType: null,
			setUserType: (type) => set({ userType: type }),
			clearUserType: () => set({ userType: null }),
		}),
		{
			name: "user-type-storage",
			storage: createJSONStorage(() => localStorage),
		}
	)
);
