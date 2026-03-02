import { createSlice } from '@reduxjs/toolkit'

export const mayaVrikshSlice = createSlice({
  name: 'mayaVriksh',
  initialState:{
    value: 0,
  },
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})

export const { increment, decrement, incrementByAmount } = mayaVrikshSlice.actions

export default mayaVrikshSlice.reducer