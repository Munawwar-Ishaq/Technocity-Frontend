import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFormDataApi } from "../store/Reducers/formData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { formatDate, Get_Token, Server_url } from "../helper/helper";
import { useNavigate } from "react-router-dom";
import { FixedSizeList as List } from "react-window";

const FilterContainer = ({ sideBarShow, setShowFilter }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedArea, setSelectedArea] = useState([]);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [minAmount, setMinAmount] = useState(100);
  const [maxAmount, setMaxAmount] = useState(10000);
  const [selectedLastMonthDue, setSelectedLastMonthDue] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsloading] = useState(false);
  const [initHeight, setInitHeight] = useState(190);
  const [, setShowNoMore] = useState(false);
  const navigate = useNavigate();
  const viewRef = useRef(null);

  const { areas } = useSelector((state) => state.formData);
  const dispatch = useDispatch();

  useEffect(() => {
    if (areas === null) {
      dispatch(getFormDataApi());
    }
  }, [areas, dispatch]);

  const buildFilterQuery = (page) => {
    let query = {
      page: page,
      limit: 20,
    };

    if (startDate || endDate) {
      let dateFilter = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);
      query.startDate = startDate;
      query.endDate = endDate;
    }

    if (selectedArea.length > 0) {
      query.area = selectedArea.join(",");
    }

    if (selectedLastMonthDue) {
      query.lastMonthDue = selectedLastMonthDue;
    }

    if (selectedAmount) {
      query.selectedAmount = selectedAmount;
      if (selectedAmount === "select") {
        query.minAmount = minAmount;
        query.maxAmount = maxAmount;
      }
    }

    return query;
  };

  const fetchFilteredUsers = async (page) => {
    try {
      const query = buildFilterQuery(page);
      setIsloading(true);
      const response = await axios.get(`${Server_url}/user/filter`, {
        params: query,
        headers: {
          Authorization: "Bearer " + Get_Token(),
        },
      });
      let newUserData;

      if (parseFloat(response.data.currentPage) === 1) {
        newUserData = response.data.data;
        if (viewRef) {
          viewRef.current.scrollTo(0, 0);
        }
      } else {
        newUserData = Array.isArray(filteredUsers)
          ? [...filteredUsers, ...response.data.data]
          : response.data.data;
      }

      setFilteredUsers(newUserData);
      setCurrentPage(parseFloat(response.data.currentPage));
      setTotalPages(response.data.totalPages);
      setTotalUsers(response.data.totalUsers);
      setIsloading(false);
    } catch (error) {
      console.error("Error fetching filtered users:", error);
    }
  };

  const handleFilterClick = () => {
    fetchFilteredUsers(1);
  };

  const truncateText = (text) => {
    return text.length > 7 ? text.substring(0, 7) + "..." : text;
  };

  const loadMoreUsers = ({ visibleStopIndex }) => {
    if (
      visibleStopIndex === filteredUsers.length - 1 &&
      !isLoading &&
      totalPages > currentPage
    ) {
      fetchFilteredUsers(currentPage + 1);
    }

    if (
      visibleStopIndex === filteredUsers.length - 1 &&
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
      setInitHeight(225);
    } else {
      setInitHeight(190);
    }
  }, [isLoading]);

  const renderRow = ({ index, style }) => {
    const user = filteredUsers[index];
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
          } h-[40px] text-[#565656] bg-white hover:bg-gray-200`}
        >
          <div
            className="px-3 h-full flex-1 flex items-center truncate justify-center "
            title={user.userId}
          >
            {truncateText(user.userId)}
          </div>

          <div
            className={`px-3 h-full flex-1 align-middle ${
              !user.active && "border-red-300"
            }  truncate max-w-[150px] cursor-pointer hover:text-[gray] flex items-center justify-center`}
            onClick={() => navigate(`/user/${user.userId}/view`)}
            title={user.username}
          >
            {truncateText(user.username)}
          </div>

          <div
            className={`px-3 h-full flex-1 ${
              !user.active && "border-red-300"
            } truncate align-middle  text-center flex items-center justify-center`}
            title={formatDate(user.createdAt)}
          >
            {truncateText(formatDate(user.createdAt))}
          </div>

          <div
            className={`px-3 h-full flex-1 ${
              !user.active && "border-red-300"
            } truncate align-middle  text-center flex items-center justify-center`}
            title={user.package}
          >
            {truncateText(user.package)}
          </div>

          <div
            className={`px-3 h-full flex-1 ${
              !user.active && "border-red-300"
            } truncate align-middle  text-center flex items-center justify-center`}
            title={user.totalAmount}
          >
            PKR. {truncateText(user.totalAmount)}
          </div>

          <div
            className={`px-3 h-full flex-1 ${
              !user.active && "border-red-300"
            } truncate align-middle  text-center flex items-center justify-center`}
            title={user.amountPaid}
          >
            PKR. {Number(user.amountPaid)}
          </div>

          <div
            className={`px-3 h-full flex-1 ${
              !user.active && "border-red-300"
            } truncate align-middle  text-center flex items-center justify-center`}
            title={user.balancedAmount}
          >
            PKR. {user.balancedAmount}
          </div>

          <div
            className={`px-3 h-full flex-1 ${
              !user.active && "border-red-300"
            } truncate align-middle  text-center flex items-center justify-center`}
            title={user.lastMonthDue}
          >
            {user.lastMonthDue ? "PKR. " + Number(user.lastMonthDue) : "-"}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        width: `${sideBarShow ? "calc(100% - 280px)" : "100%"}`,
      }}
      className={`${
        sideBarShow ? "left-[280px]" : "left-0"
      } z-40 p-3 bg-[#1a1919ad] transition-all h-[calc(100%-60px)] fixed top-[60px]`}
    >
      <div className="w-full flex h-full bg-white overflow-hidden rounded-md">
        <div className="w-[230px] h-full bg-[#fcfcfc] border-r overflow-y-auto hide-scroll">
          {/* Filter Options */}
          <div className="flex items-center h-[50px] justify-between p-2 border-b text-sm text-[#414141]">
            <span>Filter Options</span>
            <div
              className="px-2 py-1 flex items-center justify-center h-[30px] gap-1 rounded border border-gray cursor-pointer bg-[#eee]"
              onClick={handleFilterClick}
            >
              Filter {isLoading && <div className="loader1-spin"></div>}
            </div>
          </div>

          {/* Date Filter */}
          <div className="p-2 border-b text-[13px] text-[#414141]">
            <div className="mb-2">Filter Date</div>
            <div className="flex justify-between mb-1 items-center">
              Start Date:{" "}
              <input
                type="date"
                className="py-1 bg-white outline-none border text-[10px] border-[#eee] rounded px-1"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex justify-between mb-1 items-center">
              End Date:{" "}
              <input
                type="date"
                className="py-1 bg-white outline-none border text-[10px] border-[#eee] rounded px-1"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Area Filter */}
          <div className="p-2 border-b text-[13px] text-[#414141]">
            <div className="mb-2">Filter Area</div>
            <div className="flex gap-1 flex-wrap list-none">
              {areas ? (
                areas.length ? (
                  areas.map((area) => (
                    <li
                      key={area.id}
                      onClick={() =>
                        setSelectedArea((prev) => {
                          let newArray = prev.includes(area.name)
                            ? prev.filter((nm) => nm !== area.name)
                            : [...prev, area.name];
                          return newArray;
                        })
                      }
                      className={`px-3 py-1 rounded cursor-pointer border ${
                        selectedArea.includes(area.name)
                          ? "bg-[#a07fd9] text-white"
                          : "hover:bg-[#f9f9f9]"
                      }`}
                    >
                      {area.name}
                    </li>
                  ))
                ) : (
                  <li>No area found</li>
                )
              ) : (
                <li>Loading...</li>
              )}
            </div>
          </div>

          {/* Amount Filter */}
          <div className="p-2 border-b text-[13px] text-[#414141]">
            <div className="mb-2">Filter Balanced</div>
            <div className="flex gap-1 flex-wrap items-center list-none">
              <span
                className={`p-1 border cursor-pointer px-2 rounded ${
                  selectedAmount === "complete" &&
                  "bg-[#96f596] border-white text-white"
                }`}
                onClick={() =>
                  setSelectedAmount((prev) =>
                    prev === "complete" ? null : "complete"
                  )
                }
              >
                Complete
              </span>
              <span
                className={`p-1 border cursor-pointer px-2 rounded ${
                  selectedAmount === "select" &&
                  "bg-[#a07fd9] text-white border-white"
                }`}
                onClick={() =>
                  setSelectedAmount((prev) =>
                    prev === "select" ? null : "select"
                  )
                }
              >
                Select Amount
              </span>
            </div>

            {/* Amount Range */}
            {selectedAmount === "select" && (
              <div className="gap-1 flex-wrap items-center mt-2">
                <div>
                  <div>Min.</div>
                  <input
                    type="number"
                    className="w-[100px] rounded border outline-none px-2 py-1"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    onBlur={(e) => e.target.value < 0 && setMinAmount(0)}
                    placeholder="Min"
                  />
                </div>
                <div>
                  <div>Max.</div>
                  <input
                    type="number"
                    className="w-[100px] rounded border outline-none px-2 py-1"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    onBlur={(e) => e.target.value < 0 && setMaxAmount(0)}
                    placeholder="Max"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Last Month Due Filter */}
          <div className="p-2 border-b text-[13px] text-[#414141]">
            <div className="mb-2">Filter Last Month Due</div>
            <div className="flex gap-1 flex-wrap items-center list-none">
              <span
                className={`p-1 border cursor-pointer px-2 rounded ${
                  selectedLastMonthDue === "receive" &&
                  "bg-[#a07fd9] text-white border-white"
                }`}
                onClick={() =>
                  setSelectedLastMonthDue((prev) =>
                    prev === "receive" ? null : "receive"
                  )
                }
              >
                Receive
              </span>
              <span
                className={`p-1 border cursor-pointer px-2 rounded ${
                  selectedLastMonthDue === "pay" &&
                  "bg-[#a07fd9] text-white border-white"
                }`}
                onClick={() =>
                  setSelectedLastMonthDue((prev) =>
                    prev === "pay" ? null : "pay"
                  )
                }
              >
                Pay
              </span>
            </div>
          </div>
        </div>

        {/* Filtered User View Area */}
        <div className="w-[calc(100%-230px)] h-full">
          <div className="w-full flex px-3 items-center justify-between h-[50px] text-[#3b3b3b] border-b">
            <div className="text-sm font-bold">Filtered Users</div>
            <div>
              Total Results :{" "}
              <span>
                {totalUsers} - {filteredUsers ? filteredUsers.length : 0}
              </span>
            </div>
            <div className="flex gap-3 h-full items-center">
              <div
                className="px-3 py-1 rounded bg-gray-400 cursor-pointer transition-all hover:bg-gray-500 text-white"
                onClick={() => {
                  navigate("/convert-to-pdf", {
                    state: filteredUsers,
                  });
                }}
              >
                Convert To PDF
              </div>
              <FontAwesomeIcon
                className="text-lg cursor-pointer hover:bg-gray-200 rounded p-1 px-2"
                icon={faXmark}
                onClick={() => setShowFilter(false)}
              />
            </div>
          </div>
          <div
            className=" w-full px-5 pt-2 hide-scroll h-[calc(100%-50px)]"
            ref={viewRef}
          >
            <div
              className={`bg-[#cecdcd] mb-2 text-[#070707] transition-all rounded-full text-[12px] xl:text-sm h-[40px] flex`}
            >
              <div className="px-1 py-1 flex-1  text-center flex items-center justify-center truncate">
                User ID
              </div>
              <div className="px-1 truncate  py-1 flex-1  text-center flex items-center justify-center">
                User Name
              </div>
              <div className="px-1 py-1 flex-1  text-center flex items-center justify-center truncate">
                Date
              </div>
              <div className="px-1 py-1 flex-1  text-center flex items-center justify-center truncate">
                Package
              </div>
              <div className="px-1 py-1 truncate flex-1  text-center flex items-center justify-center">
                Total Amount
              </div>
              <div className="px-1 py-1 flex-1 truncate  text-center flex items-center justify-center">
                Amount Paid
              </div>
              <div className="px-1 py-1 flex-1 truncate  text-center flex items-center justify-center">
                Balance
              </div>
              <div className="px-1 py-1 flex-1 truncate  text-center flex items-center justify-center">
                Last Month Due
              </div>
            </div>
            {filteredUsers ? (
              filteredUsers.length > 0 ? (
                <List
                  height={window.innerHeight - initHeight}
                  itemCount={filteredUsers.length}
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
                Please Click filter to show users here...
              </div>
            )}
            {totalPages
              ? totalPages === parseFloat(currentPage) && (
                  <div className="text-center">No more User found</div>
                )
              : null}
            {isLoading && (
              <div className="flex gap-3 justify-center mb-2 px-3 rounded-full  h-[35px] items-center">
                <div className="loader1-spin"></div>
                <div>Loading More Users please wait....</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterContainer;
