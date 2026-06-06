import React, { useState } from "react";
import machine_data from "../Addressjsondata/machine_data.json";
import SelectTractor from "./SelectTractor";

function SelectMachine({ purpose, setPurpose,
  machineName, setMachineName, className = "", placeholder = "" }) {
  const [machineList,
    setMachineList] = useState([]);



  // Handle Purpose Selection
  const handlePurposeChange = (e) => {
    const selectedPurpose = e.target.value;
    setPurpose(selectedPurpose);  // Update parent state
    setMachineList(""); // Reset machine selection
    setMachineList(machine_data[selectedPurpose] || []); // Load machines based on purpose
  };

  return (
    <>
      <div className={` ${className} `}>
        <label className="font-semibold block mb-1">Select Purpose of Machine:</label>
        <select onChange={handlePurposeChange} value={purpose} className={placeholder} >
          <option value="">Select Purpose</option>
          {Object.keys(machine_data).map((purposeName, index) => (
            <option key={index} value={purposeName}>{purposeName}</option>
          ))}
        </select>
      </div>
      <div className={` ${className} `}>
        <label className="block mt-4">Machine Name:</label>
        <select
          onChange={(e) => setMachineName(e.target.value)}
          value={machineName || ""}
          className={placeholder}
          disabled={!purpose} // Disable machine selection if no purpose is selected
        >
          <option value="">Select Machine</option>

          {machineList && Array.isArray(machineList) ? (
            machineList.map((machine, index) => (
              <option key={index} value={machine}>{machine}</option>
            ))
          ) : null}
        </select>
      </div>
    </>
  );
}

export default SelectMachine; 