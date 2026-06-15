import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";

const BookingRequestLand = ({ isOpen, onClose, landData }) => {
  const { user, token, loading } = useAuth();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [landSize, setLandSize] = useState("");
  const [rentingPeriod, setRentingPeriod] = useState({ start: "", end: "" });
  const [description, setDescription] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");

  const showAlert = (message, type = "error") => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => setAlertMessage(""), 3000);
  };

  const navigate = useNavigate();

  const validateForm = () => {
    const nameRegex = /^[A-Za-z\s]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;

    const missing = [];
    if (!nameRegex.test(name)) missing.push("Valid Name (no numbers/special characters)");
    if (!mobileRegex.test(mobile)) missing.push("Valid 10-digit Mobile (starting with 6-9)");
    if (!landSize || landSize <= 0) missing.push("Valid Land Size");
    if (!rentingPeriod.start) missing.push("Start Date");
    if (!rentingPeriod.end) missing.push("End Date");

    if (missing.length > 0) {
      showAlert(`Please fill required fields: ${missing.join(", ")}`);
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!loading) {
      if (!token) {
        if (typeof showAlert === 'function') showAlert("Please log in first.", "error");
        else if (typeof alert === 'function') alert("Please log in first.");
        navigate("/login");
      } else if (user) {
        setName(user.name || "");
        setMobile(user.mobile || "");
      }
    }
  }, [user, token, loading, navigate]);

  const handleSubmit = () => {
    if (validateForm()) {
      const LandRequest = {
        name,
        sender_mobile: mobile,
        landSize,
        rentingPeriod,
        description,
        receiver_mobile: landData.owner_mobile,
        status: "pending",
        land_id: landData.land_id,
      };

      async function senddata() {
        try {
          const response = await fetch(`${API_BASE_URL}/bookings/v2/land_request/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(LandRequest),
          });

          if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
          }

          const data = await response.json();
          showAlert(data.message, "success");
        } catch (e) {
          if (e.name === "TypeError") {
            showAlert("Connection failed");
          } else {
            showAlert("Something went wrong");
            console.log(e.message);
          }
        }
      }

      senddata();
      showAlert("Request sent", "success");
      onClose();
    }
  };

  return (
    <>
      <div className="bg-green-100 text-black p-6 rounded-2xl mt-20 border-green-600 border-2 shadow-lg">
        {alertMessage && (
          <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
            <div
              className={`p-4 rounded-lg font-medium shadow-lg max-w-sm w-full text-center ${
                alertType === "error"
                  ? "bg-red-200 text-red-800 border-l-4 border-red-500"
                  : "bg-green-200 text-green-800 border-l-4 border-green-500"
              }`}
            >
              {alertMessage}
            </div>
          </div>
        )}
      </div>

      <Dialog.Root open={isOpen} onOpenChange={onClose}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-100 text-black border-green-600 border-2 shadow-lg p-6 rounded-lg w-96">
            <Dialog.Close asChild>
              <button
                className="absolute top-3 right-3 text-white text-2xl font-bold hover:text-red-500"
                aria-label="Close"
              >
                ×
              </button>
            </Dialog.Close>
            <Dialog.Title className="text-lg font-bold">Booking Request</Dialog.Title>
            <div className="mt-4">
              <label className="block">Enter Your Name</label>
              <input
                type="text"
                className="bg-white text-black rounded-xl p-2 border-gray-800 border-2 w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label className="block mt-2">Enter Mobile No</label>
              <input
                type="number"
                className="bg-white text-black rounded-xl p-2 border-gray-800 border-2 w-full"
                value={mobile}
                readOnly
              />

              <label className="block mt-2">Enter Land Size (acres)</label>
              <input
                type="number"
                className="bg-white text-black rounded-xl p-2 border-gray-800 border-2 w-full"
                value={landSize}
                onChange={(e) => setLandSize(e.target.value)}
              />

              <label className="block mt-2">Renting Period</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  className="bg-gray-400 text-black rounded-xl p-2 border-gray-800 border-2 w-full"
                  value={rentingPeriod.start}
                  onChange={(e) => setRentingPeriod({ ...rentingPeriod, start: e.target.value })}
                />
                <input
                  type="date"
                  className="bg-gray-400 text-black rounded-xl p-2 border-gray-800 border-2 w-full"
                  value={rentingPeriod.end}
                  onChange={(e) => setRentingPeriod({ ...rentingPeriod, end: e.target.value })}
                />
              </div>

              <label className="block mt-2">Description (Optional)</label>
              <textarea
                className="bg-white text-black rounded-xl p-2 border-gray-800 border-2 w-full"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
      </Dialog.Root>
    </>
  );
};

export default BookingRequestLand;