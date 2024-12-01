import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import GlobalDashboardPage from "../components/GlobalDashboardPage";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { getFormDataApi } from "../store/Reducers/formData";
import { addUserApi } from "../store/Reducers/users";
import ContentHeader from "../components/Header";

const AddUsers = () => {
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
    active: true,
  });

  const dispatch = useDispatch();

  const { areas, packages } = useSelector((state) => state.formData);
  const { addUserSuccess, isLoading } = useSelector((state) => state.users);

  useEffect(() => {
    if (areas === null || packages === null) {
      dispatch(getFormDataApi());
    }
  }, [areas, dispatch, packages]);

  const [errors, setErrors] = useState({});
  const [remark, setRemark] = useState("");
  const [showPortVlan, setShowPortVlan] = useState(false);
  const [staticIP, setStaticIP] = useState(false);
  const [staticIPAmmount, setstaticIPAmmount] = useState("");
  const [staticIPAddress, setstaticIPAddress] = useState("");
  const formRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "connectionType" && value === "FTTH") {
      setShowPortVlan(true);
    } else if (name === "connectionType") {
      setShowPortVlan(false);
    }

    // Clear errors when the field changes
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: null,
    }));
  };

  const validate = () => {
    let validationErrors = {};
    Object.keys(formData).forEach((key) => {
      if (
        !formData[key] &&
        key !== "port" &&
        key !== "vlan" &&
        key !== "cellNumber"
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
    setErrors({});
    if (addUserSuccess) {
      setFormData({
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
      });
      setStaticIP(false);
      setstaticIPAddress("");
      setstaticIPAmmount("");
      setRemark("");
    }
  }, [addUserSuccess, dispatch]);

  const handleSubmit = (e) => {
    if (isLoading) {
      return;
    }

    e.preventDefault();
    if (validate()) {
      let data = { ...formData, staticIP, remark };
      if (staticIP) {
        data = { ...data, staticIPAddress, staticIPAmmount };
      }
      console.log("Form Data:", data);
      dispatch(addUserApi(data));
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
    <GlobalDashboardPage targetTab={"addUser"}>
      <ContentHeader title={"Add New User"} />
      <div
        ref={formRef}
        className="p-6 my-3 max-w-[380px] mx-auto bg-white rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-center mb-4">User Form</h2>

        {/* User ID Field */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            User ID
          </label>
          <input
            type="text"
            name="userId"
            value={formData.userId}
            onChange={handleInputChange}
            onInput={handleNumberInput}
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
            value={formData.connectionType}
            onChange={handleInputChange}
            className={`w-full px-3 py-1 font-semibold border rounded h-[33px] text-[12px] focus:outline-none ${
              errors.connectionType ? "border-red-500" : "focus:border-blue-300"
            }`}
          >
            <option value="">Select Connection Type</option>
            <option value="FTTH">FTTH</option>
            <option value="UDP">UDP</option>
            <option value="Wireless">Wireless</option>
          </select>
          {errors.connectionType && (
            <p className="text-red-500 text-[11px]">{errors.connectionType}</p>
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
            onChange={handleInputChange}
            className={`w-full px-3 py-1 font-semibold border rounded h-[33px] text-[12px] focus:outline-none ${
              errors.package ? "border-red-500" : "focus:border-blue-300"
            }`}
          >
            <option value="">Select Package</option>
            {packages &&
              packages.map((a, i) => {
                return (
                  <option key={i} value={a.name.replace(/MB/gi , "mb")}>
                    {a.name.replace(/MB/gi , "mb")}
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
            <div className="text-gray-700 whitespace-nowrap text-sm font-semibold ">
              Static IP{" "}
            </div>
            <div
              className="w-[15px] h-[15px] border border-gray-700 cursor-pointer rounded-sm"
              onClick={() => setStaticIP((prev) => !prev)}
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
                onChange={(e) => {
                  const value = e.target.value;
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
                onChange={(e) => {
                  const value = e.target.value;
                  // Regex to allow numbers and multiple dots (but not two consecutive dots)
                  const ipFormatRegex = /^(\d{1,3}(\.\d{0,3}){0,3})?$/;

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

        {/* Package Rate Field */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Package Rate
          </label>
          <input
            type="text"
            name="packageRate"
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
            className={`w-full px-3 py-1 font-semibold border rounded h-[33px] text-[12px] focus:outline-none ${
              errors.area ? "border-red-500" : "focus:border-blue-300"
            }`}
          >
            <option value="">Select Area</option>
            {areas &&
              areas.map((a, i) => {
                return (
                  <option key={i} value={a.name}>
                    {a.name}
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
            onChange={(e) => setRemark(e.target.value)}
            className={`w-full px-3 py-2 border rounded text-xs min-h-[100px] font-semibold  focus:outline-none 
              `}
            placeholder="Enter Remark"
          />
        </div>

        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full flex items-center justify-center gap-3 py-2 shadow-inner shadow-slate-500 bg-[#434343] text-white font-bold rounded hover:bg-[#323232d3] transition-all"
        >
          Submit {isLoading && <div className="loader1-spin"></div>}
        </button>
      </div>
    </GlobalDashboardPage>
  );
};

export default AddUsers;
