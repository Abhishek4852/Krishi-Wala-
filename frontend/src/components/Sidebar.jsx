import { useState } from "react";
import { Menu, X } from "lucide-react";
import SelectAddress from "./SelectAddress";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    size: "",
    pricePerAcre: "",
    period: "",
    irrigationSource: [],
  });
  const [selectedState, setSelectedState] = useState(""),
    [selectedDistrict, setSelectedDistrict] = useState(""),
    [selectedVillage, setSelectedVillage] = useState("");

  const sizes = [
      "Less than 1 acre",
      "Less than 5 acres",
      "Less than 10 acres",
      "Less than 20 acres",
      "Less than 50 acres",
      "Maximum",
    ],
    irrigationOptions = ["River", "Borewell", "Canal"];

  const handleFilterChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });
  const handleCheckboxChange = (source) =>
    setFilters((prev) => ({
      ...prev,
      irrigationSource: prev.irrigationSource.includes(source)
        ? prev.irrigationSource.filter((item) => item !== source)
        : [...prev.irrigationSource, source],
    }));
  const applyFilters = () => {
    console.log("Applied Filters:", filters);
    setIsOpen(false);
  };

  return (
    <div>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 p-2 bg-blue-600 text-white rounded"
        >
          {" "}
          <Menu size={24} /> Apply Filter{" "}
        </button>
      )}

      <div
        className={`fixed top-0 left-0 w-64 h-full bg-gray-800 text-white p-4 transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 text-white"
        >
          {" "}
          <X size={24} />{" "}
        </button>
        <h2 className="text-lg font-bold">Apply Filters</h2>

        <div className="mt-4">
          <label className="block">Select Location</label>
          <SelectAddress
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            selectedVillage={selectedVillage}
            setSelectedVillage={setSelectedVillage}
          />
        </div>

        <div className="mt-4">
          <label className="block">Select Size</label>
          <select
            name="size"
            value={filters.size}
            onChange={handleFilterChange}
            className="w-full p-1 rounded text-black"
          >
            <option value="">Select Size</option>
            {sizes.map((size, index) => (
              <option key={index} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <label className="block">Enter Price per Acre</label>
          <input
            type="number"
            name="pricePerAcre"
            value={filters.pricePerAcre}
            onChange={handleFilterChange}
            className="w-full p-1 rounded text-black"
          />
        </div>

        <div className="mt-4">
          <label className="block">Enter Period (Years)</label>
          <input
            type="number"
            name="period"
            value={filters.period}
            onChange={handleFilterChange}
            className="w-full p-1 rounded text-black"
          />
        </div>

        <div className="mt-4">
          <label className="block">Select Source of Irrigation</label>
          {irrigationOptions.map((option, index) => (
            <label key={index} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={option}
                checked={filters.irrigationSource.includes(option)}
                onChange={() => handleCheckboxChange(option)}
                className="text-black"
              />
              {option}
            </label>
          ))}
        </div>

        <button
          onClick={applyFilters}
          className="mt-4 w-full p-2 bg-blue-600 text-white rounded"
        >
          Apply Filter
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
