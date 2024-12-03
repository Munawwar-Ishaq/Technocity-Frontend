import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Get_Token, Server_url } from "../../helper/helper";
import { toast } from "react-toastify";

export const getUserApi = createAsyncThunk(
  "getUsers",
  async (payload, { rejectWithValue }) => {
    try {
      const token = Get_Token();
      const res = await axios.get(
        `${Server_url}/get/user?limit=${payload.limit || 10}${
          payload.page ? "&page=" + payload.page : ""
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
export const getDeativeUserApi = createAsyncThunk(
  "getDeativeUserApi",
  async (payload, { rejectWithValue }) => {
    try {
      const token = Get_Token();
      const res = await axios.get(
        `${Server_url}/get/user/deactive?limit=${payload.limit || 10}${
          payload.page ? "&page=" + payload.page : ""
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

export const getEditUserInfoApi = createAsyncThunk(
  "getEditUsersInfo",
  async (payload, { rejectWithValue }) => {
    try {
      const token = Get_Token();
      const res = await axios.get(
        `${Server_url}/get/userInfo/edit?userId=${payload}`,
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
export const dashboardData = createAsyncThunk(
  "DashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const token = Get_Token();
      const res = await axios.get(`${Server_url}/dashboard/data`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      console.error(err);
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteUserApi = createAsyncThunk(
  "DeleteUserApi",
  async (payload, { rejectWithValue }) => {
    try {
      const token = Get_Token();
      const res = await axios.delete(`${Server_url}/user/delete/${payload}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      console.error(err);
      return rejectWithValue(err.response.data);
    }
  }
);

export const editUserApi = createAsyncThunk(
  "EditUserApi",
  async (payload, { rejectWithValue }) => {
    try {
      const token = Get_Token();
      const res = await axios.post(`${Server_url}/user/edit`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      console.error(err);
      return rejectWithValue(err.response.data);
    }
  }
);

export const addUserApi = createAsyncThunk(
  "addUser",
  async (payload, { rejectWithValue }) => {
    try {
      const token = Get_Token();
      const res = await axios.post(`${Server_url}/add/user`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data);

      return res.data;
    } catch (err) {
      console.error(err);
      return rejectWithValue(err.response.data);
    }
  }
);

export const userCountApi = createAsyncThunk(
  "userCount",
  async (_, { rejectWithValue }) => {
    try {
      const token = Get_Token();
      const res = await axios.get(`${Server_url}/user/count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      console.error(err);
      return rejectWithValue(err.response.data);
    }
  }
);

const user = createSlice({
  name: "user",
  initialState: {
    allUsers: null,
    isLoading: false,
    addUserSuccess: false,
    usersCount: null,
    newUserCounts: null,
    editUser: null,
    editUserfound: true,
    editUserSuccess: false,
    currentPage: 0,
    totalPages: null,
    filteredUsers: null,
    filteredUserLoading: false,
    filteredUserCount: 0,
    selectedUserAmmountUpdate: {
      userId: null,
      amount: null,
      username: null,
    },
    paymentReport: null,
    recentUsers: null,
    deActiveUsers: null,
    allDeactiveUsers: null,
    isDeativeLoading: false,
    totalDeativePages: null,
    currentDeatcivePage: 0,
  },

  reducers: {
    setEditUser: (state, { payload }) => {
      state.editUser = payload;
    },
    setCurrentPage: (state, { payload }) => {
      state.currentPage = payload;
    },
    setFilteredUsers: (state, { payload }) => {
      state.filteredUsers = payload;
    },
    setSelectedUserAmountUpdate: (state, { payload }) => {
      state.selectedUserAmmountUpdate = {
        ...state.selectedUserAmmountUpdate,
        ...payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        const allUsersCopy = Array.isArray(state.allUsers)
          ? [...state.allUsers]
          : [];

        allUsersCopy.push(...action.payload.data);

        state.allUsers = allUsersCopy;
      })
      .addCase(getUserApi.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(getDeativeUserApi.pending, (state) => {
        state.isDeativeLoading = true;
      })
      .addCase(getDeativeUserApi.fulfilled, (state, action) => {
        state.isDeativeLoading = false;
        state.currentDeatcivePage = action.payload.currentPage;
        state.totalDeativePages = action.payload.totalPages;
        const allUsersCopy = Array.isArray(state.allDeactiveUsers)
          ? [...state.allDeactiveUsers]
          : [];

        allUsersCopy.push(...action.payload.data);

        state.allDeactiveUsers = allUsersCopy;
      })
      .addCase(getDeativeUserApi.rejected, (state, action) => {
        state.isDeativeLoading = false;
      })
      .addCase(addUserApi.fulfilled, (state, { payload }) => {
        toast.success(payload.success);

        const allUsersCopy = Array.isArray(state.allUsers)
          ? [...state.allUsers]
          : [];

        allUsersCopy.unshift(payload.data);

        state.allUsers = allUsersCopy;

        state.addUserSuccess = true;
        state.isLoading = false;
        state.paymentReport = payload.paymentReport;
        state.usersCount = payload.data.allCount;
        state.newUserCounts = payload.data.newCount;
      })
      .addCase(addUserApi.pending, (state) => {
        state.isLoading = true;
        state.addUserSuccess = false;
      })
      .addCase(addUserApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload.error);
        state.addUserSuccess = false;
      })
      .addCase(getEditUserInfoApi.fulfilled, (state, { payload }) => {
        state.editUser = payload.data[0];
        state.isLoading = false;
      })
      .addCase(getEditUserInfoApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEditUserInfoApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload.error);
        state.editUserfound = false;
      })
      .addCase(editUserApi.fulfilled, (state, { payload }) => {
        console.log(payload.data);
        toast.success(payload.success);
        state.isLoading = false;
        state.editUserSuccess = true;
        if (state.allUsers) {
          let findIndex = state.allUsers.findIndex(
            (item) => item._id.toString() === payload.data._id.toString()
          );
          let findDeactiveIndex = state.allDeactiveUsers.findIndex(
            (item) => item._id.toString() === payload.data._id.toString()
          );

          if (payload.data.active) {
            if (findIndex > -1) {
              state.allUsers[findIndex] = payload.data;
            }
            if (findDeactiveIndex > -1) {
              state.allDeactiveUsers.splice(findDeactiveIndex, 1);
            }
          } else {
            if (findIndex > -1) {
              state.allUsers.splice(findIndex, 1);
            }
          }
        }
        state.paymentReport = payload.paymentReport;
        state.editUserSuccess = false;
      })
      .addCase(editUserApi.pending, (state) => {
        state.editUserSuccess = false;
        state.isLoading = true;
      })
      .addCase(editUserApi.rejected, (state, { payload }) => {
        state.success = false;
        state.isLoading = false;
        toast.error(payload.error);
      })
      .addCase(deleteUserApi.fulfilled, (state, { payload }) => {
        console.log(payload.data);
        toast.success(payload.success);
        state.isLoading = false;
        if (state.allUsers) {
          state.allUsers = state.allUsers.filter(
            (user) => user._id !== payload.data.id
          );
        }

        if (state.allDeactiveUsers) {
          state.allDeactiveUsers = state.allDeactiveUsers.filter(
            (user) => user._id !== payload.data.id
          );
        }

        state.usersCount = payload.data.allCount;
        state.newUserCounts = payload.data.newCount;
      })
      .addCase(deleteUserApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUserApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload.error);
      })
      .addCase(dashboardData.fulfilled, (state, { payload }) => {
        state.usersCount = payload.usersCount;
        state.newUserCounts = payload.newUserCounts;
        state.paymentReport = payload.paymentReport;
        state.deActiveUsers = payload.deActiveUsers;
        state.recentUsers = payload.recentUsers;
      });
  },
});

export const {
  setEditUser,
  setCurrentPage,
  setSelectedUserAmountUpdate,
  setFilteredUsers,
} = user.actions;

export default user.reducer;
