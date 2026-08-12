import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

interface AppState {
  userName: string;
  walletBalance: number;
  karmaPoints: number;
  carbonSavedGrams: number;
  isInitialized: boolean;
  addMoney: (amount: number) => Promise<void>;
  addKarma: (points: number) => Promise<void>;
  fetchUserData: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userName: "Guest",
      walletBalance: 0,
      karmaPoints: 0,
      carbonSavedGrams: 0,
      isInitialized: false,
      
      addMoney: async (amount: number) => {
        set((state) => ({ walletBalance: state.walletBalance + amount }));
        
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const newBalance = get().walletBalance;
          await supabase.from('commuter_profiles').update({ wallet_balance: newBalance }).eq('id', user.id);
        }
      },

      addKarma: async (points: number) => {
        set((state) => ({ karmaPoints: state.karmaPoints + points }));
        
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const newKarma = get().karmaPoints;
          await supabase.from('commuter_profiles').update({ karma_points: newKarma }).eq('id', user.id);
        }
      },

      fetchUserData: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            const { data, error } = await supabase.from('commuter_profiles').select('*').eq('id', user.id).single();
            if (data) {
              set({
                userName: data.full_name || user.email?.split('@')[0] || "Commuter",
                walletBalance: Number(data.wallet_balance) || 0,
                karmaPoints: data.karma_points || 0,
                carbonSavedGrams: data.carbon_saved_grams || 0,
              });
            }
          }
          // IMPORTANT: If they are a GUEST (no user), we DO NOT reset the state to 0 here anymore.
          // We leave their local Zustand state exactly as it is, preserving their earned Karma!
        } catch (error) {
          console.error("Supabase Fetch Error:", error);
        } finally {
          set({ isInitialized: true }); 
        }
      }
    }),
    {
      name: 'bharat-vision-storage', // This string tells the browser to save this data permanently!
      storage: createJSONStorage(() => localStorage), 
    }
  )
);