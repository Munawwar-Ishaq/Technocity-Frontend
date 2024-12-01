import {
  faAngleDown,
  faBars,
  faCamera,
  faCheck,
  faSearch,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchText, setShowSearchResult } from "../store/Reducers/search";
import SearchUser from "../Pages/SearchUser";
import { logout, setUpdateField, updateAdminApi } from "../store/Reducers/auth";
import { ammountPaidUpdate, Remove_Token } from "../helper/helper";
import { toast } from "react-toastify";
import {
  editUserApi,
  setSelectedUserAmountUpdate,
} from "../store/Reducers/users";

const GlobalDashboardPage = ({
  children,
  targetTab,
  setScrollHeight,
  setSideBarShow,
  setTotalScrollHeight,
}) => {
  const { user, updatefield, loading } = useSelector((state) => state.auth);
  const { selectedUserAmmountUpdate, allUsers } = useSelector(
    (state) => state.users
  );
  // State for tracking active tab and sidebar collapse state
  const [activeTab, setActivTab] = useState(targetTab || null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [lastPassword, setLastPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(
    (user && user.profilePicture) || ""
  );
  const [newUsername, setNewUsername] = useState((user && user.name) || "");
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { searchText, showSearchResult } = useSelector((state) => state.search);
  const dispatch = useDispatch();
  const inputFileRef = useRef();

  // Hook to navigate between pages
  const navigate = useNavigate();

  const mainRef = useRef(null);

  // Window Click Handle
  useEffect(() => {
    const windowClick = () => {
      setProfileDropdown(false);
    };

    window.addEventListener("click", windowClick);

    return () => {
      window.removeEventListener("click", windowClick);
    };
  }, []);

  useEffect(() => {
    if (setTotalScrollHeight) {
      setTotalScrollHeight(Math.floor(mainRef.current.scrollHeight));
    }
  }, [setTotalScrollHeight]);

  const handleUpdate = () => {
    if (updatefield && updatefield === "username") {
      if (!newUsername) {
        return toast.error("Please enter a username");
      }

      if (newUsername.length < 3 || newUsername.length > 30) {
        return toast.error("Username must be between 3 and 30 characters");
      }

      dispatch(
        updateAdminApi({
          username: newUsername.trim(),
        })
      );
    } else if (updatefield === "password") {
      if (!lastPassword) {
        return toast.error("Please enter last password");
      }

      if (!newPassword) {
        return toast.error("Please enter new password");
      }

      if (newPassword.length < 8 || newPassword.length > 30) {
        return toast.error("Password must be between 8 and 30 characters");
      }

      if (newPassword === lastPassword) {
        return toast.error("Please enter a different new passwords ");
      }

      dispatch(
        updateAdminApi({
          lastPassword: lastPassword,
          password: newPassword,
        })
      );
    }
  };

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          const imageUrl = reader.result;
          dispatch(
            updateAdminApi({
              profilePicture: imageUrl,
            })
          );
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Please select an image file.");
      }
    }
  }

  const handleUpdateAppmontPaid = () => {
    let lastData = allUsers.find(
      (item) => item.userId === selectedUserAmmountUpdate.userId
    );

    console.log("Find An item  ", lastData);

    if (lastData.amountPaid === selectedUserAmmountUpdate.amount) {
      alert("Please Change ammount paid Value");
    } else {
      let statements = ammountPaidUpdate(lastData, {
        amountPaid: selectedUserAmmountUpdate.amount,
      });

      dispatch(
        editUserApi({
          data: {
            userId: selectedUserAmmountUpdate.userId,
            amountPaid: selectedUserAmmountUpdate.amount,
          },
          editedStatement: statements,
        })
      );
    }
  };

  useEffect(() => {
    if (!loading) {
      setLastPassword("");
      setNewPassword("");
      setProfilePicture(user && user.profilePicture);
      setNewUsername(user && user.name);
    }
  }, [loading, user]);

  return (
    <div className="w-full h-screen flex overflow-hidden bg-[#f4f6f9]">
      {/* Update Container  */}
      {selectedUserAmmountUpdate.userId !== null && (
        <div
          className={`fixed top-0 flex items-center justify-center bg-[#0000008f] z-50 left-0 w-full h-full ${
            selectedUserAmmountUpdate.userId
              ? "visible opacity-1"
              : "invisible opacity-0"
          } transition-all delay-150`}
          onClick={(e) => {
            if (e.currentTarget === e.target) {
              dispatch(
                setSelectedUserAmountUpdate({
                  userId: null,
                  username: null,
                  amount: null,
                })
              );
            }
          }}
        >
          <div className="bg-white max-w-[400px] px-5 py-2 rounded-md flex flex-col items-center ">
            <h2 className="text-xl font-bold text-center mb-5 pt-5 ">
              {selectedUserAmmountUpdate.username} - Amount Update
            </h2>
            <div className="flex gap-3 flex-wrap items-center mb-5 w-full justify-between">
              <input
                type="text"
                className="border border-gray-400 rounded outline-none px-2 py-1 w-[180px]"
                value={selectedUserAmmountUpdate.amount || ""}
                onChange={(e) => {
                  dispatch(
                    setSelectedUserAmountUpdate({
                      amount: e.target.value,
                    })
                  );
                }}
              />
              <div className="px-2 py-1 bg-yellow-400 text-white rounded">
                Compelete
              </div>
            </div>
            <div
              className="px-3 py-1 rounded bg-gray-500 text-white cursor-pointer hover:bg-gray-400 transition-all w-fit mx-auto"
              onClick={handleUpdateAppmontPaid}
            >
              Update Ammount
            </div>
          </div>
        </div>
      )}
      <div
        className={`fixed  ${
          updatefield ? "visible opacity-100" : "invisible opacity-0"
        } transition-all ${
          updatefield ? "duration-100" : "duration-700"
        } bg-[#0000009c] w-full z-[99] flex justify-center h-screen top-0 left-0 p-5`}
        onClick={(e) => {
          if (!loading) {
            dispatch(setUpdateField(null));
          }
        }}
      >
        <div
          className={`bg-white py-3 ${
            updatefield
              ? "opacity-100 translate-y-0"
              : "opacity-0  -translate-y-5"
          }  shadow-lg h-fit transition-all ${
            updatefield ? "duration-0" : "duration-100"
          }  rounded-lg max-w-[80%] w-[400px] flex flex-col items-center`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <h2 className="text-xl font-semibold border-b mb-3 w-full pb-2 text-center border-b-[#37373734] text-[#373737]">
            {updatefield && updatefield === "password" && "Update Password"}
            {updatefield && updatefield === "username" && "Update Username"}
            {updatefield &&
              updatefield === "profilePicture" &&
              "Update Profile Picture"}
          </h2>
          {updatefield && updatefield === "password" ? (
            <>
              <input
                type={showPass ? "text" : "password"}
                className="w-full px-3 py-2 mb-3 rounded-md border border-gray-300 focus:outline-none focus:border-gray-400 max-w-[300px]"
                placeholder="Enter last password"
                value={lastPassword}
                onChange={(e) => setLastPassword(e.target.value)}
              />
              <input
                type={showPass ? "text" : "password"}
                className="w-full px-3 py-2 mb-3 rounded-md border border-gray-300 focus:outline-none focus:border-gray-400 max-w-[300px]"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {/* Show Password */}
              <div className="flex select-none items-center gap-2 w-full max-w-[300px]">
                <div
                  className="w-[17px] h-[17px] border border-gray-300 cursor-pointer rounded-sm"
                  onClick={() => setShowPass((prev) => !prev)}
                >
                  <div
                    className={`w-full h-full flex items-center justify-center ${
                      showPass ? "scale-100" : "scale-0"
                    } transition-all  text-[10px]  text-[#959595]`}
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                </div>
                <div className="text-[#828282] font-light">Show Password</div>
              </div>
              {/* Show password End */}
            </>
          ) : updatefield && updatefield === "username" ? (
            <>
              <input
                type={"text"}
                className="w-full px-3 py-2 mb-3 rounded-md border border-gray-300 focus:outline-none focus:border-gray-400 max-w-[300px]"
                placeholder="Enter new Username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </>
          ) : updatefield && updatefield === "profilePicture" ? (
            <>
              <div className="w-[120px] h-[120px] overflow-hidden group relative cursor-pointer rounded-full border border-[#e4e3e3] shadow-md">
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                  ref={inputFileRef}
                />
                {loading ? (
                  <div
                    className={`w-full transition-all rounded-full z-[99] bg-[#000000cc] h-full flex items-center text-[#eee] absolute top-0 left-0 text-xl justify-center`}
                  >
                    <div className="loader1-spin"></div>
                  </div>
                ) : (
                  <div
                    className={`w-full group-hover:opacity-100 transition-all opacity-0 rounded-full bg-[#000000b2] h-full flex items-center text-[#eee] absolute top-0 left-0 text-xl justify-center`}
                    onClick={() => {
                      inputFileRef.current.click();
                    }}
                  >
                    <FontAwesomeIcon icon={faCamera} />
                  </div>
                )}

                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </>
          ) : null}

          {(updatefield && updatefield === "password") ||
          (updatefield && updatefield === "username") ? (
            <button
              className={`bg-gray-500 active:shadow-none transition-all text-white px-4 py-2 text-sm font-semibold flex items-center rounded shadow-md ${
                loading ? "cursor-not-allowed" : ""
              }`}
              disabled={loading}
              onClick={handleUpdate}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          ) : null}
        </div>
      </div>{" "}
      {/* Main Background - Light white */}
      {/* ===================== Sidebar Start ===================== */}
      <div
        className={`${
          sidebarCollapsed ? "w-[280px]" : "w-[0px]"
        } border-r-[#dfe2e6] h-full overflow-x-hidden transition-all bg-[#ffffff]`}
      >
        {/* Logo and Sidebar Heading */}
        <div className="text-ellipsis whitespace-nowrap w-full h-[100px] flex items-center text-lg font-bold tracking-wide text-[#333333] px-5">
          <img
            src={require("../assets/tcnepng.png")}
            alt="DB-Logo"
            className="w-[90%] mr-2 mt-3"
          />
        </div>

        {/* Sidebar Menu */}
        <div className="w-full relative select-none text-ellipsis whitespace-nowrap h-[calc(100%-100px)] list-none text-[#333333] font-light tracking-wide py-10">
          {/* Dashboard Link */}
          <li
            className={`py-[8px] mb-3 cursor-pointer transition-all ${
              activeTab === "dashboard"
                ? "border-l-[4px] px-[20px] border-l-[#4c6ef5] font-semibold text-[#4c6ef5]"
                : "px-6 hover:bg-[#f0f0f0] hover:text-[#333333]"
            }`}
            onClick={() => {
              setActivTab("dashboard");
              navigate("/dashboard");
              dispatch(setSearchText(""));
            }}
          >
            Dashboard
          </li>

          {/* All Users Link */}
          <li
            className={`py-[8px] mb-3 cursor-pointer transition-all ${
              activeTab === "allUser"
                ? "border-l-[4px] px-[20px] border-l-[#4c6ef5] font-semibold text-[#4c6ef5]"
                : "px-6 hover:bg-[#f0f0f0] hover:text-[#333333]"
            }`}
            onClick={() => {
              setActivTab("allUser");
              navigate("/all-users");
              dispatch(setSearchText(""));
            }}
          >
            All Users
          </li>

          {/* Add User Link */}
          <li
            className={`py-[8px] mb-3 cursor-pointer transition-all ${
              activeTab === "addUser"
                ? "border-l-[4px] px-[20px] border-l-[#4c6ef5] font-semibold text-[#4c6ef5]"
                : "px-6 hover:bg-[#f0f0f0] hover:text-[#333333]"
            }`}
            onClick={() => {
              setActivTab("addUser");
              navigate("/add-user");
              dispatch(setSearchText(""));
            }}
          >
            Add User
          </li>

          {/*  AREa Link */}
          <li
            className={`py-[8px] mb-3 cursor-pointer transition-all ${
              activeTab === "update-form"
                ? "border-l-[4px] px-[20px] border-l-[#4c6ef5] font-semibold text-[#4c6ef5]"
                : "px-6 hover:bg-[#f0f0f0] hover:text-[#333333]"
            }`}
            onClick={() => {
              setActivTab("update-form");
              navigate("/update-form");
              dispatch(setSearchText(""));
            }}
          >
            Update Form
          </li>

          {/* Upload file Link */}
          <li
            className={`py-[8px] mb-3 cursor-pointer transition-all ${
              activeTab === "upload-files"
                ? "border-l-[4px] px-[20px] border-l-[#4c6ef5] font-semibold text-[#4c6ef5]"
                : "px-6 hover:bg-[#f0f0f0] hover:text-[#333333]"
            }`}
            onClick={() => {
              setActivTab("upload-files");
              navigate("/upload-files");
              dispatch(setSearchText(""));
            }}
          >
            Upload Files
          </li>
          {/* Deactive Users Link */}
          <li
            className={`py-[8px] mb-3 cursor-pointer transition-all ${
              activeTab === "deactive-users"
                ? "border-l-[4px] px-[20px] border-l-[#4c6ef5] font-semibold text-[#4c6ef5]"
                : "px-6 hover:bg-[#f0f0f0] hover:text-[#333333]"
            }`}
            onClick={() => {
              setActivTab("deactive-users");
              navigate("/deactive-users");
              dispatch(setSearchText(""));
            }}
          >
            Deactive Users
          </li>

          {/* Logout Button */}
          <div
            className="absolute bottom-5 ml-5 bg-[#eb6354] text-[#e5e5e5] select-none cursor-pointer font-semibold rounded px-3 py-1 hover:bg-[#c0392b] transition-colors"
            onClick={() => {
              Remove_Token();
              dispatch(logout());
              navigate("/login");
            }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-1" /> Logout
          </div>
        </div>
      </div>
      {/* ===================== Sidebar End ===================== */}
      {/* Main Content Area */}
      <div
        className={`${
          sidebarCollapsed ? "w-[calc(100%-280px)]" : "w-full"
        } h-screen transition-all`}
      >
        {/* ===================== Header Start ===================== */}
        <div className="w-full h-[60px] relative px-4 flex justify-between items-center bg-[#ffffff] ">
          {" "}
          {/* Header - Light White */}
          {/* Sidebar Toggle Button */}
          <div
            className="w-[35px] flex items-center justify-center py-[6px] text-xl text-[#333333] cursor-pointer hover:bg-[#f0f0f0] h-fit rounded"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarCollapsed(!sidebarCollapsed);
              if (setSideBarShow) {
                setSideBarShow(!sidebarCollapsed);
              }
            }}
          >
            <FontAwesomeIcon icon={sidebarCollapsed ? faBars : faBars} />
          </div>
          {/* Search Bar */}
          <div
            className="cursor-pointer flex bg-[#f4f8fc] hover:bg-[#e1effb] border h-[36px] border-[#4c6ef5] rounded-full text-[#333333] max-w-[80%] w-[400px]"
            onClick={() => {
              if (searchText) {
                dispatch(setShowSearchResult(true));
              } else {
                dispatch(setShowSearchResult(false));
              }
            }}
          >
            <input
              type="text"
              className="text-sm outline-none placeholder:text-[#4c6ef5] bg-transparent w-[calc(100%-45px)] h-full px-4 py-2"
              value={searchText}
              placeholder="Search User here.."
              onChange={(e) => {
                dispatch(setSearchText(e.target.value));
              }}
            />
            <div className="w-[45px] border-l border-l-[#a4c9f5] text-[#4c6ef5] flex items-center justify-center h-full">
              <FontAwesomeIcon icon={faSearch} />
            </div>
          </div>
          {/* Profile Icon and Dropdown */}
          <div
            className="hover:bg-[#f0f0f0] select-none rounded px-2 py-1 flex items-center justify-center gap-1 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setProfileDropdown(!profileDropdown);
            }}
          >
            <img
              src={`${user && user.profilePicture}`}
              className="w-[40px] h-[40px] object-cover overflow-hidden rounded-full border border-[#7aedf5]"
              alt="MY_IMAGE"
            />
            <FontAwesomeIcon icon={faAngleDown} className="text-[#333333]" />
          </div>
          <div
            className={`min-w-[200px] z-50 transition-all p-[10px] bg-[#f5f5f5] rounded-md ${
              profileDropdown
                ? "opacity-100 translate-y-0 visible"
                : "opacity-0 invisible -translate-y-3"
            } absolute right-[10px] top-[100%] mt-1 shadow-md`}
          >
            <div className="w-full items-center flex gap-3 border-b border-b-[#ccc] pb-3 ">
              <img
                src={`${user && user.profilePicture}`}
                alt="Admin-Image"
                className="w-[50px] h-[50px] object-cover overflow-hidden rounded-full border border-[#7aedf5]"
              />
              <div>
                <div className="text-lg font-semibold text-[#333333]">
                  {user && user.name}
                </div>
                <div className="text-sm text-[#82a5a7]">
                  Role : {user && user.role}
                </div>
              </div>
            </div>
            <div className="w-full list-none py-1">
              <li
                className="w-full cursor-pointer text-[#696969] py-1 px-2 rounded hover:bg-[#8080801d] hover:text-[#464646] font-semibold"
                onClick={() => navigate("/profile")}
              >
                Profile
              </li>
              <li
                className="w-full cursor-pointer text-[#696969] py-1 px-2 rounded hover:bg-[#8080801d] hover:text-[#464646] font-semibold"
                onClick={() => {
                  dispatch(setUpdateField("profilePicture"));
                }}
              >
                Update Profile Picture
              </li>
              <li
                className="w-full cursor-pointer text-[#696969] py-1 px-2 rounded hover:bg-[#8080801d] hover:text-[#464646] font-semibold"
                onClick={() => {
                  dispatch(setUpdateField("password"));
                }}
              >
                Change Password
              </li>
              <li
                className="w-full cursor-pointer text-[#696969] py-1 px-2 rounded hover:bg-[#8080801d] hover:text-[#464646] font-semibold"
                onClick={() => {
                  Remove_Token();
                  dispatch(logout());
                  navigate("/login");
                }}
              >
                Logout
              </li>
            </div>
          </div>
        </div>
        {/* ===================== Header End ===================== */}

        {/* ===================== Content Area Start ===================== */}
        <div
          className="w-full hide-scroll border border-[#dfe2e6] h-[calc(100%-60px)] overflow-y-scroll overflow-x-hidden bg-[#e9f7fe]"
          id="main-view-container"
          onScroll={(e) => {
            if (setScrollHeight) {
              setScrollHeight(Math.floor(e.target.scrollTop));
            }
            if (setTotalScrollHeight) {
              setTotalScrollHeight(Math.floor(e.target.scrollHeight));
            }
          }}
          ref={mainRef}
        >
          {/* Content Area - Light Blue */}

          {showSearchResult ? <SearchUser /> : children}
        </div>
        {/* ===================== Content Area End ===================== */}
      </div>
    </div>
  );
};

export default GlobalDashboardPage;
