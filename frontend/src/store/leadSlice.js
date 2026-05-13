import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    activeFilter: "All",
    searchQuery: "",
    selectedLeadId: null,         // ← just ID, not full object
    isAddLeadModalOpen: false,
    isTimelineDialogOpen: false,
    isDarkMode: true
}

const leadSlice = createSlice({
    name: "lead",
    initialState,
    reducers: {
        setActiveFilter: (state, action) => {
            state.activeFilter = action.payload;
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        openAddLeadModal: (state) => {
            state.isAddLeadModalOpen = true;
        },
        closeAddLeadModal: (state) => {
            state.isAddLeadModalOpen = false;
        },
        openTimelineDialog: (state, action) => {
            state.selectedLeadId = action.payload  // ← just the ID
            state.isTimelineDialogOpen = true;
        },
        closeTimelineDialog: (state) => {
            state.selectedLeadId = null;
            state.isTimelineDialogOpen = false;
        },
        toggleTheme: (state) => {
            state.isDarkMode = !state.isDarkMode
        },
    }
});

export const {
    setActiveFilter,
    setSearchQuery,
    openAddLeadModal,
    closeAddLeadModal,
    openTimelineDialog,
    closeTimelineDialog,
    toggleTheme,
} = leadSlice.actions;

export default leadSlice.reducer;