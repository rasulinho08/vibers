import { create } from 'zustand';

export type Role = 'participant' | 'mentor' | 'volunteer' | 'admin' | 'staff' | 'partner' | null;

interface UserState {
  role: Role;
  setRole: (role: Role) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  role: null,
  setRole: (role) => set({ role }),
  logout: () => set({ role: null }),
}));
