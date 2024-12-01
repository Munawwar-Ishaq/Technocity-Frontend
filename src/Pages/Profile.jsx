import React from "react";
import GlobalDashboardPage from "../components/GlobalDashboardPage";
import ContentHeader from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { formatDate, formatDateMonthFull } from "../helper/helper";
import { setUpdateField } from "../store/Reducers/auth";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const description =
    "Techno City Network Billing helps you to manage your network resources effectively with ease and efficiency. We provide accurate billing systems for smooth and hassle-free operations.";

  return (
    <GlobalDashboardPage >
      <ContentHeader title={"Profile"} />
      <div className="min-h-screen py-10 px-5">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-6">
            <img
              src={user && user.profilePicture}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full border-[1px] border-[#e8e8e8]"
            />
            <div>
              <h1 className="text-3xl font-semibold text-gray-800">
                {user && user.name}
              </h1>
              <p className="text-xl text-gray-500"> {user && user.role}</p>
              <p className="text-sm text-gray-400">
                Account Created: {user && formatDate(user.createdAt)}
              </p>
              <p className="text-sm text-gray-400">
                Last Updated: {user && formatDate(user.updatedAt)}
              </p>
            </div>
          </div>

          {/* Profile Description */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-700">About</h2>
            <p className="mt-2 text-gray-600 text-base">{description}</p>
          </div>

          {/* Account Information */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-700">
              Account Information
            </h2>
            <div className="mt-4 space-y-4">
              <div className="flex justify-between">
                <p className="font-semibold text-gray-600">Username:</p>
                <p className="text-gray-500">{user && user.name}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold text-gray-600">Role:</p>
                <p className="text-gray-500">{user && user.role}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold text-gray-600">Account Created:</p>
                <p className="text-gray-500">
                  {user && formatDateMonthFull(user.createdAt)}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold text-gray-600">Last Updated:</p>
                <p className="text-gray-500">
                  {user && formatDateMonthFull(user.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Profile Options */}
          <div className="mt-6 flex justify-center">
            <button
              className="px-6 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition duration-200"
              onClick={() => {
                dispatch(setUpdateField("username"));
              }}
            >
              Change User Name
            </button>
          </div>
        </div>
      </div>
    </GlobalDashboardPage>
  );
};

export default Profile;
