import Cookie from "js-cookie";

export const Server_url = process.env.REACT_APP_SERVER_URL;

export const Get_Token = () => Cookie.get("local_fcd43r4g5s3pty5____tkn");

export const Set_Token = (token) => {
  Cookie.set("local_fcd43r4g5s3pty5____tkn", token, { expires: 60 });
};

export const Remove_Token = () => {
  Cookie.remove("local_fcd43r4g5s3pty5____tkn");
};

export const formatDate = (createdAt) => {
  const date = new Date(createdAt);

  const formattedDate = date.toLocaleDateString("en-GB");

  return formattedDate;
};

export const formatDateMonthFull = (createdAt) => {
  const date = new Date(createdAt);

  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return formattedDate;
};

export const ammountPaidUpdate = (lastData, newData) => {
  let statements = [];

  let totalSaleAmount = 0;
  let advanceBalancedAmount = 0;
  let balancedAmount = 0;

  let date = new Date();

  let lastBalancedAmmount = lastData.balancedAmount || 0;

  let lastAmountPaid = lastData.amountPaid;
  let newAmountPaid = newData.amountPaid;
  let totalAmountPaidChange = newAmountPaid - lastAmountPaid;

  // Statement Create

  let state = {
    date,
    type: "AmmountPaid",
    lastAmountPaid: parseFloat(lastAmountPaid || 0),
    newAmountPaid: parseFloat(newAmountPaid || 0),
    totalAmountPaidChange: totalAmountPaidChange,
  };
  statements.push(state);

  if (totalAmountPaidChange > 0) {
    totalSaleAmount += totalAmountPaidChange;
    balancedAmount += -totalAmountPaidChange;
  } else {
    balancedAmount += Math.abs(totalAmountPaidChange);
    totalSaleAmount += totalAmountPaidChange;
  }

  if (balancedAmount > 0) {
    if (lastBalancedAmmount < 0) {
      if (balancedAmount <= Math.abs(lastBalancedAmmount)) {
        advanceBalancedAmount += -balancedAmount;
        balancedAmount = 0;
      } else {
        advanceBalancedAmount = lastBalancedAmmount;
        balancedAmount = balancedAmount - Math.abs(lastBalancedAmmount);
      }
    }
  } else {
    if (lastBalancedAmmount > 0) {
      if (Math.abs(balancedAmount) >= lastBalancedAmmount) {
        advanceBalancedAmount += Math.abs(balancedAmount) - lastBalancedAmmount;
        balancedAmount = -lastBalancedAmmount;
      }
    } else {
      advanceBalancedAmount += Math.abs(balancedAmount);
      balancedAmount = 0;
    }
  }

  return { statements, totalSaleAmount, advanceBalancedAmount, balancedAmount };
};

export const createStatements = (lastData, newData, editField) => {
  //  Date Create
  let date = new Date();

  let lastBalancedAmmount = lastData.balancedAmount || 0;

  // Statement Array
  let statements = [];

  let totalSaleAmount = 0;
  let advanceBalancedAmount = 0;
  let balancedAmount = 0;

  // Package Rate Cahange
  editField.forEach((fieldName) => {
    if (fieldName === "packageRate") {
      let lastPackageRate = lastData.packageRate;
      let newPackageRate = newData.packageRate;
      let totalpackageRateChange = newPackageRate - lastPackageRate;

      // Statement Create
      let state = {
        date,
        type: "PackageRate",
        lastPackageRate: parseFloat(lastPackageRate || 0),
        newPackageRate: parseFloat(newPackageRate || 0),
        totalpackageRateChange: totalpackageRateChange,
      };
      statements.push(state);

      balancedAmount += totalpackageRateChange;
    } else if (fieldName === "amountPaid") {
      let lastAmountPaid = lastData.amountPaid;
      let newAmountPaid = newData.amountPaid;
      let totalAmountPaidChange = newAmountPaid - lastAmountPaid;

      // Statement Create

      let state = {
        date,
        type: "AmmountPaid",
        lastAmountPaid: parseFloat(lastAmountPaid || 0),
        newAmountPaid: parseFloat(newAmountPaid || 0),
        totalAmountPaidChange: totalAmountPaidChange,
      };
      statements.push(state);

      if (totalAmountPaidChange > 0) {
        totalSaleAmount += totalAmountPaidChange;
        balancedAmount += -totalAmountPaidChange;
      } else {
        balancedAmount += Math.abs(totalAmountPaidChange);
        totalSaleAmount += totalAmountPaidChange;
      }
    } else if (fieldName === "staticIPAmmount") {
      let lastStaticIPAmmount = lastData.staticIPAmmount || 0;
      let newStaticIPAmmount = newData.staticIPAmmount || 0;
      let totalStaticIPAmountRateChange =
        newStaticIPAmmount - lastStaticIPAmmount;

      // Statement Create
      let state = {
        date,
        type: "StaticIPAmmount",
        lastStaticIPAmmount: parseFloat(lastStaticIPAmmount || 0),
        newStaticIPAmmount: parseFloat(newStaticIPAmmount || 0),
        totalStaticIPAmountRateChange: totalStaticIPAmountRateChange,
      };
      statements.push(state);
      balancedAmount += totalStaticIPAmountRateChange;
    } else if (fieldName === "active") {
      // Statement Create
      let state = {
        date,
        type: "UserStatus",
        lastUserStatus: lastData.active,
        newUserStatus: newData.userStatus,
      };
      statements.push(state);
    }
  });

  // console.log("==============brefore======================");
  // console.log("balancedAmount ", balancedAmount);
  // console.log("totalSaleAmount ", totalSaleAmount);
  // console.log("advanceBalancedAmount  ", advanceBalancedAmount);
  // console.log("===================brefore=================");

  if (balancedAmount > 0) {
    if (lastBalancedAmmount < 0) {
      if (balancedAmount <= Math.abs(lastBalancedAmmount)) {
        advanceBalancedAmount += -balancedAmount;
        balancedAmount = 0;
      } else {
        advanceBalancedAmount = lastBalancedAmmount;
        balancedAmount = balancedAmount - Math.abs(lastBalancedAmmount);
      }
    }
  } else {
    if (lastBalancedAmmount > 0) {
      if (Math.abs(balancedAmount) >= lastBalancedAmmount) {
        advanceBalancedAmount += Math.abs(balancedAmount) - lastBalancedAmmount;
        balancedAmount = -lastBalancedAmmount;
      }
    } else {
      advanceBalancedAmount += Math.abs(balancedAmount);
      balancedAmount = 0;
    }
  }

  // console.log("============After========================");
  // console.log("Statement", statements);
  // console.log("Total Sale Amount", totalSaleAmount);
  // console.log("Advance Balanced Amount", advanceBalancedAmount);
  // console.log("Balanced Amount", balancedAmount);
  // console.log("=============After=======================");

  return { statements, totalSaleAmount, advanceBalancedAmount, balancedAmount };
};
