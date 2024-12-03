import React, { useEffect, useState } from "react";
import GlobalDashboardPage from "../components/GlobalDashboardPage";
import ContentHeader from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getFormDataApi, addAreaApi, addPackageApi } from "../store/Reducers/formData";

const UpdateForm = () => {
  const {
    areaLoading,
    areas,
    areaSuccess,
    packageLoading,
    packageSuccess,
    packages,
  } = useSelector((state) => state.formData);
  const dispatch = useDispatch();
  const [area, setArea] = useState("");
  const [packageVal, setPackageVal] = useState("");

  useEffect(() => {
    if (areaSuccess) {
      setArea("");
    }
  }, [areaSuccess]);

  useEffect(() => {
    if (packageSuccess) {
      setPackageVal("");
    }
  }, [packageSuccess]);

  useEffect(() => {
    if (areas === null) {
      dispatch(getFormDataApi());
    }
  }, [areas, dispatch]);

  const handleAddArea = () => {
    if (areaLoading) {
      toast.error("Please wait for Adding Area");
    } else {
      if (area) {
        dispatch(addAreaApi({ name: area }));
      } else {
        toast.error("Please Enter Area Name");
      }
    }
  };

  const handleAddPackage = () => {
    if (packageLoading) {
      toast.error("Please wait for Adding Package");
    } else {
      if (packageVal) {
        dispatch(addPackageApi({ name: packageVal }));
      } else {
        toast.error("Please Enter Package Name");
      }
    }
  };

  return (
    <GlobalDashboardPage targetTab={"update-form"}>
      <ContentHeader title={"Update Form"} />
      <div className="py-5 flex gap-3 px-3">
        {areas ? (
          <div className="w-[calc(100%-300px)] mb-2 p-5 bg-white shadow-xl rounded-md">
            {areas.length > 0 ? (
              areas.map((a, i) => {
                return (
                  <div
                    key={i}
                    className="w-fit px-3 py-1 border border-[#ccc] rounded-md mb-3"
                  >
                    {a.name}
                  </div>
                );
              })
            ) : (
              <div className="w-full h-full flex items-center justify-center font-light font-mono">
                No Area Please Add Area then Show Area here{" "}
              </div>
            )}
          </div>
        ) : (
          <div className="w-[calc(100%-300px)] mb-5 p-5 bg-white shadow-xl rounded-md">
            <div className="w-full h-full flex items-center justify-center font-light font-mono">
              Loading Areas...
            </div>
          </div>
        )}

        <div className="w-[300px] mb-5 p-5 bg-white shadow-xl rounded-md">
          <h2 className="text-[#353535] font-semibold mb-3 text-xl">
            Add New Area
          </h2>
          <input
            type="text"
            placeholder="Enter Area Name"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full px-3 py-2 mb-5 rounded-md  border border-gray-300 focus:outline-none focus:border-gray-400"
          />
          <button
            className="w-full px-3 py-2 bg-[#3a3a3a] text-white rounded-md hover:bg-[#2c2c2c] transition-all "
            onClick={handleAddArea}
          >
            {areaLoading ? "Adding Area..." : "Add Area"}
          </button>
        </div>
      </div>
      <div className="py-5 flex gap-3 px-3">
        {areas ? (
          <div className="w-[calc(100%-300px)] mb-1 p-5 bg-white shadow-xl rounded-md">
            {packages.length > 0 ? (
              packages.map((a, i) => {
                return (
                  <div
                    key={i}
                    className="w-fit px-3 py-1 border border-[#ccc] rounded-md mb-3"
                  >
                    {a.name}
                  </div>
                );
              })
            ) : (
              <div className="w-full h-full flex items-center justify-center font-light font-mono">
                No Package Please Add Package then Show Package here{" "}
              </div>
            )}
          </div>
        ) : (
          <div className="w-[calc(100%-300px)] mb-5 p-5 bg-white shadow-xl rounded-md">
            <div className="w-full h-full flex items-center justify-center font-light font-mono">
              Loading Packages...
            </div>
          </div>
        )}

        <div className="w-[300px] mb-5 p-5 bg-white shadow-xl rounded-md">
          <h2 className="text-[#353535] font-semibold mb-3 text-xl">
            Add New Package
          </h2>
          <input
            type="text"
            placeholder="Enter Package Name"
            value={packageVal}
            onChange={(e) => setPackageVal(e.target.value)}
            className="w-full px-3 py-2 mb-5 rounded-md  border border-gray-300 focus:outline-none focus:border-gray-400"
          />
          <button
            className="w-full px-3 py-2 bg-[#3a3a3a] text-white rounded-md hover:bg-[#2c2c2c] transition-all "
            onClick={handleAddPackage}
          >
            {packageLoading? "Adding Package..." : "Add Package"}
          </button>
        </div>
      </div>
    </GlobalDashboardPage>
  );
};

export default UpdateForm;
