import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import SelectAddress from "../components/SelectAddress";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";

function LabourHireRequest({ labour, open, setOpen }) {
  const { user, token, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    workTime: "",
    workUnit: "Day",
    workLocation: {},
    workType: "",
    otherWork: "",
    description: "",
  });
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userNumber, setUserNumber] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

    useEffect(() => {
    if (!loading) {
      if (!token) {
        if (typeof showAlert === 'function') showAlert("Please log in first.", "error");
        else if (typeof alert === 'function') alert("Please log in first.");
        navigate("/login");
      } else if (user) {
        try { setUserName(user.name); } catch(e) {}
        try { setUserNumber(user.mobile); } catch(e) {}
        try { setName(user.name); } catch(e) {}
        try { setMobile(user.mobile); } catch(e) {}
      }
    }
  }, [user, token, loading, navigate]);

  const [rentingPeriod, setRentingPeriod] = useState({ start: "", end: "" });
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUnitChange = (unit) => {
    setFormData({ ...formData, workUnit: unit });
  };

  const handleWorkChange = (e) => {
    setFormData({ ...formData, workType: e.target.value });
  };

  const handleOtherWorkChange = (e) => {
    setFormData({ ...formData, otherWork: e.target.value });
  };

  const handleSubmit = async () => {
    const { name, mobile, workTime, workUnit, workType } = formData;

    if (!name || !mobile || !rentingPeriod.start || !rentingPeriod.end || !workTime || !workUnit || !workType) {
      showAlert("Please fill all required fields.", "error");
      return;
    }

    const finalLocation = {
      state: selectedState,
      district: selectedDistrict,
      village: selectedVillage,
    };

    const requestData = {
      "receiver_mobile": labour.owner_mobile,
      ...formData,
      period: rentingPeriod,
      workLocation: finalLocation,
      "status": "pending",
      workType: workType === "Other" ? formData.otherWork : workType,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/labour_request/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const data = await response.json();
      showAlert(data.message, "success");
      setOpen(false);
    } catch (e) {
      if (e.name === "TypeError") {
        showAlert("Connection failed", "error");
      } else {
        showAlert("Something went wrong", "error");
        console.log(e.message);
      }
    }
  };

  const showAlert = (message, type = "error") => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => setAlertMessage(""), 3000); // hide after 3s
  };

  const inputClass = "text-black flex flex-col text-base";
  const placeholder = "bg-white text-black rounded-xl p-2 border-gray-800 border-2 w-full";

  return (
    <>
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
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <Dialog.Content className="fixed top-5/9 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-100 text-black border-green-600 border-2 shadow-lg p-6 rounded-lg w-96">
            <Dialog.Close asChild>
              <button className="absolute top-3 right-3 text-black text-xl font-bold hover:text-red-600" aria-label="Close">
                ×
              </button>
            </Dialog.Close>

            <h2 className="text-xl font-bold mb-4 text-black">Labour Hiring Request</h2>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={userName}
              onChange={handleChange}
              className="bg-white text-black rounded-xl p-2 border-gray-800 border-2 w-full"
            />

            <input
              type="number"
              name="mobile"
              placeholder="Enter mobile number"
              value={userNumber}
              onChange={handleChange}
              className="bg-white text-black rounded-xl p-2 border-gray-800 border-2 w-full"
            />

            <label className="block text-black mt-2"> Select Working Period</label>
            <div className="flex space-x-2 mb-3">
              <input
                type="date"
                className="bg-gray-300 text-black rounded-xl p-2 border-gray-800 border-2 w-full"
                value={rentingPeriod.start}
                onChange={(e) => setRentingPeriod({ ...rentingPeriod, start: e.target.value })}
                placeholder="Start date"
              />
              <input
                type="date"
                className="bg-gray-300 text-black rounded-xl p-2 border-gray-800 border-2 w-full"
                value={rentingPeriod.end}
                onChange={(e) => setRentingPeriod({ ...rentingPeriod, end: e.target.value })}
                placeholder="End date"
              />
            </div>

            <input
              type="number"
              name="workTime"
              placeholder="Enter work duration (in number)"
              value={formData.workTime}
              onChange={handleChange}
              className="bg-white text-black rounded-xl p-2 border-gray-800 border-2 w-full"
            />

            <div className="flex items-center gap-4 mb-3 text-black">
              <label className="flex items-center ">
                <input
                  type="radio"
                  name="unit"
                  checked={formData.workUnit === "Day"}
                  onChange={() => handleUnitChange("Day")}
                  className="mr-2"
                />
                Day
              </label>
              <label className="flex items-center ">
                <input
                  type="radio"
                  name="unit"
                  checked={formData.workUnit === "Hour"}
                  onChange={() => handleUnitChange("Hour")}
                  className="mr-2"
                />
                Hour
              </label>
            </div>

            <SelectAddress
              selectedState={selectedState}
              selectedDistrict={selectedDistrict}
              selectedVillage={selectedVillage}
              setSelectedState={setSelectedState}
              setSelectedDistrict={setSelectedDistrict}
              setSelectedVillage={setSelectedVillage}
              className={inputClass}
              placeholder={placeholder}
            />

            <select
              value={formData.workType}
              onChange={handleWorkChange}
              className="bg-white text-black rounded-xl mt-3 p-2 border-gray-800 border-2 w-full"
            >
              <option value="">-- Select Work Type --</option>
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

            {formData.workType === "Other" && (
              <input
                type="text"
                value={formData.otherWork}
                onChange={handleOtherWorkChange}
                placeholder="Specify other work"
                className="bg-white text-black rounded-xl p-2 border-gray-800 border-2 w-full"
              />
            )}

            <label className="block text-black mt-2">Description (Optional)</label>
            <textarea
              name="description"
              className="bg-white text-black rounded-xl p-2 border-gray-800 border-2 w-full"
              value={formData.description}
              onChange={handleChange}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Dialog.Close asChild>
                <button className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
              </Dialog.Close>
              <button
                onClick={handleSubmit}
                className="bg-green-700 text-white px-6 py-2 rounded-xl hover:bg-green-800 transition duration-200"
              >
                Submit
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

export default LabourHireRequest;