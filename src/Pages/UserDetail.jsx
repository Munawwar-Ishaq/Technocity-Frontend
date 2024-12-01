import React, { useEffect, useRef, useState } from "react";
import GlobalDashboardPage from "../components/GlobalDashboardPage";
import ContentHeader from "../components/Header";
import {
  formatDateMonthFull,
  Get_Token,
  Server_url,
} from "../helper/helper";
import generatePDF, { Margin } from "react-to-pdf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useParams } from "react-router-dom";

const UserDetail = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [statementHistory, setStatementHistory] = useState(null);

  const params = useParams();
  const statementRef = useRef();

  const getUserDetail = async (userid) => {
    try {
      let token = Get_Token();
      let response = await axios.get(
        `${Server_url}/get/user-detail?userId=${userid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserDetails(response.data.data);
      setStatementHistory(response.data.statements);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    console.log(params);

    if (params.userId) {
      getUserDetail(params.userId);
    }
  }, [params]);

  return (
    <GlobalDashboardPage>
      <ContentHeader title={"User Detail"} />
      <div className="min-h-screen pb-10 pt-3 px-5">
        {userDetails ? (
          <>
            <div
              title="editUser"
              className="bg-blue-300 text-white rounded px-3 py-1 shadow mr-3 ml-auto cursor-pointer hover:bg-blue-400 transition-all shadow-blue-300 w-fit mb-3"
            >
              <FontAwesomeIcon icon={faEdit} />
            </div>
            <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-[calc(100%-20px)] mx-auto ">
              <div className="flex justify-between">
                <div className="flex items-center space-x-4">
                  {/* Avatar */}
                  <div className="w-24 h-24 rounded-full bg-[#6caae3] flex items-center justify-center">
                    <span className="text-5xl font-light text-white">
                      {userDetails.username[0]}
                    </span>
                  </div>
                  <div className="list-none font-semibold uppercase text-[#515151]">
                    <li>{userDetails.username}</li>
                    <li>{userDetails.active ? "Active" : "Disactive"}</li>
                  </div>
                </div>
                {/* Address */}
                <div className="flex flex-col  justify-center list-none font-light text-[#515151]">
                  <li className="flex">
                    <div className="min-w-[100px] gap-3">Address :</div>{" "}
                    {userDetails.address}
                  </li>
                  <li className="flex">
                    <div className="min-w-[100px] gap-3">Area :</div>{" "}
                    {userDetails.area}
                  </li>
                </div>
              </div>
              <h2 className="my-4 font-bold text-gray-600">
                User Package Detail
              </h2>
              <div className=" border border-gray-200 overflow-hidden  rounded-lg">
                <div className="flex border-b w-full list-none border-gray-200 ">
                  <li className="w-[calc(50%-1px)] font-semibold text-gray-600 px-3 py-1 border-r border-gray-200">
                    User ID
                  </li>
                  <li className="w-[calc(50%)]  text-gray-600 px-3 py-1 ">
                    {userDetails.userId}
                  </li>
                </div>
                <div className="flex border-b w-full list-none border-gray-200 ">
                  <li className="w-[calc(50%-1px)] font-semibold text-gray-600 px-3 py-1 border-r border-gray-200">
                    Conection Type
                  </li>
                  <li className="w-[calc(50%)]  text-gray-600 px-3 py-1 ">
                    {userDetails.connectionType}
                  </li>
                </div>
                {userDetails.connectionType === "FTTH" && (
                  <>
                    <div className="flex border-b w-full list-none border-gray-200 ">
                      <li className="w-[calc(50%-1px)] font-semibold text-gray-600 px-3 py-1 border-r border-gray-200">
                        Port
                      </li>
                      <li className="w-[calc(50%)]  text-gray-600 px-3 py-1 ">
                        {userDetails.port}
                      </li>
                    </div>
                    <div className="flex border-b w-full list-none border-gray-200 ">
                      <li className="w-[calc(50%-1px)] font-semibold text-gray-600 px-3 py-1 border-r border-gray-200">
                        V-Lan
                      </li>
                      <li className="w-[calc(50%)]  text-gray-600 px-3 py-1 ">
                        {userDetails.vlan}
                      </li>
                    </div>
                  </>
                )}
                <div className="flex border-b w-full list-none border-gray-200 ">
                  <li className="w-[calc(50%-1px)] font-semibold text-gray-600 px-3 py-1 border-r border-gray-200">
                    Package
                  </li>
                  <li className="w-[calc(50%)] text-gray-600 px-3 py-1 ">
                    {userDetails.package}
                  </li>
                </div>
                <div
                  className={`flex ${
                    userDetails.staticIP && "border-b"
                  }  w-full list-none border-gray-200 `}
                >
                  <li className="w-[calc(50%-1px)] font-semibold text-gray-600 px-3 py-1 border-r border-gray-200">
                    Static IP
                  </li>
                  <li className="w-[calc(50%)]  text-gray-600 px-3 py-1 ">
                    {userDetails.staticIP ? "Yes" : "No"}
                  </li>
                </div>
                {userDetails.staticIP ? (
                  <div className="flex  w-full list-none border-gray-200 ">
                    <li className="w-[calc(50%-1px)] font-semibold text-gray-600 px-3 py-1 border-r border-gray-200">
                      Static IP Address
                    </li>
                    <li className="w-[calc(50%)]  text-gray-600 px-3 py-1 ">
                      {userDetails.staticIPAddress || "-"}
                    </li>
                  </div>
                ) : null}
              </div>

              {/* Payment Info  */}
              <h2 className="my-4 font-bold text-gray-600">
                User Payment Detail
              </h2>
              <div className=" border border-gray-200 overflow-hidden  rounded-lg">
                <div className="flex border-b w-full list-none border-gray-200 ">
                  <li className="w-[calc(50%-1px)] font-semibold text-gray-600 px-3 py-1 border-r border-gray-200">
                    Last Month due
                  </li>
                  <li className="w-[calc(50%)] text-gray-600 px-3 py-1 ">
                    {userDetails.lastMonthDue || "-"}
                  </li>
                </div>
                <div className="flex border-b w-full list-none border-gray-200 ">
                  <li className="w-[calc(50%-1px)] font-semibold text-gray-600 px-3 py-1 border-r border-gray-200">
                    Package Rate
                  </li>
                  <li className="w-[calc(50%)]  text-gray-600 px-3 py-1 ">
                    {userDetails.packageRate || "-"}
                  </li>
                </div>
                {userDetails.staticIP ? (
                  <div className="flex border-b w-full list-none border-gray-200 ">
                    <li className="w-[calc(50%-1px)] font-semibold text-gray-600 px-3 py-1 border-r border-gray-200">
                      Static IP Ammount
                    </li>
                    <li className="w-[calc(50%)]  text-gray-600 px-3 py-1 ">
                      {userDetails.staticIPAmmount || "-"}
                    </li>
                  </div>
                ) : null}
                <div className="flex border-b w-full list-none border-gray-200 ">
                  <li className="w-[calc(50%-1px)] font-semibold text-gray-600 px-3 py-1 border-r border-gray-200">
                    Total Ammount
                  </li>
                  <li className="w-[calc(50%)]  text-gray-600 px-3 py-1 ">
                    {userDetails.totalAmount || "-"}
                  </li>
                </div>
                <div className="flex w-full list-none border-gray-200 ">
                  <li className="w-[calc(50%-1px)] font-semibold text-gray-600 px-3 py-1 border-r border-gray-200">
                    Balanced
                  </li>
                  <li className="w-[calc(50%)] text-gray-600 px-3 py-1 ">
                    {userDetails.balancedAmount === 0
                      ? "Completed"
                      : userDetails.balancedAmount.toString() || "-"}
                  </li>
                </div>
              </div>

              {/* Contact Info  */}
              <h2 className="my-4 font-bold text-gray-600">
                User Contact Detail
              </h2>
              <div className=" border border-gray-200 overflow-hidden  rounded-lg">
                <div className="flex border-b w-full list-none border-gray-200 ">
                  <li className="w-[calc(50%-1px)] font-semibold text-gray-600 px-3 py-1 border-r border-gray-200">
                    Phone No
                  </li>
                  <li className="w-[calc(50%)] text-gray-600 px-3 py-1 ">
                    {userDetails.phoneNumber || "-"}
                  </li>
                </div>
                <div className="flex border-b w-full list-none border-gray-200 ">
                  <li className="w-[calc(50%-1px)] font-semibold text-gray-600 px-3 py-1 border-r border-gray-200">
                    Cell Number
                  </li>
                  <li className="w-[calc(50%)]  text-gray-600 px-3 py-1 ">
                    {userDetails.cellNumber || "-"}
                  </li>
                </div>
                <div className="flex w-full list-none border-gray-200 ">
                  <li className="w-[calc(50%-1px)] font-semibold text-gray-600 px-3 py-1 border-r border-gray-200">
                    CNIC No
                  </li>
                  <li className="w-[calc(50%)]  text-gray-600 px-3 py-1 ">
                    {userDetails.cnicNumber || "-"}
                  </li>
                </div>
              </div>
            </div>
            <hr className="my-7 max-w-[calc(100%-20px)] mx-auto" />

            {/* Statement History Section */}
            <div
              onClick={() => {
                generatePDF(statementRef, {
                  filename: userDetails.userId.trim() + "-statement.pdf",
                  page: {
                    format: "letter",
                    margin: Margin.SMALL,
                  },
                  canvas: {
                    mimeType: "image/png",
                    qualityRatio: 1,
                  },
                });
              }}
              className="bg-blue-300 text-white rounded px-3 py-1 shadow mr-3 ml-auto cursor-pointer hover:bg-blue-400 transition-all shadow-blue-300 w-fit mb-3"
            >
              Download PDF
            </div>
            <div
              ref={statementRef}
              className="bg-white shadow-lg rounded-lg p-4 w-full max-w-[calc(100%-20px)] mx-auto mb-8"
            >
              <h2 className="font-bold text-gray-600 mb-3">
                Statement History - {userDetails.userId}
              </h2>
              {statementHistory.length > 0 ? (
                statementHistory.map((statements, i) => {
                  return (
                    <div key={i} className="mb-4  ">
                      <div className="text-center bg-blue-300 border rounded-lg border-gray-200 w-full text-white py-1 px-3">
                        {formatDateMonthFull(statements.createdAt)} -{" "}
                        {formatDateMonthFull(statements.createdAt, {
                          increaseMonth: 1,
                        })}
                      </div>
                      <div className="w-full flex items-center justify-center">
                        <div className="w-0 h-[30px] border-r border-gray-200 "></div>
                      </div>
                      <div className=" w-full">
                        {statements.statementHistory.map((statement, index) => (
                          <>
                            <div
                              key={index}
                              className=" p-4 border rounded-md bg-gray-50 shadow-md"
                            >
                              {/* PackageRate */}
                              {statement.type === "PackageRate" && (
                                <div className="mt-4">
                                  <div className="flex justify-between text-gray-800">
                                    <span>Last Package Rate</span>
                                    <span>{statement.lastPackageRate}</span>
                                  </div>
                                  <div className="flex justify-between text-gray-800">
                                    <span>New Package Rate</span>
                                    <span>{statement.newPackageRate}</span>
                                  </div>
                                  <div className="flex justify-between text-gray-800">
                                    <span>Total Package Rate Change</span>
                                    <span
                                      className={
                                        statement.totalpackageRateChange > 0
                                          ? "text-green-600"
                                          : "text-red-600"
                                      }
                                    >
                                      {statement.totalpackageRateChange}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-gray-800">
                                    <span>Last Total Amount</span>
                                    <span>{statement.lastTotalAmmount}</span>
                                  </div>
                                  <div className="flex justify-between text-gray-800">
                                    <span>New Total Amount</span>
                                    <span>{statement.newTotalAmmount}</span>
                                  </div>
                                  <div className="flex justify-between text-gray-800">
                                    <span>Date</span>
                                    <span>
                                      {formatDateMonthFull(statement.date)}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Payment */}
                              {statement.type === "AmmountPaid" && (
                                <div className="">
                                  <div className="flex justify-between text-gray-800">
                                    <span>Last Amount Paid</span>
                                    <span>{statement.lastAmountPaid}</span>
                                  </div>
                                  <div className="flex justify-between text-gray-800">
                                    <span>New Amount Paid</span>
                                    <span>{statement.newAmountPaid}</span>
                                  </div>
                                  <div className="flex justify-between text-gray-800">
                                    <span>Total Amount Paid Change</span>
                                    <span
                                      className={
                                        statement.totalAmountPaidChange > 0
                                          ? "text-green-600"
                                          : "text-red-600"
                                      }
                                    >
                                      {statement.totalAmountPaidChange}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-gray-800">
                                    <span>Date</span>
                                    <span>
                                      {formatDateMonthFull(statement.date)}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Static IPA Amount */}
                              {statement.type === "StaticIPAmmount" && (
                                <div className="">
                                  <div className="flex justify-between text-gray-800">
                                    <span>Last Static IP Amount</span>
                                    <span>{statement.lastStaticIPAmmount}</span>
                                  </div>
                                  <div className="flex justify-between text-gray-800">
                                    <span>New Static IP Amount</span>
                                    <span>{statement.newStaticIPAmmount}</span>
                                  </div>
                                  <div className="flex justify-between text-gray-800">
                                    <span>Total Static IP Amount Change</span>
                                    <span
                                      className={
                                        statement.totalStaticIPAmountRateChange >
                                        0
                                          ? "text-green-600"
                                          : "text-red-600"
                                      }
                                    >
                                      {statement.totalStaticIPAmountRateChange}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-gray-800">
                                    <span>Date</span>
                                    <span>
                                      {formatDateMonthFull(statement.date)}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* User Status */}
                              {statement.type === "UserStatus" && (
                                <div className="">
                                  <div className="flex justify-between text-gray-800">
                                    <span>Last Status</span>
                                    <span>
                                      {statement.lastUserStatus
                                        ? "Active"
                                        : "Inactive"}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-gray-800">
                                    <span>New Status</span>
                                    <span>
                                      {statement.newUserStatus
                                        ? "Active"
                                        : "Inactive"}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-gray-800">
                                    <span>Date</span>
                                    <span>
                                      {formatDateMonthFull(statement.date)}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                            {statements.statementHistory.length - 1 > index ? (
                              <div className="w-full flex items-center justify-center">
                                <div className="w-0 h-[30px] border-r border-gray-200 "></div>
                              </div>
                            ) : null}
                          </>
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div>No Statement Available</div>
              )}
            </div>
          </>
        ) : (
          <div className="w-full min-h-full flex items-center gap-4 justify-center">
            <div className="loader1-spin"></div>
            <span>Loading...</span>
          </div>
        )}
      </div>
    </GlobalDashboardPage>
  );
};

export default UserDetail;
