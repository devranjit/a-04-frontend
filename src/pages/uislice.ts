import { createSlice } from "@reduxjs/toolkit";

interface UIState {
  isDeleteModalOpen: boolean;
}

const initialState: UIState = {
  isDeleteModalOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openDeleteModal: (state) => {
      state.isDeleteModalOpen = true;
    },
    closeDeleteModal: (state) => {
      state.isDeleteModalOpen = false;
    },
  },
});

export const { openDeleteModal, closeDeleteModal } = uiSlice.actions;
export default uiSlice.reducer;
