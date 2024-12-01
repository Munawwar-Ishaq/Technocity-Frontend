import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadExcelData } from "../store/Reducers/uploadfile";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import GlobalDashboardPage from "../components/GlobalDashboardPage";
import ContentHeader from "../components/Header";
import { useDropzone } from "react-dropzone";

const UploadFileComponent = () => {
  const [file, setFile] = useState(null);
  const [recordCount, setRecordCount] = useState(0);
  const dispatch = useDispatch();
  const {
    progress,
    responseMessage,
    uploadedDataCount,
    skippedRecords,
    isLoading,
  } = useSelector((state) => state.uploadFile);

  const handleFileSelection = (file) => {
    if (file) {
      const fileMimeType = file.type.toLowerCase();
      console.log("Detected MIME type: ", fileMimeType);
      if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        const validMimeTypes = [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
          "application/xls",
        ];
  
        if (!validMimeTypes.includes(fileMimeType)) {
          toast.error("Invalid MIME type. Please upload a valid Excel file.");
          return;
        }
        setFile(file);
        parseExcelFile(file);
      } else {
        toast.error("Please upload a valid Excel file (.xlsx or .xls).");
      }
    }
  };

  const onDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    const fileMimeType = selectedFile.type;

    if (fileMimeType !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && fileMimeType !== "application/vnd.ms-excel") {
      toast.error("Invalid MIME type. Please upload a valid Excel file.");
      return;
    }

    handleFileSelection(selectedFile);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".xlsx,.xls",
  });

  const parseExcelFile = (selectedFile) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = reader.result;
        const workbook = XLSX.read(new Uint8Array(data), { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const [, ...dataWithoutHeader] = jsonData;
        setRecordCount(dataWithoutHeader.length); // Set record count (excluding header)
      } catch (error) {
        toast.error("Error reading the Excel file. Please ensure it's a valid format.");
        console.error("File parsing error:", error);
      }
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleUpload = () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = reader.result;
        const workbook = XLSX.read(new Uint8Array(data), { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const [, ...dataWithoutHeader] = jsonData;
        if (dataWithoutHeader.length === 0) {
          toast.error("No records found in the file.");
          return;
        }

        const formattedData = dataWithoutHeader.map((row) => ({
          userId: row[0],
          username: row[1],
          connectionType: row[2],
          port: row[3] || "",
          vlan: row[4] || "",
          package: row[5],
          packageRate: row[6],
          amountPaid: row[7],
          cnicNumber: row[8],
          phoneNumber: row[9],
          cellNumber: row[10],
          address: row[11],
          area: row[12],
          staticIP: row[13] === "true" ? true : false,
          staticIPAmmount: row[14] || "",
          staticIPAddress: row[15] || "",
          remark: row[16] || "",
          lastMonthDue: row[17] || "",
          active: row[18] !== undefined ? row[18] === "true" ? true : false : true,
        }));
        
        dispatch(uploadExcelData(formattedData));
      } catch (error) {
        toast.error("Error processing the file. Please try again.");
        console.error("File processing error:", error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <GlobalDashboardPage targetTab={"upload-files"}>
      <ContentHeader title={"Upload File"} />

      <div className="max-w-4xl w-[90%] mt-10 mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Upload Excel File
        </h2>

        {/* Drag and Drop Area */}
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-blue-500 p-8 rounded-md text-center cursor-pointer mb-6 hover:bg-blue-50"
        >
          <input {...getInputProps()} />
          <p className="text-lg text-gray-600">
            Drag & Drop your Excel file here or click to select
          </p>
        </div>

        {/* File Selection Info */}
        {file && (
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
            <p className="text-gray-800">
              <strong>File Name:</strong> {file.name}
            </p>
            <p className="text-gray-800">
              <strong>Total Records:</strong> {recordCount}
            </p>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={isLoading}
          className={`w-full py-2 px-4 text-white font-semibold rounded-md ${
            isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          } mb-6`}
        >
          {isLoading ? "Uploading..." : "Upload File"}
        </button>

        {/* Progress Bar */}
        {isLoading && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">Uploading: {progress}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                style={{ width: `${progress}%` }}
                className="bg-green-500 h-2 rounded-full"
              />
            </div>
          </div>
        )}

        {/* Response Message and Skipped Records */}
        {responseMessage && (
          <div
            className={`p-4 mt-4 rounded-md ${
              responseMessage === "Upload successful!"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <p>{responseMessage}</p>
            {uploadedDataCount > 0 && <p>{uploadedDataCount} records uploaded successfully.</p>}
            {skippedRecords > 0 && <p>{skippedRecords} records skipped due to existing entries.</p>}
          </div>
        )}
      </div>
    </GlobalDashboardPage>
  );
};

export default UploadFileComponent;
