import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  components: [],
  recommendations: [],
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    addComponent: (state, action) => {
      state.components.push(action.payload);
    },
    setRecommendations: (state, action) => {
      state.recommendations = action.payload;
    },
    loadComponents: (state, action) => {
      state.components = action.payload.map((name, index) => ({
        id: index,
        name,
        x: 0,
        y: 0
      }));
    }
  },
});

export const { addComponent, setRecommendations, loadComponents } = editorSlice.actions;
export default editorSlice.reducer;
