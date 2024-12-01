import { configureStore } from "@reduxjs/toolkit";
import auth from "./Reducers/auth";
import search from "./Reducers/search";
import formData from "./Reducers/formData";
import users from "./Reducers/users";
import uploadFile from "./Reducers/uploadfile";

export const store = configureStore({
  reducer: {
    auth: auth,
    search: search,
    formData: formData,
    users: users,
    uploadFile: uploadFile,
  },
});
