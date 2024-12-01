import React, { useEffect, useState } from "react";
import GlobalDashboardPage from "../components/GlobalDashboardPage";
import Header from "../components/Header";
import { motion } from "framer-motion";
import { FixedSizeList as List } from "react-window";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faFilter,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserApi,
  getUserApi,
  setEditUser,
  setSelectedUserAmountUpdate,
} from "../store/Reducers/users";
import {  formatDate } from "../helper/helper";
import FilterContainer from "../components/FilterContainer";

const AllUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allUsers, isLoading, totalPages, currentPage } = useSelector(
    (state) => state.users
  );
  const [sideBarShow, setSideBarShow] = useState(true);
  const [initHeight, setInitHeight] = useState(209);
  const [showNoMore, setShowNoMore] = useState(false);
  const [ShowFilter, setShowFilter] = useState(false);

  useEffect(() => {
    if (!allUsers) {
      dispatch(getUserApi({ limit: 20, page: currentPage }));
    }
  }, [allUsers, dispatch , currentPage]);

  const handleDelete = (id) => {
    dispatch(deleteUserApi(id));
  };

  const handleEdit = (id) => {
    dispatch(setEditUser(null));
    navigate(`/user/${id}/edit`);
  };

  const truncateText = (text, length = 7) => {
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  const loadMoreUsers = ({ visibleStopIndex }) => {
    if (
      visibleStopIndex === allUsers.length - 1 &&
      !isLoading &&
      totalPages > currentPage
    ) {
      dispatch(getUserApi({ limit: 20, page: currentPage + 1 }));
    }

    if (
      visibleStopIndex === allUsers.length - 1 &&
      !isLoading &&
      totalPages === currentPage
    ) {
      setShowNoMore(true);
    } else {
      setShowNoMore(false);
    }
  };

  useEffect(() => {
    if (isLoading) {
      setInitHeight(244);
    } else {
      setInitHeight(209);
    }
  }, [isLoading]);

  // Render the Row for each user
  const renderRow = ({ index, style }) => {
    const user = allUsers[index];
    return (
      <div
        key={user.userId}
        style={{
          ...style,
        }}
      >
        <div
          className={`flex border mb-2 rounded-full transition-all ${
            !user.active && "border-red-300 bg-red-100"
          }  text-[#565656]  bg-white h-[40px] hover:bg-gray-200`}
        >
          <div
            className="px-3 h-full flex-1 flex items-center truncate justify-center"
            title={user.userId}
          >
            {truncateText(user.userId)}
          </div>
          <div
            className={`px-3 h-full flex-1 align-middle ${
              !user.active && "border-red-300"
            } truncate max-w-[150px] cursor-pointer hover:text-[gray] flex items-center justify-center`}
            onClick={() => navigate(`/user/${user.userId}/view`)}
            title={user.username}
          >
            {truncateText(user.username, 11)}
          </div>
          <div
            className={`px-3 h-full flex-1 ${
              !user.active && "border-red-300"
            } truncate align-middle text-center flex items-center justify-center`}
            title={formatDate(user.createdAt)}
          >
            {formatDate(user.createdAt)}
          </div>
          <div
            className={`px-3 h-full flex-1 ${
              !user.active && "border-red-300"
            } truncate align-middle text-center flex items-center justify-center`}
            title={user.package}
          >
            {truncateText(user.package)}
          </div>
          <div
            className={`px-3 h-full flex-1 ${
              !user.active && "border-red-300"
            } truncate align-middle text-center flex items-center justify-center`}
            title={user.totalAmount}
          >
            PKR. {truncateText(user.totalAmount)}
          </div>
          <div
            className={`px-3 h-full flex-1 ${
              !user.active && "border-red-300"
            } truncate align-middle cursor-pointer text-center hover:text-gray-400 flex items-center justify-center`}
            title={user.amountPaid}
            onClick={() => {
              dispatch(
                setSelectedUserAmountUpdate({
                  userId: user.userId,
                  username: user.username,
                  amount: user.amountPaid,
                })
              );
            }}
          >
            PKR. {Number(user.amountPaid)}
          </div>
          <div
            className={`px-3 h-full flex-1 ${
              !user.active && "border-red-300"
            } truncate align-middle text-center flex items-center justify-center`}
            title={user.balancedAmount}
          >
            {user.balancedAmount === 0 ? (
              <div className="bg-yellow-300 text-white px-2 py-1 rounded">
                Completed
              </div>
            ) : (
              `PKR. ${user.balancedAmount}`
            )}
          </div>
          <div
            className={`px-3 h-full flex-1 ${
              !user.active && "border-red-300"
            } truncate align-middle text-center flex items-center justify-center`}
            title={user.lastMonthDue}
          >
            {user.lastMonthDue ? "PKR. " + Number(user.lastMonthDue) : "-"}
          </div>
          <div
            className={`px-3 h-[40px] flex-1 ${
              !user.active && "border-red-300"
            } flex items-center gap-2 justify-center`}
          >
            <button
              onClick={() => handleEdit(user.userId)}
              className="text-blue-500 hover:text-blue-700"
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
              onClick={() => handleDelete(user.userId)}
              className="text-red-500 hover:text-red-700"
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <GlobalDashboardPage targetTab={"allUser"} setSideBarShow={setSideBarShow}>
      <Header title={"All Users"} />
      <div className="px-6 pt-2 hide-scroll relative">
        {ShowFilter && (
          <FilterContainer
            sideBarShow={sideBarShow}
            setShowFilter={setShowFilter}
          />
        )}
        <div
          className="ml-auto mb-2 cursor-pointer rounded w-fit border border-[#eee] bg-white h-[35px] px-5 flex items-center justify-center text-gray-800 gap-3"
          onClick={() => setShowFilter(true)}
        >
          Filter Option
          <FontAwesomeIcon icon={faFilter} />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="min-w-full overflow-hidden">
            <div
              className={`bg-[#cecdcd] w-full mb-1 text-[#070707] transition-all rounded-full text-[12px] xl:text-sm h-[40px] flex`}
            >
              <div className="px-1 py-1 flex-1 text-center flex items-center justify-center truncate">
                User ID
              </div>
              <div className="px-1 truncate py-1 flex-1 text-center flex items-center justify-center">
                User Name
              </div>
              <div className="px-1 py-1 flex-1 text-center flex items-center justify-center truncate">
                Date
              </div>
              <div className="px-1 py-1 flex-1 text-center flex items-center justify-center truncate">
                Package
              </div>
              <div className="px-1 py-1 truncate flex-1 text-center flex items-center justify-center">
                Total Amount
              </div>
              <div className="px-1 py-1 flex-1 truncate text-center flex items-center justify-center">
                Amount Paid
              </div>
              <div className="px-1 py-1 flex-1 truncate text-center flex items-center justify-center">
                Balance
              </div>
              <div className="px-1 py-1 flex-1 truncate text-center flex items-center justify-center">
                Last Month Due
              </div>
              <div className="px-1 py-1 flex-1 truncate text-center flex items-center justify-center">
                Actions
              </div>
            </div>

            <div className="text-xs md:text-sm">
              {allUsers ? (
                allUsers.length > 0 ? (
                  <List
                    height={window.innerHeight - initHeight}
                    itemCount={allUsers.length}
                    itemSize={45}
                    width="100%"
                    className="hide-scroll overflow-y-auto"
                    onItemsRendered={loadMoreUsers}
                  >
                    {renderRow}
                  </List>
                ) : (
                  <div className="h-[100px] w-full text-center flex items-center justify-center">
                    No User Data Found, please add User to display here
                  </div>
                )
              ) : (
                <div className="h-[100px] w-full text-center flex items-center justify-center">
                  Loading Data...
                </div>
              )}

              {showNoMore && (
                <div className="flex gap-3 justify-center h-[35px] items-center">
                  No more User found
                </div>
              )}
              {isLoading && (
                <div className="flex gap-3 justify-center h-[35px] items-center">
                  <div className="loader1-spin"></div>
                  <div>Loading More Users please wait....</div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </GlobalDashboardPage>
  );
};

export default AllUsers;
