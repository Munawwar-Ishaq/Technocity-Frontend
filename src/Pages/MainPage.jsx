import React, { useEffect, useState } from "react";
import GlobalDashboardPage from "../components/GlobalDashboardPage";
import Header from "../components/Header";
import { motion } from "framer-motion"; // Import Framer Motion
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons"; // Import Plus icon
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { dashboardData } from "../store/Reducers/users";
import { formatDate } from "../helper/helper";
import Footer from "../components/Footer";

function MainPage() {
  const {
    usersCount,
    newUserCounts,
    recentUsers,
    paymentReport,
    deActiveUsers,
  } = useSelector((state) => state.users);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [recentUsersWidth, setRecentUsersWidth] = useState(0);
  const [viewAll, setViewAll] = useState(false);

  // Effect to update recentUsersWidth based on the container's width
  useEffect(() => {
    const handleResize = () => {
      const width =
        document.getElementById("recent-users-container")?.offsetWidth || 0;
      setRecentUsersWidth(width);
    };

    // Initial check for width when component mounts
    handleResize();

    // Event listener to handle window resize
    window.addEventListener("resize", handleResize);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!usersCount) {
      console.log(
        "User Count Api Don't Call This Time Need To Call UserCountApi ======> Dispatch "
      );
      dispatch(dashboardData());
    }
  }, [usersCount, dispatch]);

  // Function to truncate ID if it's too long
  const truncateText = (text) => {
    return text.length > 10 ? text.substring(0, 10) + "..." : text;
  };

  return (
    <div className="w-full h-screen">
      <GlobalDashboardPage targetTab={"dashboard"}>
        <Header title={"Dashboard"} />
        <div className="w-full h-full p-6 flex flex-col gap-6">
          {/* Dashboard Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 max-xl::grid-cols-4 gap-6 pt-5">
            {/* New Users Box */}
            <motion.div
              className="flex cursor-pointer items-center justify-between p-6 bg-white rounded-xl shadow-lg hover:scale-105 transition-all min-w-[300px] h-[130px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => {
                navigate("/add-user");
              }}
            >
              <div className="flex items-center gap-6">
                <img
                  src="https://cdn-icons-png.freepik.com/512/72/72846.png"
                  alt="New Users"
                  className="w-16 h-16"
                />
                <div>
                  <h4 className=" text-2xl  text-[#757575]">New Users</h4>
                  <p className="text-xl font-semibold text-[#95969a]">
                    {newUserCounts !== null ? newUserCounts : "-"}
                  </p>{" "}
                  {/* Dynamic count */}
                </div>
              </div>
              <div className="flex justify-center items-center w-12 h-12 bg-[#96979a] rounded-full">
                <FontAwesomeIcon
                  icon={faPlus}
                  className="text-white text-2xl"
                />
              </div>
            </motion.div>

            {/* All Users Box */}
            <motion.div
              className="flex items-center justify-between p-6 bg-white rounded-xl shadow-lg hover:scale-105 transition-all min-w-[300px] h-[130px] cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => {
                navigate("/all-users");
              }}
            >
              <div className="flex items-center gap-6">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/33/33308.png"
                  alt="All Users"
                  className="w-16 h-16"
                />
                <div>
                  <h4 className=" text-2xl  text-[#757575]">All Users</h4>
                  <p className="text-xl font-semibold text-[#95969a]">
                    {usersCount !== null ? usersCount : "-"}
                  </p>{" "}
                  {/* Dynamic count */}
                </div>
              </div>
            </motion.div>

            {/* Total Sale Box */}
            <motion.div
              className="flex items-center justify-between p-6 bg-white rounded-xl shadow-lg hover:scale-105 transition-all min-w-[300px] h-[130px] cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-6">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1067/1067382.png"
                  alt="Total Sale"
                  className="w-16 h-16"
                />
                <div>
                  <h4 className=" text-2xl  text-[#757575]">Total Sale</h4>
                  <p className="text-xl font-semibold text-[#6b98cc]">
                    {paymentReport !== null
                      ? "PKR. " + paymentReport.totaSale
                      : "-"}
                  </p>{" "}
                  {/* Dynamic amount */}
                </div>
              </div>
            </motion.div>

            {/* Total Balance Box */}
            <motion.div
              className="flex items-center justify-between p-6 bg-white rounded-xl shadow-lg hover:scale-105 transition-all min-w-[300px] h-[130px] cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-6">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1087/1087091.png"
                  alt="Total Balance"
                  className="w-16 h-16"
                />
                <div>
                  <h4 className=" text-2xl  text-[#757575]">Total Balance</h4>
                  <p className="text-xl font-semibold text-[#b97563]">
                    {paymentReport !== null
                      ? "PKR. " + paymentReport.totalBalanced
                      : "-"}
                  </p>{" "}
                  {/* Dynamic balance */}
                </div>
              </div>
            </motion.div>
            {/* Deactive Users */}
            {viewAll ? (
              <>
                <motion.div
                  className="flex items-center justify-between p-6 bg-white rounded-xl shadow-lg hover:scale-105 transition-all min-w-[300px] h-[130px] cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-6">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/1067/1067382.png"
                      alt="Total Sale"
                      className="w-16 h-16"
                    />
                    <div>
                      <h4 className=" text-2xl  text-[#757575]">
                        Deactive Users
                      </h4>
                      <p className="text-xl font-semibold text-[#b97563]">
                        {deActiveUsers !== null ? deActiveUsers : "-"}
                      </p>{" "}
                      {/* Dynamic amount */}
                    </div>
                  </div>
                </motion.div>

                {/* Advance Amount Box */}
                <motion.div
                  className="flex items-center justify-between p-6 bg-white rounded-xl shadow-lg hover:scale-105 transition-all min-w-[300px] h-[130px] cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-6">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/1087/1087091.png"
                      alt="Total Balance"
                      className="w-16 h-16"
                    />
                    <div>
                      <h4 className=" text-2xl  text-[#757575]">
                        Advance Amount
                      </h4>
                      <p className="text-xl font-semibold text-[#62b45a]">
                        {paymentReport !== null
                          ? "PKR. " + paymentReport.advanceBalanced
                          : "-"}
                      </p>{" "}
                      {/* Dynamic balance */}
                    </div>
                  </div>
                </motion.div>
              </>
            ) : null}
          </div>
          <div
            className="ml-auto cursor-pointer w-fit px-5 py-1 bg-[#8080802f] rounded text-gray-800"
            onClick={() => {
              document.body.querySelector("#main-view-container").scrollTo({
                behavior: "smooth",
                top: 0,
              });
              setViewAll(!viewAll);
            }}
          >
            {viewAll ? "View less" : "View all"}
          </div>

          {/* New Row for Recent Users and Logo */}
          <div className="flex  gap-6 py-5">
            {/* Left side: Recent Users */}
            <div
              id="recent-users-container"
              className={`w-full ${
                recentUsersWidth < 500 ? "w-full" : "md:w-[70%] lg:w-[70%]"
              } p-6 bg-white rounded-xl shadow-lg`}
            >
              <h4 className="text-xl font-semibold text-[#333] mb-4">
                Recent Users
              </h4>
              {recentUsers ? (
                <div className="w-full">
                  {/* Header */}
                  <div className="flex border mb-2 px-3 rounded-full bg-[#cecdcd] h-[35px]  items-center text-[#070707]">
                    <div className="w-1/4 text-center  ">User ID</div>
                    <div className="w-1/4 text-center">User Name</div>
                    <div className="w-1/4 text-center ">Date</div>
                    <div className="w-1/4 text-center ">Balance</div>
                  </div>

                  {/* List of Users */}
                  <div className="space-y-2">
                    {recentUsers.length > 0 ? (
                      recentUsers.map((user, i) => {
                        return (
                          <div
                            key={i}
                            className="flex border mb-2 px-3 rounded-full  h-[35px]  items-center"
                          >
                            <div className="w-1/4 text-center">
                              {truncateText(user.userId)}
                            </div>
                            <div className="w-1/4 text-center">
                              {truncateText(user.username)}
                            </div>
                            <div className="w-1/4 text-center">
                              {truncateText(formatDate(user.createdAt))}
                            </div>
                            <div className="w-1/4 text-center">
                              PKR {user.balancedAmount}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="w-full text-center">
                        No User Data Found, please add User to display here
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex w-full h-[100px] mx-auto items-center justify-center gap-3 py-3">
                  <div className="loader1-spin"></div>
                  <span>Loading recent Users please wait...</span>
                </div>
              )}
            </div>

            {/* Right side: Logo */}
            {recentUsersWidth >= 500 && (
              <div
                className="w-[30%] bg-cover flex justify-center items-center h-full"
                style={{
                  backgroundImage: `url(${require("../assets/logo.png")})`,
                  backgroundSize: "contain", // Adjusts the image size to fit within the div
                  backgroundPosition: "center", // Centers the image within the div
                  backgroundRepeat: "no-repeat", // Prevents the image from repeating
                }}
              ></div>
            )}
          </div>

          <Footer />

          {/* -------------------------------  */}
        </div>
      </GlobalDashboardPage>
    </div>
  );
}

export default MainPage;
