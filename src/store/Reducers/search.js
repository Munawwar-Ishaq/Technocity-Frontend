import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Get_Token, Server_url } from "../../helper/helper";
import { toast } from "react-toastify";

let token = Get_Token();

export const searchApi = createAsyncThunk(
  "Search ",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${Server_url}/user/search?q=${payload.q}${
          payload.filter ? "&filterarea=" + payload.filter : ""
        }`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err) {
      console.error(err);
      return rejectWithValue(err.response.data);
    }
  }
);

const search = createSlice({
  name: "search",
  initialState: {
    searchText: "",
    results: [],
    isLoading: false,
    error: null,
    showSearchResult: false,
  },
  reducers: {
    setSearchText: (state, action) => {
      state.searchText = action.payload;
      if (state.searchText) {
        state.showSearchResult = true;
      } else {
        state.showSearchResult = false;
      }
    },
    setResults: (state, action) => {
      state.results = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setShowSearchResult: (state, action) => {
      state.showSearchResult = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = action.payload.data;
      })
      .addCase(searchApi.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload.error);
      });
  },
});

export const {
  setSearchText,
  setResults,
  setLoading,
  setError,
  setShowSearchResult,
} = search.actions;

export default search.reducer;
