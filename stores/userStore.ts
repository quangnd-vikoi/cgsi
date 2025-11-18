import { create } from "zustand";

interface UserState {
	email: string;
	mobile: string;
	getEmail: () => string;
	getMobile: () => string;
	updateEmail: (email: string) => void;
	updateMobile: (mobile: string) => void;
	updateUser: (email: string, mobile: string) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
	email: "rayhan.abhir@gmail.com",
	mobile: "+6591234567",

	getEmail: () => get().email,
	getMobile: () => get().mobile,

	updateEmail: (email) => set({ email }),
	updateMobile: (mobile) => set({ mobile }),
	updateUser: (email, mobile) => set({ email, mobile }),
}));
