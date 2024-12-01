import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Get_Token, Server_url, Set_Token } from "../../helper/helper";
import { toast } from "react-toastify";

// Login API Thunk
export const loginApi = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${Server_url}/login`, payload);
      console.log(res);
      return res.data;
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || 'Something went wrong';
      return rejectWithValue(errorMsg);
    }
  }
);

// Update Admin Info API Thunk
export const updateAdminApi = createAsyncThunk(
  "auth/updateAdmin",
  async (payload, { rejectWithValue }) => {
    const token = Get_Token(); 
    try {
      const res = await axios.post(
        `${Server_url}/update-admin-info`, 
        payload, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Something went wrong';
      return rejectWithValue(errorMsg);
    }
  }
);

const auth = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    user: null,
    loading: false,
    updatefield: null,
  },
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.loading = false;
      toast.info("Logged out successfully");
    },
    setLoggedIn: (state, { payload }) => {
      state.user = payload.user;
      state.loading = false;
      state.isLoggedIn = true;
    },
    setUpdateField: (state, { payload }) => {
      state.updatefield = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginApi.fulfilled, (state, { payload }) => {
        console.log(payload);
        state.user = payload.data;
        state.loading = false;
        Set_Token(payload.token);  // Store the token for further use
        toast.success(payload.success || 'Login successful');
        state.isLoggedIn = true;
      })
      .addCase(loginApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginApi.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload || 'Login failed');
      })
      .addCase(updateAdminApi.fulfilled, (state, { payload }) => {
        state.user = payload.data;
        state.loading = false;
        state.updatefield = null;
        toast.success(payload.success || 'Admin info updated');
      })
      .addCase(updateAdminApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAdminApi.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload || 'Update failed');
      });
  },
});

export const { logout, setLoggedIn, setUpdateField } = auth.actions;

export default auth.reducer;
