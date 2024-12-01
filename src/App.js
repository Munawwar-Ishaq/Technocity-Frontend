import Login from "./Pages/Login";
import { Route, Routes } from "react-router-dom";
import MainPage from "./Pages/MainPage";
import AllUsers from "./Pages/AllUsers";
import AddUsers from "./Pages/AddUsers";
import UploadFiles from "./Pages/UploadFiles";
import AuthRoute from "./Routes/AuthRoute";
import ProtectRoute from "./Routes/ProtectRoutes";
import LoadingPage from "./Pages/LoadingPage";
import Profile from "./Pages/Profile";
import EditUser from "./Pages/EditUser";
import UserDetail from "./Pages/UserDetail";
import ConvertToPDF from "./Pages/ConvertToPDF";
import UpdateForm from "./Pages/UpdateForm";
import DeactiveUsers from "./Pages/DeactiveUsers";

function App() {
  return (
    <div className="w-full h-screen">
      <Routes>
        <Route path="/" element={<LoadingPage />} />
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectRoute>
              <MainPage />
            </ProtectRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectRoute>
              <Profile />
            </ProtectRoute>
          }
        />
        <Route
          path="/update-form"
          element={
            <ProtectRoute>
              <UpdateForm />
            </ProtectRoute>
          }
        />
        <Route
          path="/add-user"
          element={
            <ProtectRoute>
              <AddUsers />
            </ProtectRoute>
          }
        />
        <Route
          path="/all-users"
          element={
            <ProtectRoute>
              <AllUsers />
            </ProtectRoute>
          }
        />
        <Route
          path="/user/:userId/edit"
          element={
            <ProtectRoute>
              <EditUser />
            </ProtectRoute>
          }
        />
        <Route
          path="/deactive-users"
          element={
            <ProtectRoute>
              <DeactiveUsers />
            </ProtectRoute>
          }
        />
        <Route
          path="/user/:userId/view"
          element={
            <ProtectRoute>
              <UserDetail />
            </ProtectRoute>
          }
        />
        <Route
          path="/upload-files"
          element={
            <ProtectRoute>
              <UploadFiles />
            </ProtectRoute>
          }
        />
        <Route
          path="/convert-to-pdf"
          element={
            <ProtectRoute>
              <ConvertToPDF />
            </ProtectRoute>
          }
        />
        <Route path="*" element={<h2>No Page Found</h2>} />
      </Routes>
    </div>
  );
}

export default App;
