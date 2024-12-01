import React, { useEffect, useRef, useState } from "react";
import GlobalDashboardPage from "../components/GlobalDashboardPage";
import ContentHeader from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getFormDataApi } from "../store/Reducers/formData";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import {
  editUserApi,
  getEditUserInfoApi,
  setEditUser,
} from "../store/Reducers/users";
import { createStatements } from "../helper/helper";

const EditUser = () => {
  const [formData, setFormData] = useState({
    userId: "",
    username: "",
    connectionType: "",
    port: "",
    vlan: "",
    package: "",
    packageRate: "",
    amountPaid: "",
    cnicNumber: "",
    phoneNumber: "",
    cellNumber: "",
    address: "",
    area: "",
    userStatus: false,
  });
  const [remark, setRemark] = useState("");
  const [showPortVlan, setShowPortVlan] = useState(false);
  const [staticIP, setStaticIP] = useState(false);
  const [staticIPAmmount, setstaticIPAmmount] = useState("");
  const [staticIPAddress, setstaticIPAddress] = useState("");
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);
  const [isEdited, setIsEdited] = useState([]);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { areas, packages } = useSelector((state) => state.formData);
  const { allUsers, editUser, isLoading, editUserSuccess } =
    useSelector((state) => state.users);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (areas === null) {
      dispatch(getFormDataApi());
    }
  }, [areas, dispatch]);

  useEffect(() => {
    if (allUsers === null) {
    }
  }, [allUsers, dispatch]);

  const params = useParams();

  useEffect(() => {
    if (loading) {
      if (params) {
        dispatch(setEditUser(null));
        dispatch(getEditUserInfoApi(params.userId));
      }
    }
  }, [params, dispatch, loading]);

  useEffect(() => {
    if (editUser) {
      console.log(editUser);
      setLoading(false);
      setFormData({
        userId: editUser.userId,
        username: editUser.username,
        connectionType: editUser.connectionType,
        port: editUser.port,
        vlan: editUser.vlan,
        package: editUser.package,
        packageRate: editUser.packageRate,
        amountPaid: editUser.amountPaid,
        cnicNumber: editUser.cnicNumber,
        phoneNumber: editUser.phoneNumber,
        cellNumber: editUser.cellNumber,
        address: editUser.address,
        area: editUser.area,
        userStatus: editUser.active,
      });
      if (editUser.connectionType === "FTTH") {
        setShowPortVlan(true);
      } else {
        setShowPortVlan(false);
      }
      if (editUser.staticIP) {
        setStaticIP(true);
        setstaticIPAmmount(editUser.staticIPAmmount);
        setstaticIPAddress(editUser.staticIPAddress);
      } else {
        setStaticIP(false);
      }
      setRemark(editUser.remark);
    }
  }, [editUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: null,
    }));

    if (value.trim() !== editUser[name].trim()) {
      setIsEdited([...isEdited, name]);
    } else {
      setIsEdited(isEdited.filter((item) => item !== name));
    }
    if (name === "connectionType" && value === "FTTH") {
      setShowPortVlan(true);
    } else if (name === "connectionType") {
      setShowPortVlan(false);
    }

    // Clear errors when the field changes
  };

  const validate = () => {
    let validationErrors = {};
    Object.keys(formData).forEach((key) => {
      if (
        !formData[key] &&
        key !== "port" &&
        key !== "vlan" &&
        key !== "userId" &&
        key !== "userStatus"
      ) {
        validationErrors[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is required`;
      }
    });

    if (showPortVlan) {
      if (!formData.port) validationErrors.port = "Port is required for FTTH";
      if (!formData.vlan) validationErrors.vlan = "VLAN is required for FTTH";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  useEffect(() => {
    if (editUserSuccess && editUser) {
      navigate("/all-users");
    }
  }, [editUserSuccess, navigate, editUser]);

  const handleSubmit = (e) => {
    if (isLoading || isEdited.length === 0) {
      return;
    }

    let statements = createStatements(editUser, formData, isEdited);

    let data = {
      ...formData,
      staticIP,
      remark,
      active: formData.userStatus,
      userStatus: undefined,
    };
    if (staticIP) {
      data = { ...data, staticIPAddress, staticIPAmmount };
    }

    if (!formData.userStatus) {
      dispatch(
        editUserApi({
          data: formData,
          editedStatement: statements,
        })
      );
      setErrors({});
      return;
    }

    e.preventDefault();
    if (validate()) {
      console.log("Edited Form Data:", data);
      dispatch(
        editUserApi({
          data,
          statements,
        })
      );
    } else {
      if (Object.keys(errors).length > 0) {
        const firstErrorField =
          formRef.current.querySelector(".border-red-500");
        if (firstErrorField) {
          firstErrorField.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
      toast.error("Please fill all required fields!");
    }
  };

  const handleNumberInput = (e) => {
    if (e.target.name === "packageRate" || e.target.name === "amountPaid") {
      if (!/^\d*\.?\d*$/.test(e.target.value)) {
        e.target.value = e.target.value.slice(0, -1);
      }
    }
  };

  return (
    <GlobalDashboardPage>
      <ContentHeader title={"Edit User"} />
      {loading ? (
        <div className="w-full flex items-center justify-center min-h-[calc(100%-130px)] gap-3 text-xl ">
          <div className="loader1-spin"></div>{" "}
          <span>Finding User Please wait...</span>
        </div>
      ) : (
        <div
          ref={formRef}
          className="p-6 my-3 max-w-[380px] mx-auto bg-white rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-bold text-center mb-4">
            User Edit Form{" "}
          </h2>

          {/* User ID Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              User ID
            </label>
            <input
              type="text"
              name="userId"
              disabled
              value={formData.userId}
              className={`w-full px-3 py-1 font-semibold border rounded h-[33px] text-[12px] focus:outline-none ${
                errors.userId
                  ? "border-red-500 text-red-500 placeholder-red-500"
                  : "focus:border-blue-300"
              }`}
              placeholder="Enter User ID"
            />
            {errors.userId && (
              <p className="text-red-500 text-[11px]">{errors.userId}</p>
            )}
          </div>
          {/* Username Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              User Name
            </label>
            <input
              type="text"
              name="username"
              disabled={!formData.userStatus}
              value={formData.username}
              onChange={handleInputChange}
              className={`w-full px-3 py-1 font-semibold border rounded h-[33px] text-[12px] focus:outline-none ${
                errors.username
                  ? "border-red-500 text-red-500 placeholder-red-500"
                  : "focus:border-blue-300"
              }`}
              placeholder="Enter Username"
            />
            {errors.username && (
              <p className="text-red-500 text-[11px]">{errors.username}</p>
            )}
          </div>

          {/* Connection Type Dropdown */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Connection Type
            </label>
            <select
              name="connectionType"
              disabled={!formData.userStatus}
              value={formData.connectionType}
              onChange={handleInputChange}
              className={`w-full px-3 py-1 font-semibold border rounded h-[33px] text-[12px] focus:outline-none ${
                errors.connectionType
                  ? "border-red-500"
                  : "focus:border-blue-300"
              }`}
            >
              <option value="">Select Connection Type</option>
              <option value="FTTH">FTTH</option>
              <option value="UDP">UDP</option>
              <option value="Wireless">Wireless</option>
            </select>
            {errors.connectionType && (
              <p className="text-red-500 text-[11px]">
                {errors.connectionType}
              </p>
            )}
          </div>

          {/* Conditional Fields for FTTH */}
          {showPortVlan && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  OLT Port
                </label>
                <input
                  type="text"
                  name="port"
                  disabled={!formData.userStatus}
                  value={formData.port}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-1 font-semibold border rounded h-[33px] text-[12px] focus:outline-none ${
                    errors.port
                      ? "border-red-500 text-red-500 placeholder-red-500"
                      : "focus:border-blue-300"
                  }`}
                  placeholder="Enter OLT Port"
                />
                {errors.port && (
                  <p className="text-red-500 text-[11px]">{errors.port}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  VLAN
                </label>
                <input
                  type="text"
                  name="vlan"
                  disabled={!formData.userStatus}
                  value={formData.vlan}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-1 font-semibold border rounded h-[33px] text-[12px] focus:outline-none ${
                    errors.vlan
                      ? "border-red-500 text-red-500 placeholder-red-500"
                      : "focus:border-blue-300"
                  }`}
                  placeholder="Enter VLAN"
                />
                {errors.vlan && (
                  <p className="text-red-500 text-[11px]">{errors.vlan}</p>
                )}
              </div>
            </>
          )}

          {/* Package Dropdown */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Package
            </label>
            <select
              name="package"
              value={formData.package}
              disabled={!formData.userStatus}
              onChange={handleInputChange}
              className={`w-full px-3 py-1 font-semibold border rounded h-[33px] text-[12px] focus:outline-none ${
                errors.package ? "border-red-500" : "focus:border-blue-300"
              }`}
            >
              <option value="">Select Package</option>
              {packages &&
                packages.map((a, i) => {
                  return (
                    <option key={i} value={a.name.replace(/MB/gi, "mb")}>
                      {a.name.replace(/MB/gi, "mb")}
                    </option>
                  );
                })}
            </select>
            {errors.package && (
              <p className="text-red-500 text-[11px]">{errors.package}</p>
            )}
          </div>

          {/* Static IP Field */}
          <div className="mb-4 flex gap-5  items-center">
            <div className="flex transition-all gap-5 items-center">
              <div
                disabled={!formData.userStatus}
                className={`text-gray-700 whitespace-nowrap text-sm font-semibold  `}
              >
                Static IP{" "}
              </div>
              <div
                className={`w-[15px] h-[15px] border border-gray-700 cursor-pointer rounded-sm ${
                  !formData.userStatus && "bg-[#eee] cursor-default"
                }`}
                onClick={() => {
                  if (formData.userStatus) {
                    setStaticIP((prev) => !prev);
                    if (!staticIP !== editUser.staticIP) {
                      setIsEdited([...isEdited, "staticIP"]);
                    } else {
                      setIsEdited(
                        isEdited.filter(
                          (item) =>
                            ![
                              "staticIPAmmount",
                              "staticIPAddress",
                              "staticIP",
                            ].includes(item)
                        )
                      );
                    }
                  }
                }}
              >
                <div
                  className={`w-full h-full flex items-center justify-center ${
                    staticIP ? "scale-100" : "scale-0"
                  } transition-all  text-[10px]  text-[#959595]`}
                >
                  <FontAwesomeIcon icon={faCheck} />
                </div>
              </div>
            </div>
            {staticIP && (
              <div className="flex gap-3">
                <input
                  type="text"
                  name="staticIPAmmount"
                  value={staticIPAmmount}
                  disabled={!formData.userStatus}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (
                      e.target.value.trim() !== editUser.staticIPAmmount.trim()
                    ) {
                      setIsEdited([...isEdited, e.target.name]);
                    } else {
                      setIsEdited(
                        isEdited.filter((item) => item !== "staticIPAmmount")
                      );
                    }
                    if (/^\d*$/.test(value)) {
                      setstaticIPAmmount(value);
                    }
                  }}
                  className="w-full px-3 py-1 font-semibold border rounded h-[33px] text-[12px] focus:outline-none"
                  placeholder="Enter Amount"
                />

                <input
                  type="text"
                  name="staticIPAddress"
                  value={staticIPAddress}
                  disabled={!formData.userStatus}
                  onChange={(e) => {
                    const value = e.target.value;
                    const ipFormatRegex = /^(\d{1,3}(\.\d{0,3}){0,3})?$/;
                    if (
                      e.target.value.trim() !== editUser.staticIPAddress.trim()
                    ) {
                      setIsEdited([...isEdited, e.target.name]);
                    } else {
                      setIsEdited(
                        isEdited.filter((item) => item !== "staticIPAddress")
                      );
                    }
                    // Agar value regex ke pattern se match kare, toh update state karega
                    if (ipFormatRegex.test(value)) {
                      setstaticIPAddress(value);
                    }
                  }}
                  className="w-full px-3 py-1 font-semibold border rounded h-[33px] text-[12px] focus:outline-none"
                  placeholder="Enter Static IP"
                />
              </div>
            )}
          </div>
          {/* User Status */}
          <div className="flex gap-3 mb-4 items-center ">
            <div className="text-gray-700 whitespace-nowrap text-sm font-semibold ">
              User Status :
            </div>
            <div className="flex gap-5">
              <div
                className={`text-center cursor-pointer rounded-sm w-[100px] py-1 px-2 border border-gray-400 ${
                  formData.userStatus
                    ? "bg-[#373737] text-[#e7e7e7]"
                    : "bg-[#e7e7e7] text-[#373737] border"
                }`}
                onClick={() => {
                  if (!editUser.active) {
                    setIsEdited([...isEdited, "active"]);
                  } else {
                    setIsEdited(isEdited.filter((item) => item !== "active"));
                  }
                  setFormData({ ...formData, userStatus: true });
                }}
              >
                Active
              </div>
              <div
                className={`text-center cursor-pointer rounded-sm w-[100px]  py-1 px-2  border-gray-400 ${
                  formData.userStatus
                    ? "bg-[#f3f3f3] text-[#373737] border"
                    : "bg-[#373737] text-[#e7e7e7]"
                }`}
                onClick={() => {
                  if (editUser.active) {
                    setIsEdited(["active"]);
                  } else {
                    setIsEdited(isEdited.filter((item) => item !== "active"));
                  }

                  setFormData({
                    userId: editUser.userId,
                    username: editUser.username,
                    connectionType: editUser.connectionType,
                    port: editUser.port,
                    vlan: editUser.vlan,
                    package: editUser.package,
                    packageRate: editUser.packageRate,
                    amountPaid: editUser.amountPaid,
                    cnicNumber: editUser.cnicNumber,
                    phoneNumber: editUser.phoneNumber,
                    cellNumber: editUser.cellNumber,
                    address: editUser.address,
                    area: editUser.area,
                    userStatus: false,
                  });
                  if (editUser.connectionType === "FTTH") {
                    setShowPortVlan(true);
                  } else {
                    setShowPortVlan(false);
                  }
                  if (editUser.staticIP) {
                    setStaticIP(true);
                    setstaticIPAmmount(editUser.staticIPAmmount);
                    setstaticIPAddress(editUser.staticIPAddress);
                  } else {
                    setStaticIP(false);
                  }
                  setRemark(editUser.remark);
                }}
              >
                Deactive
              </div>
            </div>
          </div>

          {/* Package Rate Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Package Rate
            </label>
            <input
              type="text"
              name="packageRate"
              disabled={!formData.userStatus}
              value={formData.packageRate}
              onChange={handleInputChange}
              onInput={handleNumberInput}
              className={`w-full px-3 py-1 font-semibold border rounded h-[33px] text-[12px] focus:outline-none ${
                errors.packageRate
                  ? "border-red-500 text-red-500 placeholder-red-500"
                  : "focus:border-blue-300"
              }`}
              placeholder="Enter Package Rate"
            />
            {errors.packageRate && (
              <p className="text-red-500 text-[11px]">{errors.packageRate}</p>
            )}
          </div>

          {/* Amount Paid Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Amount Paid
            </label>
            <input
              type="text"
              name="amountPaid"
              disabled={!formData.userStatus}
              value={formData.amountPaid}
              onChange={handleInputChange}
              onInput={handleNumberInput}
              className={`w-full px-3 py-1 font-semibold border rounded h-[33px] text-[12px] focus:outline-none ${
                errors.amountPaid
                  ? "border-red-500 text-red-500 placeholder-red-500"
                  : "focus:border-blue-300"
              }`}
              placeholder="Enter Amount Paid"
            />
            {errors.amountPaid && (
              <p className="text-red-500 text-[11px]">{errors.amountPaid}</p>
            )}
          </div>

          {/* CnIC Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              CNIC Number
            </label>
            <input
              type="text"
              name="cnicNumber"
              value={formData.cnicNumber}
              disabled={!formData.userStatus}
              onChange={handleInputChange}
              className={`w-full px-3 py-1 font-semibold border rounded h-[33px] text-[12px] focus:outline-none ${
                errors.cnicNumber
                  ? "border-red-500 text-red-500 placeholder-red-500"
                  : "focus:border-blue-300"
              }`}
              placeholder="Enter CNIC Number"
            />
            {errors.cnicNumber && (
              <p className="text-red-500 text-[11px]">{errors.cnicNumber}</p>
            )}
          </div>

          {/* Phone Number Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              disabled={!formData.userStatus}
              className={`w-full px-3 py-1 font-semibold border rounded h-[33px] text-[12px] focus:outline-none ${
                errors.phoneNumber
                  ? "border-red-500 text-red-500 placeholder-red-500"
                  : "focus:border-blue-300"
              }`}
              placeholder="Enter Phone Number"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-[11px]">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Cell Number Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Cell Number
            </label>
            <input
              type="text"
              name="cellNumber"
              value={formData.cellNumber}
              onChange={handleInputChange}
              disabled={!formData.userStatus}
              className={`w-full px-3 py-1 font-semibold border rounded h-[33px] text-[12px] focus:outline-none ${
                errors.cellNumber
                  ? "border-red-500 text-red-500 placeholder-red-500"
                  : "focus:border-blue-300"
              }`}
              placeholder="Enter Cell Number"
            />
            {errors.cellNumber && (
              <p className="text-red-500 text-[11px]">{errors.cellNumber}</p>
            )}
          </div>

          {/* Address Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={!formData.userStatus}
              className={`w-full px-3 py-1 font-semibold border rounded h-[33px] text-[12px] focus:outline-none ${
                errors.address
                  ? "border-red-500 text-red-500 placeholder-red-500"
                  : "focus:border-blue-300"
              }`}
              placeholder="Enter Address"
            />
            {errors.address && (
              <p className="text-red-500 text-[11px]">{errors.address}</p>
            )}
          </div>

          {/* Area Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Area
            </label>
            <select
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              disabled={!formData.userStatus}
              className={`w-full px-3 py-1 font-semibold border rounded h-[33px] text-[12px] focus:outline-none ${
                errors.area ? "border-red-500" : "focus:border-blue-300"
              }`}
            >
              <option value="">Select Area</option>
              {areas &&
                areas.map((a, i) => {
                  return (
                    <option key={i} value={a.areaname}>
                      {a.areaname}
                    </option>
                  );
                })}
            </select>
            {errors.area && (
              <p className="text-red-500 text-[11px]">{errors.area}</p>
            )}
          </div>

          {/* Remark Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Remark
            </label>
            <textarea
              type="text"
              name="remark"
              value={remark}
              disabled={!formData.userStatus}
              onChange={(e) => {
                setRemark(e.target.value);
                if (e.target.value.trim() !== editUser.remark.trim()) {
                  setIsEdited([...isEdited, e.target.name]);
                } else {
                  setIsEdited(
                    isEdited.filter((item) => item !== e.target.name)
                  );
                }
              }}
              className={`w-full px-3 py-2 border rounded  focus:outline-none 
                  `}
              placeholder="Enter Remark"
            />
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className={`w-full ${
              isEdited.length === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#323232d3] "
            } flex items-center justify-center gap-3 py-2 shadow-inner shadow-slate-500 bg-[#434343] text-white font-bold rounded  transition-all`}
          >
            Save {isLoading && <div className="loader1-spin"></div>}
          </button>
        </div>
      )}
    </GlobalDashboardPage>
  );
};

export default EditUser;
