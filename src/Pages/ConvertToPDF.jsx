import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import generatePDF, { Margin } from "react-to-pdf";
import { formatDate } from "../helper/helper";

const ConvertToPDF = () => {
  const location = useLocation();
  const viewRef = useRef();
  const [filteredUsers, setFilteredUser] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(location.state);
    setFilteredUser(location.state);
  }, [location.state]);

  return (
    <div className="p-3">
      <div className="flex px-3 items-center justify-between">
        <div
          onClick={() => navigate(-1)}
          className="bg-gray-300 text-white rounded px-3 py-1 shadow cursor-pointer hover:bg-gray-400 transition-all shadow-gray-300 w-fit mb-3"
        >
          Go Back
        </div>
        <div
          onClick={() => {
            if (filteredUsers && filteredUsers.length > 0) {
              generatePDF(viewRef, {
                filename: "filtered-user.pdf",
                page: { format: "letter", margin: Margin.SMALL },
                canvas: { mimeType: "image/png", qualityRatio: 1 },
              });
            } else {
              alert("No data found to generate PDF.");
            }
          }}
          className="bg-blue-300 text-white rounded px-3 py-1 shadow cursor-pointer hover:bg-blue-400 transition-all shadow-blue-300 w-fit mb-3"
        >
          Download PDF
        </div>
      </div>
      <div
        className="w-full px-5 pt-2 hide-scroll h-[calc(100%-50px)]"
        ref={viewRef}
      >
        <div className="mb-2 border-b border-gray-400 text-[#070707] transition-all text-[12px] xl:text-sm h-[40px] flex">
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
        </div>
        {filteredUsers && filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user.userId}>
              <div
                className={`flex mb-2 rounded-full transition-all ${
                  !user.active ? "border-red-300 bg-red-100" : ""
                } h-[40px] text-[#565656] bg-white hover:bg-gray-200`}
              >
                <div
                  className="px-3 h-full flex-1 flex items-center truncate justify-center"
                  title={user.userId}
                >
                  {user.userId}
                </div>
                <div
                  className={`px-3 h-full flex-1 align-middle truncate max-w-[150px] cursor-pointer flex ${
                    !user.active ? "border-red-300" : ""
                  }`}
                  title={user.username}
                >
                  {user.username}
                </div>
                <div
                  className={`px-3 h-full flex-1 truncate align-middle text-center flex items-center justify-center ${
                    !user.active ? "border-red-300" : ""
                  }`}
                  title={formatDate(user.createdAt)}
                >
                  {formatDate(user.createdAt)}
                </div>
                <div
                  className={`px-3 h-full flex-1 truncate align-middle text-center flex items-center justify-center ${
                    !user.active ? "border-red-300" : ""
                  }`}
                  title={user.package}
                >
                  {user.package}
                </div>
                <div
                  className={`px-3 h-full flex-1 truncate align-middle text-center flex items-center justify-center ${
                    !user.active ? "border-red-300" : ""
                  }`}
                  title={user.totalAmount}
                >
                  PKR. {user.totalAmount}
                </div>
                <div
                  className={`px-3 h-full flex-1 truncate align-middle text-center flex items-center justify-center ${
                    !user.active ? "border-red-300" : ""
                  }`}
                  title={user.amountPaid}
                >
                  PKR. {Number(user.amountPaid)}
                </div>
                <div
                  className={`px-3 h-full flex-1 truncate align-middle text-center flex items-center justify-center ${
                    !user.active ? "border-red-300" : ""
                  }`}
                  title={user.balancedAmount}
                >
                  PKR. {user.balancedAmount}
                </div>
                <div
                  className={`px-3 h-full flex-1 truncate align-middle text-center flex items-center justify-center ${
                    !user.active ? "border-red-300" : ""
                  }`}
                  title={user.lastMonthDue}
                >
                  {user.lastMonthDue
                    ? `PKR. ${Number(user.lastMonthDue)}`
                    : "-"}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No User Data for Convert to PDF</div>
        )}
      </div>
    </div>
  );
};

export default ConvertToPDF;
