import { create } from 'zustand';

interface AppState {
  walletBalance: number;
  userName: string;
  currentCity: string;
  karmaPoints: number;
  carbonSavedGrams: number;
  profilePictureUrl: string;
  rideHistory: any[];
  setWalletBalance: (balance: number) => void;
  deductBalance: (amount: number) => boolean;
  setUserName: (name: string) => void;
  setProfilePictureUrl: (url: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  walletBalance: 250.00,
  userName: "Ajay M.",
  currentCity: "BLR",
  karmaPoints: 1240,
  carbonSavedGrams: 5400,
  profilePictureUrl: "",
  rideHistory: [],
  setWalletBalance: (balance) => set({ walletBalance: balance }),
  deductBalance: (amount) => {
    const current = get().walletBalance;
    if (current >= amount) {
      set({ walletBalance: current - amount });
      return true;
    }
    return false;
  },
  setUserName: (name) => set({ userName: name }),
  setProfilePictureUrl: (url) => set({ profilePictureUrl: url }),
}));