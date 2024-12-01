import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import GlobalDashboardPage from "../components/GlobalDashboardPage";
import Header from "../components/Header";
import { motion } from "framer-motion";
import { FixedSizeList as List } from "react-window";
import {
  deleteUserApi,
  getDeativeUserApi,
  setEditUser,
} from "../store/Reducers/users";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDate } from "../helper/helper";

const DeactiveUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    allDeactiveUsers,
    isDeativeLoading,
    totalDeativePages,
    currentDeatcivePage,
  } = useSelector((state) => state.users);
  const [, setSideBarShow] = useState(true);

  useEffect(() => {
    if (!allDeactiveUsers) {
      dispatch(getDeativeUserApi({ limit: 20, page: currentDeatcivePage }));
    }
  }, [allDeactiveUsers, dispatch, currentDeatcivePage]);

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
      visibleStopIndex === allDeactiveUsers.length - 1 &&
      !isDeativeLoading &&
      totalDeativePages > currentDeatcivePage
    ) {
      dispatch(getDeativeUserApi({ limit: 20, page: currentDeatcivePage + 1 }));
    }
  };

  const renderRow = ({ index, style }) => {
    const user = allDeactiveUsers[index];
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
            title={user.totalAmount}
          >
            PKR. {truncateText(user.totalAmount)}
          </div>
          <div
            className={`px-3 h-full flex-1 ${
              !user.active && "border-red-300"
            } truncate align-middle cursor-pointer text-center flex items-center justify-center`}
            title={user.amountPaid}
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
    <GlobalDashboardPage
      targetTab={"deactive-users"}
      setSideBarShow={setSideBarShow}
    >
      <Header title={"Deactive Users"} />
      <div className="px-6 pt-2 hide-scroll relative">
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
                Actions
              </div>
            </div>

            <div className="text-xs md:text-sm">
              {allDeactiveUsers ? (
                allDeactiveUsers.length > 0 ? (
                  <List
                    height={window.innerHeight - 160}
                    itemCount={allDeactiveUsers.length}
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
              {isDeativeLoading && (
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

export default DeactiveUsers;
