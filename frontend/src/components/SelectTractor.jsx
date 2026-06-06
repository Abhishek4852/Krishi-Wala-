import React, { useState } from "react";
import tractor_data from "../Addressjsondata/tractor_data.json"

function SelectTractor({ brand, setBrand, tractorModel, setTractorModel, className = "", placeholder = "" }) {
  const [tractorList, setTractorList] = useState([]);

  // Handle Brand Selection
  const handleBrandChange = (e) => {
    const selectedBrand = e.target.value;
    setBrand(selectedBrand); // Update parent state
    setTractorList(tractor_data[selectedBrand] || []); // Load models based on brand
    setTractorModel(""); // Reset model selection
  };

  return (
    <>

      <div className={` ${className} `}>

        <select
          onChange={handleBrandChange}
          value={brand}
          className={placeholder}
        >
          <option value="">Select Brand</option>
          {Object.keys(tractor_data).map((brandName, index) => (
            <option key={index} value={brandName}>{brandName}</option>
          ))}
        </select>
      </div>
      <div className={` ${className} `}>
        <label className="block mt-4">Tractor Model:</label>
        <select
          onChange={(e) => setTractorModel(e.target.value)}
          value={tractorModel || ""}
          className={placeholder}
          disabled={!brand} // Disable model selection if no brand is selected
        >
          <option value="">Select Model</option>
          {tractorList.map((model, index) => (
            <option key={index} value={model}>{model}</option>
          ))}
        </select>
      </div>

    </>
  );
}

export default SelectTractor;
