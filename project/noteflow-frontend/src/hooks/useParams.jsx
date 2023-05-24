import { create } from "zustand";
const useParams = create((set) => ({
  flows: 1,
  setFlows: (param) => set((state) => ({ flows: param })),
  library: 1,
  setLibrary: (param) => set((state) => ({ library: param })),
  calendar: 1,
  setCalendar: (param) => set((state) => ({ calendar: param })),
  settings: 1,
  setSettings: (param) => set((state) => ({ settings: param })),
  tabState: { 0: 1 },
  setTabState: (param) => set((state) => ({ tabState: param })),
  activateKey: 0,
  setActivateKey: (param) => set((state) => ({ activateKey: param })),
  user: {},
  setUser: (userObject) => set((state) => ({ user: userObject })),
}));
export { useParams };
