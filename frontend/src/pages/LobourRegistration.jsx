import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Headerpart from "../components/Headerpart";
import SelectAddress from "../components/SelectAddress";

import ChatSupport from "./ChatSupport";
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";

function LabourRegistration() {
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();


  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [workType, setWorkType] = useState("");
  const [otherWork, setOtherWork] = useState("");
  const [price, setPrice] = useState(0);
  const [priceType, setPriceType] = useState("Per Day");
  const [userName, setUserName] = useState("");
  const [UserNumber, setUserNumber] = useState("");
  const [formData1, setFormData1] = useState("");
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState("");
  const [experience, setexperience] = useState(0);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");

  const showAlert = (message, type = "error") => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => setAlertMessage(""), 3000);
  };

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

  const handleWorkChange = (e) => {
    setWorkType(e.target.value);
    if (e.target.value !== "Other") {
      setOtherWork("");
    }
  };

  const handleOtherWorkChange = (e) => {
    const value = e.target.value;
    if (/^[A-Za-z\s]+$/.test(value) || value === "") {
      setOtherWork(value);
    } else {
      showAlert("Please enter only letters and spaces.");
    }
  };

  const handleSubmit = () => {
    if (name && mobile && location && (workType !== "Other" || otherWork) && price && age && gender && experience) {
      if (isAllFieldValid()) {
        async function senddata() {
          try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("mobile", mobile);
            formData.append("selectedState", selectedState);
            formData.append("selectedDistrict", selectedDistrict);
            formData.append("selectedVillage", selectedVillage);
            formData.append("workType", workType === "Other" ? otherWork : workType);
            formData.append("price", price);
            formData.append("priceType", priceType);
            formData.append("age", age);
            formData.append("gender", gender);
            formData.append("experience", experience);


            if (formData1.avatar) {
              formData.append("avatar", formData1.avatar);
            }

            const response = await fetch(`${API_BASE_URL}/listings/labour_registration/`, {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${token}`
              },
              body: formData,
            });

            if (!response.ok) {
              const error = await response.text();
              throw new Error(error);
            }
            const data = await response.json();
            showAlert("Registered successfully", "success");
            navigate("/");
          } catch (error) {
            if (error.name === "TypeError") {
              showAlert("Network Connection failed");
              console.log("Network Connection failed ", error.message);
            } else {
              showAlert("Something went wrong");
              console.log("Other error ", error.message);
            }
          }
        }

        senddata();
      }
    } else {
      showAlert("Please fill in all fields.");
    }
  };

  function isAllFieldValid() {
    return (
      isAlpha() &&
      validlocation() &&
      isValidMobile() &&
      isPrice() &&
      isage() &&
      isexperience()
    );
  }

  function isAlpha() {
    if (/^[A-Za-z]+( [A-Za-z]+){0,3}$/.test(name)) {
      return true;
    } else {
      showAlert("Please enter a valid name");
      return false;
    }
  }

  function isValidMobile() {
    if (/^[6-9]\d{9}$/.test(mobile)) {
      return true;
    } else {
      showAlert("Please enter a valid mobile number (10 digits, starting from 6-9).");
      return false;
    }
  }

  function validlocation() {
    if (selectedState && selectedDistrict && selectedVillage) {
      return true;
    } else {
      showAlert("Please select State, District, and Village.");
      return false;
    }
  }



  function isPrice() {
    if (/^\d+(\.\d{1,2})?$/.test(price) && parseFloat(price) > 0) {
      return true;
    } else {
      showAlert("Please enter a valid rent price (a positive number).");
      return false;
    }
  }

  function isage() {
    if (age >= 18 && age <= 60) return true;
    else {
      showAlert("Enter valid age");
      return false;
    }
  }

  function isexperience() {
    if (experience >= 0 && experience <= 40) return true;
    else {
      showAlert("Enter valid experience");
      return false;
    }
  }

  const inputClass =
    "text-black flex flex-col text-base";
  const placeholder = "bg-white text-black rounded-xl p-2 border-gray-800 border-2 w-full";
  return (
    <>
      <Headerpart />
      <ChatSupport />
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
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-green-100 text-black p-6 mt-20 rounded-2xl border-green-600 border-2 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center text-green-900 dark:text-green-700">
            Labour Registration Form
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="font-semibold">Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Name"
                className="bg-white p-2 border-2 border-gray-800 rounded-xl"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold">Mobile Number</label>
              <input
                type="text"
                value={UserNumber}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter Mobile Number"
                className="bg-white p-2 border-2 border-gray-800 rounded-xl"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold">Work Type</label>
              <select
                value={workType}
                onChange={handleWorkChange}
                className="bg-white p-2 border-2 border-gray-800 rounded-xl"
              >
                <option>Select Work Type</option>
                <option>Electrician</option>
                <option>Plumber</option>
                <option>Painter</option>
                <option>Labour</option>
                <option>Other</option>
              </select>
            </div>

            {workType === "Other" && (
              <div className="flex flex-col">
                <label className="font-semibold">Other Work</label>
                <input
                  type="text"
                  value={otherWork}
                  onChange={handleOtherWorkChange}
                  placeholder="Specify other work"
                  className="bg-white p-2 border-2 border-gray-800 rounded-xl"
                />
              </div>
            )}

            <div className="flex flex-col">
              <label className="font-semibold">Enter Wage</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter Price"
                className="bg-white p-2 border-2 border-gray-800 rounded-xl"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold">Select Wage scale</label>
              <select
                value={priceType}
                onChange={(e) => setPriceType(e.target.value)}
                className="bg-white p-2 border-2 border-gray-800 rounded-xl"
              >
                <option>Per Day</option>
                <option>Per Hour</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="font-semibold">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter Age"
                className="bg-white p-2 border-2 border-gray-800 rounded-xl"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="bg-white p-2 border-2 border-gray-800 rounded-xl"
              >
                <option>Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="font-semibold">Experience (in years)</label>
              <input
                type="number"
                value={experience}
                onChange={(e) => setexperience(e.target.value)}
                placeholder="Enter Experience"
                className="bg-white p-2 border-2 border-gray-800 rounded-xl"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold">Upload Profile Photo</label>
              <input
                type="file"
                onChange={(e) => setFormData1({ avatar: e.target.files[0] })}
                className="bg-white text-black p-2 rounded-xl border-gray-800 border-2"
              />
            </div>

            {/* Location Component */}
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


          </div>

          <div className="text-center mt-6">
            <button
              className="bg-green-700 text-white px-6 py-2 rounded-xl hover:bg-green-800 transition duration-200"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default LabourRegistration;