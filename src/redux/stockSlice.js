import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchStocks = createAsyncThunk(
  "stock/fetchStocks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://api.twelvedata.com/stocks?exchange=NYSE&apikey=4f61a92dc43f4841b0c2f0a4599f01fa"
      );
      const allStock = response.data.data || [];
      return allStock; 
    } catch (error) {
      console.error("API Error:", error);
      return rejectWithValue(error.response?.data || "API error");
    }
  }
);

const stockSlice = createSlice({
  name: "stock",
  initialState: {
    stock: [],
    filterProduct: [],
    loading: false,
    error: null,
  },
  reducers: {
    filterStock: (state, action) => {
      const searchValue = action.payload.toLowerCase();
      state.filterProduct = state.stock.filter(
        (item) =>
          item.symbol.toLowerCase().includes(searchValue) 
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.loading = false;
        state.stock = action.payload;
        state.filterProduct = action.payload;
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch stocks";
      });
  },
});

export const { filterStock } = stockSlice.actions;
export default stockSlice.reducer;
