import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import SelectAddress from "./SelectAddress";
import NavigationBar from "./NavigationBar";
import { API_BASE_URL } from "../config";

const LabourSideBar = ({ responsedata, setresponsedata }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");

  const showAlert = (message, type = "error") => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => setAlertMessage(""), 3000);
  };

  const [filters, setFilters] = useState({
    workType: "",
    otherWork: "",
    minimumExp: "",
    wagePerDay: "",
    wagePerHour: "",
    selectedState: "",
    selectedDistrict: "",
    selectedVillage: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleLocationChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    senddata();
    setIsOpen(false);
  };

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line
  }, []);

  async function senddata() {

    try {
      const response = await fetch(`${API_BASE_URL}/search/v2/search_labour/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const data = await response.json();
      setresponsedata(data.labourListings);
      showAlert("Filters applied successfully!", "success");
    } catch (error) {
      if (error.name === "TypeError") {
        console.log("Network error:", error.message);
        showAlert("Network Connection failed", "error");
      } else {
        console.log("Other error:", error.message);
        showAlert("Something went wrong", "error");
      }
    }
  }

  const inputClass = "text-white flex flex-col text-base";
  const placeholder = "bg-white text-black rounded-xl border-gray-800 border-2 w-full";

  return (
    <>
      <NavigationBar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="mt-16"></div>

      {alertMessage && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
          <div
            className={`p-4 rounded-lg font-medium shadow-lg max-w-sm w-full text-center ${alertType === "error"
                ? "bg-red-200 text-red-800 border-l-4 border-red-500"
                : "bg-green-200 text-green-800 border-l-4 border-green-500"
              }`}
          >
            {alertMessage}
          </div>
        </div>
      )}

      <div
        className={`fixed top-16 left-0 w-72 min-h-full bg-green-700 text-white p-4 transition-transform border-t border-white z-30 ${isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 text-white"
        >
          <X size={24} className="mt-3" />
        </button>

        <h2 className="text-lg font-bold">Apply Filters</h2>

        <div className="mt-4">
          <label className="block">Select Location</label>
          <SelectAddress
            selectedState={filters.selectedState}
            setSelectedState={(value) => handleLocationChange("selectedState", value)}
            selectedDistrict={filters.selectedDistrict}
            setSelectedDistrict={(value) => handleLocationChange("selectedDistrict", value)}
            selectedVillage={filters.selectedVillage}
            setSelectedVillage={(value) => handleLocationChange("selectedVillage", value)}
            className={inputClass}
            placeholder={placeholder}
          />
        </div>

        <div className="mt-4">
          <label className="text-white">Work Type</label>
          <select
            name="workType"
            value={filters.workType}
            onChange={handleFilterChange}
            className="bg-white text-black rounded-xl border-gray-800 border-2 w-full"
          >
            <option value="">Select Work Type</option>
            <option value="Ploughing">Ploughing</option>
            <option value="Sowing">Sowing</option>
            <option value="Weeding">Weeding</option>
            <option value="Harvesting">Harvesting</option>
            <option value="Irrigation">Irrigation</option>
            <option value="Threshing">Threshing</option>
            <option value="Fertilizer Spraying">Fertilizer Spraying</option>
            <option value="Pesticide Spraying">Pesticide Spraying</option>
            <option value="Crop Transportation">Crop Transportation</option>
            <option value="Cattle Rearing">Cattle Rearing</option>
            <option value="Seed Treatment">Seed Treatment</option>
            <option value="Land Leveling">Land Leveling</option>
            <option value="Drip Irrigation Setup">Drip Irrigation Setup</option>
            <option value="Organic Farming">Organic Farming</option>
            <option value="Vermicomposting">Vermicomposting</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {filters.workType === "Other" && (
          <div className="mt-4">
            <label className="block">Specify Other Work:</label>
            <input
              type="text"
              name="otherWork"
              value={filters.otherWork}
              onChange={handleFilterChange}
              className="bg-white text-black rounded-xl border-gray-800 border-2 w-full"
              placeholder="Enter work name"
            />
          </div>
        )}

        <div className="mt-4">
          <label className="text-white">Enter Minimum Experience</label>
          <input
            type="text"
            name="minimumExp"
            value={filters.minimumExp}
            onChange={handleFilterChange}
            className="bg-white text-black rounded-xl border-gray-800 border-2 w-full"
          />
        </div>

        <div className="mt-2">
          <label className="block">Wage per Day (₹)</label>
          <input
            type="number"
            name="wagePerDay"
            value={filters.wagePerDay}
            onChange={handleFilterChange}
            className="bg-white text-black rounded-xl border-gray-800 border-2 w-full"
          />
        </div>

        <div className="mt-2">
          <label className="block">Wage per Hour (₹)</label>
          <input
            type="number"
            name="wagePerHour"
            value={filters.wagePerHour}
            onChange={handleFilterChange}
            className="bg-white text-black rounded-xl border-gray-800 border-2 w-full"
          />
        </div>

        <button
          onClick={applyFilters}
          className="mt-4 w-full p-2 bg-green-950 text-white rounded"
        >
          Apply Filter
        </button>
      </div>
    </>
  );
};

export default LabourSideBar;