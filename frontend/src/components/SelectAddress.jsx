import React, { useState } from "react";
import jsonData from "../Addressjsondata/address_data.json"; // Import JSON file

function SelectAddress({ selectedState, setSelectedState, selectedDistrict, setSelectedDistrict, selectedVillage, setSelectedVillage, className = "", placeholder = "", districtClass = "", villageClass = "" }) {
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);


  // Handle State Selection
  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setSelectedDistrict(""); // Reset district
    setVillages([]); // Reset villages
    setDistricts(Object.keys(jsonData[state] || {})); // Get districts
  };

  // Handle District Selection
  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setSelectedDistrict(district);
    setVillages(jsonData[selectedState]?.[district] || []);
  };

  return (
    <>

      <div className={` ${className} `}>
        <label className="font-semibold block mb-1">Select State</label>
        <select onChange={handleStateChange} value={selectedState} className={placeholder}>
          <option value="">Select State</option>
          {Object.keys(jsonData).map((state, index) => (
            <option key={index} value={state}>{state}</option>
          ))}
        </select>
      </div>

      <div className={` ${className} ${districtClass} `}>
        <label className="font-semibold block mb-1">Select District</label>
        <select onChange={handleDistrictChange} value={selectedDistrict} disabled={!selectedState} className={`${placeholder} ${districtClass} `}>
          <option value="">Select District</option>
          {districts.map((district, index) => (
            <option key={index} value={district}>{district}</option>
          ))}
        </select>
      </div>

      <div className={` ${className} ${villageClass} `}>
        <label className="font-semibold block mb-1">Select Village</label>
        <select onChange={(e) => setSelectedVillage(e.target.value)} value={selectedVillage} disabled={!selectedDistrict} className={`${placeholder} ${villageClass} `}>
          <option value="">Select Village</option>
          {villages.map((village, index) => (
            <option key={index} value={village}>{village}</option>
          ))}
        </select>
      </div>

    </>
  );
}

export default SelectAddress;
