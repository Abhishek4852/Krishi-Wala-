import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Headerpart from "../components/Headerpart";
import SelectMachine from "../components/SelectMachine";
import SelectTractor from "../components/SelectTractor";
import SelectAddress from "../components/SelectAddress";

import ChatSupport from "./ChatSupport";
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";

function MachineRegistration() {
  const { user, token, loading } = useAuth();
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const navigate = useNavigate();

  const showAlert = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage("");
    }, 3000);
  };

  // Bank Details


  const [ownerName, setOwnerName] = useState("");
  const [Mobileno, setMobileno] = useState("");
  const [specification, setSpecification] = useState("");
  const [withTractor, setWithTractor] = useState("No");
  const [tractorCompany, setTractorCompany] = useState("");
  const [tractorModel, setTractorModel] = useState("");
  const [hiringCostAcre, setHiringCostAcre] = useState(0);
  const [hiringCostHour, setHiringCostHour] = useState(0);
  const [quantity, setQuantity] = useState("");
  const [machinePhoto, setMachinePhoto] = useState(null);

  const [machineName, setMachineName] = useState("");
  const [purpose, setPurpose] = useState("");

  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");

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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter(file => file.type.startsWith("image/"));
    if (validImages.length === 0) {
      showAlert("Please select at least one image file.", "error");
      e.target.value = "";
      return;
    }
    setMachinePhoto(validImages);
  };

  const handleSubmit = () => {
    if (isAllFieldEntered()) {
      if (isAllFieldValid()) {
        const formData = new FormData();
        formData.append("ownerName", ownerName);
        formData.append("Mobileno", String(Mobileno));
        formData.append("selectedState", selectedState);
        formData.append("selectedDistrict", selectedDistrict);
        formData.append("selectedVillage", selectedVillage);
        formData.append("machineName", machineName);
        formData.append("purpose", purpose);
        formData.append("specification", specification);
        formData.append("withTractor", withTractor);
        if (withTractor === "Yes") {
          formData.append("tractorCompany", tractorCompany);
          formData.append("tractorModel", tractorModel);
        }
        formData.append("hiringCostAcre", hiringCostAcre);
        formData.append("hiringCostHour", hiringCostHour);
        formData.append("quantity", quantity);


        if (machinePhoto) {
          machinePhoto.forEach(file => {
            formData.append("machinePhoto", file);
          });
        }

        async function senddata() {
          try {
            const response = await fetch(`${API_BASE_URL}/listings/machine_registration/`, {
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

            showAlert("Registered successfully", "success");
            navigate("/");
          } catch (error) {
            if (error.name === "TypeError") {
              showAlert("Network Connection failed", "error");
            } else {
              showAlert("Something went wrong", "error");
            }
          }
        }

        senddata();
      }
    } else {
      showAlert("Please enter all details.", "error");
    }
  };

  function isAllFieldEntered() {
    return  machineName && purpose && specification &&
      hiringCostAcre && hiringCostHour && quantity &&
      machinePhoto && machinePhoto.length > 0 && selectLoc();
  }

  function selectLoc() {
    if (selectedState && selectedDistrict && selectedVillage) {
      return true;
    } else {
      showAlert("Please select location", "error");
      return false;
    }
  }

  function isAllFieldValid() {
    return isValidName(ownerName) && isValidCost(hiringCostAcre) &&
      isValidCost(hiringCostHour) && isValidQuantity(quantity) &&
      isValidMobile(UserNumber);
  }

  function isValidName(value) {
    if (/^[A-Za-z\s]+$/.test(value)) return true;
    showAlert("Please enter a valid name.", "error");
    return false;
  }

  function isValidCost(value) {
    if (/^\d+(\.\d{1,2})?$/.test(value)) return true;
    showAlert("Please enter a valid cost.", "error");
    return false;
  }

  function isValidMobile(mobile) {
    console.log()
    console.log("hello")
    if (/^[6-9]\d{9}$/.test(mobile)) return true;
    showAlert("Please enter a valid mobile number.", "error");
    return false;
  }

  function isValidQuantity(value) {
    if (/^\d+$/.test(value) && parseInt(value) > 0) return true;
    showAlert("Please enter a valid quantity.", "error");
    return false;
  }



  const inputClass =
    "text-black flex flex-col text-base";
  const placeholder = "bg-white text-black rounded-xl p-2 border-gray-800 border-2 w-full";


  return (
    <>
      <Headerpart />
      <ChatSupport />
      <div className="max-w-6xl  mx-auto p-4">
        <div className="bg-green-100 text-black p-6 rounded-2xl mt-20 border-green-600 border-2 shadow-lg">


          {alertMessage && (
            <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm">
              <div
                className={`p-4 rounded-lg text-center font-medium shadow-lg ${alertType === "error"
                    ? "bg-red-200 text-red-800 border-l-4 border-red-500"
                    : "bg-green-200 text-green-800 border-l-4 border-green-500"
                  }`}
              >
                {alertMessage}
              </div>
            </div>
          )}




          <h2 className="text-3xl font-bold mb-6 text-center text-green-900">
            Machine Registration Form
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={inputClass}>
              <label>Owner Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setOwnerName(e.target.value)}
                className={placeholder}
                // placeholder="Enter Owner's Full Name"
              />
            </div>

            <div className={inputClass}>
              <label>Mobile Number</label>
              <input
                type="number"
                value={UserNumber}
                onChange={(e) => setMobileno(e.target.value)}
                className={placeholder}
                // placeholder="Enter Mobile Number"
              />
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




            <SelectMachine
              machineName={machineName}
              setMachineName={setMachineName}
              purpose={purpose}
              setPurpose={setPurpose}
              className={inputClass}
              placeholder={placeholder}
            />


            <div className={inputClass}>
              <label>Specification (e.g., Capacity)</label>
              <input
                type="text"
                value={specification}
                onChange={(e) => setSpecification(e.target.value)}
                className={placeholder}
                placeholder="Enter specification details"
              />
            </div>


            <div className={inputClass}>
              <label>Hiring Cost Per Acre</label>
              <input
                type="number"
                value={hiringCostAcre}
                onChange={(e) => setHiringCostAcre(e.target.value)}
                className={placeholder}
                placeholder="Enter cost per acre"
              />
            </div>

            <div className={inputClass}>
              <label>Hiring Cost Per Hour</label>
              <input
                type="number"
                value={hiringCostHour}
                onChange={(e) => setHiringCostHour(e.target.value)}
                className={placeholder}
                placeholder="Enter cost per hour"
              />
            </div>

            <div className={inputClass}>
              <label>Quantity of Equipment</label>
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className={placeholder}
                placeholder="Enter quantity"
              />
            </div>







            <div className={inputClass}>
              <label>
                Upload Machine Photos
                <span className="text-red-500 ml-1">*</span>
                <span className="text-sm text-gray-600 ml-2">
                  (Image size should be less than 5MB)
                </span>
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="border p-2 rounded bg-white text-black"
              />
            </div>
            <div className={inputClass}>
              <label>With Tractor</label>
              <select
                value={withTractor}
                onChange={(e) => setWithTractor(e.target.value)}
                className={`${placeholder} bg-white`}
              >
                <option>No</option>
                <option>Yes</option>
              </select>
            </div>

            {withTractor === "Yes" && (
              <>
                <div className={inputClass}>
                  <label>Tractor Company & Model</label>
                  <SelectTractor
                    brand={tractorCompany}
                    setBrand={setTractorCompany}
                    tractorModel={tractorModel}
                    setTractorModel={setTractorModel}
                    className={inputClass}
                    placeholder={placeholder}
                  />
                </div>

                {tractorModel && (
                  <div className={inputClass}>
                    <p className="text-green-900 font-medium">
                      Selected Tractor Model: {tractorModel}
                    </p>
                  </div>
                )}
              </>
            )}





          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition"
            >
              Register Machine
            </button>
          </div>
        </div>
      </div>
    </>

  );
}

export default MachineRegistration;