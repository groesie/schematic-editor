import { createSlice } from '@reduxjs/toolkit';

const componentsSlice = createSlice({
  name: 'components',
  initialState: {
    components: [],
    recommendations: []
  },
  reducers: {
    addComponent: (state, action) => {
      state.components.push(action.payload);
    },
    setRecommendations: (state, action) => {
      state.recommendations = action.payload;
    },
  },
});

export const { addComponent, setRecommendations } = componentsSlice.actions;
export default componentsSlice.reducer;
