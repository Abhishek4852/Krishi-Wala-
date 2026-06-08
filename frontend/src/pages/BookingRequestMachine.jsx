import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import SelectAddress from "../components/SelectAddress";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";

function BookingRequestMachine({ open, setOpen, machinedata }) {
  const { user, token, loading } = useAuth();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [hour, sethour] = useState("");
  const [description, setDescription] = useState("");
  const [rentingPeriod, setRentingPeriod] = useState({ start: "", end: "" });
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const navigate = useNavigate();

  const showAlert = (message, type = "error") => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => setAlertMessage(""), 3000); // hide after 3s
  };

  const validate = () => {
    if (!name.trim()) return showAlert("Please enter your name", "error");
    if (!/^\d{10}$/.test(mobile)) return showAlert("Enter a valid 10-digit mobile number", "error");
    if (!rentingPeriod.start || !rentingPeriod.end) return showAlert("Please select both start and end dates", "error");
    if (!selectedState || !selectedDistrict || !selectedVillage) return showAlert("Please select a valid location", "error");
    return true;
  };

  const [userName, setUserName] = useState("");
  const [UserNumber, setUserNumber] = useState("");

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

  const handleSubmit = () => {
    if (validate()) {
      const requestData = {
        name,
        "sender_mobile": mobile,
        hour,
        rentingPeriod,
        location: {
          state: selectedState,
          district: selectedDistrict,
          village: selectedVillage,
        },
        description,
        "status": "pending",
        machinedata,
      };

      async function senddata() {
        try {
          const response = await fetch(`${API_BASE_URL}/machine_request/`, {
            method: "POST",
            headers: {
              'Content-Type': "application/json",
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(requestData),
          });
          if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
          }
          const data = await response.json();

          console.log(data);
          showAlert(data.message, "success");
        } catch (e) {
          if (e.name === "TypeError") showAlert("Connection failed", "error");
          else {
            showAlert("Something went wrong", "error");
            console.log(e.message);
          }
        }
      }

      senddata();
      setOpen(false); // Close modal
    }
  };

  const inputClass = "text-black flex flex-col text-base";
  const placeholder = "bg-white text-black rounded-xl p-2 border-gray-800 border-2 w-full";

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30 " />
        <Dialog.Content className="fixed top-5/9 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-100 text-black border-green-600 border-2 shadow-lg p-6 rounded-lg w-96">
          <Dialog.Close asChild>
            <button
              className="absolute top-3 right-3 text-white text-2xl font-bold hover:text-red-500"
              aria-label="Close"
            >
              ×
            </button>
          </Dialog.Close>

          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold">Booking Request</Dialog.Title>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter Your Name"
              value={userName}
              className="bg-white text-black rounded-xl p-2 border-gray-800 border-2 w-full"
            />

            <input
              type="text"
              placeholder="Enter Mobile Number"
              value={UserNumber}
              className="bg-white text-black rounded-xl p-2 border-gray-800 border-2 w-full"
            />

            <div>
              <label className="block text-black mt-2">Renting Period</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  className="bg-gray-300 text-black rounded-xl p-2 border-gray-800 border-2 w-full"
                  value={rentingPeriod.start}
                  onChange={(e) =>
                    setRentingPeriod({ ...rentingPeriod, start: e.target.value })
                  }
                />
                <input
                  type="date"
                  className="bg-gray-300 text-black rounded-xl p-2 border-gray-800 border-2 w-full"
                  value={rentingPeriod.end}
                  onChange={(e) =>
                    setRentingPeriod({ ...rentingPeriod, end: e.target.value })
                  }
                />
              </div>
            </div>
            <input
              type="text"
              placeholder="How Time require in Hour ?"
              value={hour}
              onChange={(e) => sethour(e.target.value)}
              className="bg-white text-black rounded-xl p-2 border-gray-800 border-2 w-full"
            />

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

            <textarea
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white text-black rounded-xl p-2 border-gray-800 border-2 w-full"
            />

            <div className="flex justify-end gap-2 pt-4">
              <Dialog.Close asChild>
                <button className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
              </Dialog.Close>
              <button
                onClick={handleSubmit}
                className="bg-green-700 text-white px-6 py-2 rounded-xl hover:bg-green-800 transition duration-200"
              >
                Send Request
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>

      {alertMessage && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className={`p-4 rounded-lg font-medium shadow-lg max-w-sm w-full text-center
            ${alertType === "error"
              ? "bg-red-200 text-red-800 border-l-4 border-red-500"
              : "bg-green-200 text-green-800 border-l-4 border-green-500"
            }`}>
            {alertMessage}
          </div>
        </div>
      )}
    </Dialog.Root>
  );
}

export default BookingRequestMachine;