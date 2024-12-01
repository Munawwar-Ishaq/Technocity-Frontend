import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Get_Token, Server_url } from "../../helper/helper";
import { toast } from "react-toastify";

// Login Api Thunk

let token = Get_Token();

export const addAreaApi = createAsyncThunk(
  "AddArea",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${Server_url}/add-area`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addPackageApi = createAsyncThunk(
  "addPackageApi",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${Server_url}/add-package`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getFormDataApi = createAsyncThunk(
  "GetFormData",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${Server_url}/get-form-data`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const formData = createSlice({
  name: "FormData",
  initialState: {
    areaLoading: false,
    areas: null,
    areaSuccess: false,
    packageLoading: false,
    packageSuccess: false,
    packages: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addAreaApi.fulfilled, (state, { payload }) => {
        state.areas = payload.data;
        state.loading = false;
        toast.success(payload.success);
      })
      .addCase(addAreaApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAreaApi.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload.error);
      })
      .addCase(addPackageApi.fulfilled, (state, { payload }) => {
        state.packages = payload.data;
        state.packageLoading = false;
        toast.success(payload.success);
      })
      .addCase(addPackageApi.pending, (state) => {
        state.packageLoading = true;
      })
      .addCase(addPackageApi.rejected, (state, { payload }) => {
        state.packageLoading = false;
        toast.error(payload.error);
      })
      .addCase(getFormDataApi.fulfilled, (state, { payload }) => {
        let area = payload.data.filter((item) => item.type === "area");
        let packages = payload.data.filter((item) => item.type === "package");
        state.areaSuccess = true;
        state.packageSuccess = true;
        state.areas = area;
        state.packages = packages;
        state.packageLoading = false;
        state.areaLoading = false;
      })
      .addCase(getFormDataApi.pending, (state) => {
        state.packageLoading = false;
        state.areaLoading = false;
        state.areaSuccess = false;
        state.packageSuccess = false;
      })
      .addCase(getFormDataApi.rejected, (state, { payload }) => {
        state.packageLoading = false;
        state.areaLoading = false;
        state.areaSuccess = false;
        state.packageSuccess = false;
      });
  },
});

export default formData.reducer;
