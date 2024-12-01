import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useDispatch } from "react-redux";
import { setShowSearchResult } from "../store/Reducers/search";
import { useNavigate } from "react-router-dom";

const ContentHeader = ({ title }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tabs = ["Dashboard", "All Users", "Add New User", "Upload File" , "Update Form" , "Deactive Users"];
  return (
    <div className="w-full h-[50px] flex items-center justify-between bg-[#f1f7ff] text-[#333333] px-6 sm:px-10 py-3 border-b border-[#d0e2f4]">

      <div className="text-xl font-semibold flex items-center justify-center gap-3">
        {!tabs.includes(title) && (
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="hover:text-gray-600 cursor-pointer"
            onClick={() => {
              dispatch(setShowSearchResult(false));
              if (title !== "Search") {
                navigate(-1);
              }
            }}
          />
        )}

        <span>{title || "Page Title"}</span>
      </div>

      {/* Right Side: Version Info */}
      <div className="font-light text-sm hidden sm:block">
        Technocity Networks Billing Version 0.1.0
      </div>
    </div>
  );
};

export default ContentHeader;
