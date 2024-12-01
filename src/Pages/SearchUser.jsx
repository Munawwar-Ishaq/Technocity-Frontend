import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import { searchApi, setSearchText } from "../store/Reducers/search";
import { getFormDataApi } from "../store/Reducers/formData";
import { setSelectedUserAmountUpdate } from "../store/Reducers/users";
import { useNavigate } from "react-router-dom";

const SearchUser = () => {
  const { searchText, isLoading, results } = useSelector(
    (state) => state.search
  );
  const { areas } = useSelector((state) => state.formData);
  const [selectedArea, setselectedArea] = useState(null);
  const [dropdownActive, setDropdownActive] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (areas === null) {
      dispatch(getFormDataApi());
    }
  }, [areas, dispatch]);

  // Window Click Handle
  useEffect(() => {
    const windowClick = () => {
      setDropdownActive(false);
    };

    window.addEventListener("click", windowClick);

    return () => {
      window.removeEventListener("click", windowClick);
    };
  }, []);

  useEffect(() => {
    if (searchText) {
      dispatch(
        searchApi({
          q: searchText,
          filter: selectedArea,
        })
      );
    }
  }, [searchText, selectedArea , dispatch]);

  const truncateText = (id) => {
    return id.length > 15 ? id.substring(0, 15) + "..." : id;
  };

  return (
    <div className="w-full min-h-full">
      <Header title={"Search"} />
      <div className="w-full h-[43px] flex justify-between shadow-md px-8 bg-white items-center">
        <span className="text-md font-semibold">
          Your Search : {searchText}
        </span>
        <div className="flex text-sm h-full items-center">
          Filter By Area :{" "}
          <div
            className="w-fit transition-all relative cursor-pointer flex justify-between items-center ml-2 px-3 rounded h-[80%] min-w-[150px] max-w-[300px] border border-gray-200"
            onClick={(e) => {
              e.stopPropagation();
              setDropdownActive(!dropdownActive);
            }}
          >
            {!selectedArea ? (
              "--Select--"
            ) : (
              <div className="px-2 py-1 rounded-sm bg-slate-100 gap-2 flex items-center">
                {selectedArea}
                <FontAwesomeIcon
                  icon={faXmark}
                  onClick={(e) => {
                    e.stopPropagation();
                    setselectedArea(null);
                  }}
                />
              </div>
            )}
            <FontAwesomeIcon
              icon={faAngleDown}
              className={`ml-2 ${dropdownActive && "rotate-180"}`}
            />
            <ul
              className={`absolute py-2 rounded-md top-full mt-2 left-0 w-fit min-w-full bg-white border ${
                dropdownActive ? "scale-y-100" : "scale-y-0"
              } origin-top border-gray-200`}
            >
              {areas ? (
                areas.length ? (
                  areas.map((area) => (
                    <li
                      key={area.id}
                      onClick={() => setselectedArea(area.name)}
                      className="px-3 py-1 hover:bg-[#f9f9f9]"
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
            </ul>
          </div>
        </div>
      </div>

      {/* search result Container */}
      <div
        className={` mx-auto my-3  p-6 bg-white rounded-xl shadow-lg`}
        style={{
          width: "calc(100% - 20px)",
        }}
      >
        <h4 className=" text-[#333] mb-4">Search Result</h4>
        <div className="flex border mb-2 px-3 rounded-full bg-[#2d2d2d] h-[35px]  items-center text-white">
          <div className="w-1/4 text-left  ">User ID</div>
          <div className="w-1/4 text-left">User Name</div>
          <div className="w-1/4 text-left ">Area</div>
          <div className="w-1/4 text-left ">Ammount Paid</div>
          <div className="w-1/4 text-left ">Balance</div>
        </div>
        {isLoading && (
          <div className="flex gap-3 justify-center mb-2 px-3 rounded-full  h-[35px] items-center">
            <div className="loader1-spin"></div>
            <div>
              Searching User Data {selectedArea && `filterd by ${selectedArea}`}{" "}
              please wait....
            </div>
          </div>
        )}
        {results.length > 0 ? (
          results.map((result, i) => {
            return (
              <div
                key={i}
                className="flex border mb-2 px-3 rounded-full  h-[35px]  items-center"
              >
                <div className="w-1/4">{truncateText(result.userId)}</div>
                <div
                  className="w-1/4 hover:text-gray-400"
                  onClick={() => {
                    dispatch(setSearchText(""))
                    navigate(`/user/${result.userId}/view`);
                  }}
                >
                  {truncateText(result.username)}
                </div>
                <div className="w-1/4">{truncateText(result.area)}</div>
                <div
                  className="w-1/4 hover:text-gray-400"
                  onClick={() => {
                    dispatch(
                      setSelectedUserAmountUpdate({
                        userId: result.userId,
                        username: result.username,
                        amount: result.amountPaid,
                      })
                    );
                  }}
                >
                  PKR {result.amountPaid}
                </div>
                <div className="w-1/4">PKR {result.balancedAmount}</div>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center">No results found</div>
        )}
      </div>
    </div>
  );
};

export default SearchUser;
