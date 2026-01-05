import { create } from 'zustand'

const useAuthStore = create(
  (set, get) => ({
    isAuthenticated: false,
    user: null,
    userMainId: null,
    token: (() => {
      try {
        return localStorage.getItem("token");
      } catch (e) {
        return false;
      }
    }),
    setAuthenticated: (v) => set({ isAuthenticated: v }),
    setUser: (user) => set({ user }),
    setUserMainId: (id) => set({ userMainId: id }),
    setToken: (token) => set({ token }),

    verificationSuccess: "",
    setVerificationSuccess: (value) => set({ verificationSuccess: value }),

    showProfileDetails: false,
    setShowProfileDetails: (v) => set({ showProfileDetails: v }),
    toggleProfileDetails: () => set((state) => ({ showProfileDetails: !state.showProfileDetails })),

    mobileMenuOpen: true,
    setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),
    toggleMobileMenuOpen: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

    search: "",
    setSearch: (v) => set({ search: v }),
    debouncedSearch: "",
    setDebouncedSearch: (v) => set({ debouncedSearch: v }),

    searchQuery: "",
    setSearchQuery: (v) => set({ searchQuery: v }),

    darkMode: (() => {
      try {
        return localStorage.getItem("dark") === "true";
      } catch (e) {
        return false;
      }
    // }), // This does NOT run the function.
    })(), // calls / executes a function.
    toggleDarkMode: () =>
      set((state) => {
        const newMode = !state.darkMode
        localStorage.setItem("dark", newMode)
        return { darkMode: newMode }
      }),
  })
)


export default useAuthStore;