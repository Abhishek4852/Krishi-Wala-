import { useState } from "react";

function BankDetails({ name, setName, bankName, setBankName, accountNo, setAccountNo, IFSC, setIFSC,className="",placeholder=""}) {
  const [showFields, setShowFields] = useState(false);
  return (
    <div className={`flex flex-col text-base ${className}`}>
    <button
      type="button"
      onClick={() => setShowFields(!showFields)}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition w-fit"
    >
      {showFields ? "Hide Bank Details" : "Add Bank Details"}
    </button>

    {showFields && (
      <div className="mt-4 space-y-5">
        <label className="font-semibold"> Account Holder Name</label>
        <input
          type="text"
          className={placeholder}
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder="Enter Account Holder Name"
        />
        
        <label className="font-semibold"> Set Bank Name</label>
        <input
          type="text"
          className={placeholder}
          onChange={(e) => setBankName(e.target.value)}
          value={bankName}
          placeholder="Enter Bank Name"
        />
        
        <label className="font-semibold"> Set Account Number</label>
        <input
          type="number"
          className={placeholder}
          onChange={(e) => setAccountNo(e.target.value)}
          value={accountNo}
          placeholder="Enter Account No."
        />


      <label className="font-semibold"> Enter  IFSC  Code</label>
        <input
          type="text"
          className={placeholder}
          onChange={(e) => setIFSC(e.target.value)}
          value={IFSC}
          placeholder="Enter IFSC Code"
        />
      </div>
    )}
  </div>
  

  );
}

export default BankDetails;
