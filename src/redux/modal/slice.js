import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  type: null, // 'mobileMenu', 'SignOut', 'ErrorSave'
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.type = action.payload;
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
    // toggleModal: (state, action) => {
    //   state.isOpen = !state.isOpen;
    // },
    toggleModal: (state, action) => {
      if (state.type === action.payload && state.isOpen) {
        state.isOpen = false;
        state.type = null;
      } else {
        state.isOpen = true;
        state.type = action.payload;
      }
    },
  },
});
export const { openModal, closeModal, toggleModal } = modalSlice.actions;
export default modalSlice.reducer;
