import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Get_Token, Server_url } from "../../helper/helper";
import { toast } from "react-toastify";

// Token fetch
let token = Get_Token();

// Thunk for uploading Excel data
export const uploadExcelData = createAsyncThunk(
  "uploadData",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      // Send POST request (no need for responseType: 'stream')
      const response = await axios.post(
        `${Server_url}/user/upload-file`,
        { data },
        {
          headers: { Authorization: `Bearer ${token}` },
          onDownloadProgress: (progressEvent) => {
            const rawResponse = progressEvent.event.currentTarget.response;

            if (rawResponse) {
              // We assume that the response may contain multiple objects.
              const regex = /(\{[^{}]*\})/g;

              // Parse all the objects from the raw response
              const matches = rawResponse.match(regex);

              // If there are matched objects, parse the latest one and extract progress
              if (matches && matches.length > 0) {
                const lastObject = JSON.parse(matches[matches.length - 1]);

                // Check if 'progress' exists in the current object
                if (lastObject && lastObject.hasOwnProperty("progress")) {
                  const progress = lastObject.progress;
                  // Dispatch progress to your Redux store
                  dispatch(setProgress(progress));
                }

                // Log the latest object
                // console.log("Last Object Data : ", lastObject);
              }
            }
          },
        }
      );

      const responseData = response.data;

      if (responseData) {
        const regex = /(\{[^{}]*\})/g;

        let loaded = JSON.parse(
          responseData.match(regex)[responseData.match(regex).length - 1]
        ).progress;

        if (loaded) {
          dispatch(setProgress(loaded));
        }

        console.log(
          "End Response Data : ",
          JSON.parse(
            responseData.match(regex)[responseData.match(regex).length - 1]
          )
        );

        if (responseData.progress) {
          dispatch(setProgress(responseData.progress));
        }

        if (responseData.message) {
          // Show the message using toast
          toast.info(responseData.message);
        }

        if (responseData.skippedRecords !== undefined) {
          // Track skipped records
          dispatch(setSkippedRecords(responseData.skippedRecords));
        }
      }

      return responseData;
    } catch (err) {
      console.error("Error uploading file:", err);

      let errorMessage = "Something went wrong";
      if (err.response && err.response.data) {
        errorMessage = err.response.data.error || "Error uploading file";
      }

      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const uploadDataSlice = createSlice({
  name: "dataUpload",
  initialState: {
    progress: 0,
    responseMessage: "",
    isLoading: false,
    uploadedDataCount: 0,
    skippedRecords: 0,
  },
  reducers: {
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    setResponseMessage: (state, action) => {
      state.responseMessage = action.payload;
    },
    setUploadedDataCount: (state, action) => {
      state.uploadedDataCount = action.payload;
    },
    setSkippedRecords: (state, action) => {
      state.skippedRecords = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadExcelData.pending, (state) => {
        state.isLoading = true;
        state.progress = 0;
      })
      .addCase(uploadExcelData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.progress = 100;
        state.responseMessage = action.payload.message || "Upload successful!";
      })
      .addCase(uploadExcelData.rejected, (state, action) => {
        state.isLoading = false;
        state.progress = 0;
        state.responseMessage = action.payload || "Upload failed!";
        toast.error(action.payload || "Something went wrong");
      });
  },
});

export const {
  setProgress,
  setResponseMessage,
  setUploadedDataCount,
  setSkippedRecords,
} = uploadDataSlice.actions;

export default uploadDataSlice.reducer;
