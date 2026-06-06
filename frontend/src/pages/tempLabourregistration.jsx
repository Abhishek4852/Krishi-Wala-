import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Headerpart from "../components/Headerpart";
import SelectAddress from "../components/SelectAddress";

function LabourRegistration() {
  const navigate = useNavigate();

  const [age, setAge] = useState(0);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [workType, setWorkType] = useState("");
  const [otherWork, setOtherWork] = useState("");
  const [price, setPrice] = useState("");
  const [priceType, setPriceType] = useState("Per Day");
  const [AccountNo, setAccountNo] = useState("");
  const [formData, setFormData] = useState("");
  const [gender, setGender] = useState("");
  //Location Handling
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");


  const handleWorkChange = (e) => {
    setWorkType(e.target.value);
    if (e.target.value !== "Other") {
      setOtherWork(""); // Clear field if "Other" is not selected
    }
  };

  function isAlpha() {
    if (/^[A-Za-z]+( [A-Za-z]+){0,3}$/.test(name) && /^[A-Za-z]+( [A-Za-z]+){0,3}$/.test(name)) {
      return true;
    } else {
      alert("Please enter a valid name");
      return false;
    }
  }

  function isValidMobile() {
    if (/^[6-9]\d{9}$/.test(mobile) === true) {
      return true;
    } else {
      alert("Please enter a valid mobile number (10 digits, starting from 6-9).");
      return false;
    }
  }

  function validlocation() {
    if (selectedState && selectedDistrict && selectedVillage) {
      return true;
    } else {
      alert("Please select State, District, and Village.");
      return false;
    }
  }

  function isValidAge() {
    if (age < 18) {
      alert("enter valid age");
      return false;
    } else {
      return true;
    }
  };

  const handleOtherWorkChange = (e) => {
    const value = e.target.value;
    if (/^[A-Za-z\s]+$/.test(value) || value === "") {
      setOtherWork(value);
    } else {
      alert("Please enter only letters and spaces.");
    }
  };
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({ ...prevData, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };


  function isallfieldentered() {
    return Object.values(formData).every(value => value !== "");
  }

  function isvalidaccountno() {
    if (/^\d{9,18}$/.test(AccountNo)) {
      return true;
    } else {
      alert("Please enter a valid account number (9-18 digits).");
      return false;
    }
  }



  function isallfieldvalid() {
    return (isAlpha() && validlocation() && isValidMobile() && isValidAge() && isvalidaccountno())
  }

  const handleSubmit = () => {
    if (isallfieldentered()) {
      if (isallfieldvalid()) {
        const formData = {
          name,
          mobile,
          location,
          workType: workType === "Other" ? otherWork : workType,
          price: `${price} (${priceType})`,
          AccountNo,
          age,
          gender
        };
        alert("Data submitted successfully!\n" + JSON.stringify(formData, null, 2));
        console.log(formData);
      } else {
        alert("Please enter valid details.");
      }
    } else {
      alert("Please fill in all fields.");
    }
  };



  return (
    <>
      <Headerpart />
      <div className="p-6 bg-[#2E3944] border-gray-400 mt-40 rounded-xl max-w-md mx-auto border border- shadow-lg">

        <h2 className="text-2xl font-bold mb-4 text-center">Labour Registration Form</h2>
        <div className="text-center mb-4">

          <div className="w-24 h-24 mx-auto rounded-full border overflow-hidden flex items-center justify-center bg-gray-700 ">
            {formData.avatar ? <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <span className="text-gray-400">No Image</span>}
          </div>
          <label htmlFor="avatar-upload" className="block text-white mb-2">profile picture</label>
          <input type="file" id="avatar-upload" accept="image/*" onChange={handleAvatarChange} className="mt-2 text-white" />
        </div>



        <label className="block mt-4">Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 w-full" />

        <label className="block mt-4">Mobile Number:</label>
        <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} className="border p-2 w-full" />



        <label className="block mt-4 text-white">Age:</label>
        <input
          type="number"
          value={age}
          onChange={(e) => {
            setAge(e.target.value)
            //  const newAge = e.target.value;
            //   setAge(newAge); 
            // Validate age while updating
          }}
          className="border p-2 w-full text-white bg-[#2E3944]"
        />



        <div>

          <label className="block mt-4">Gender:</label>

          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="Male"
                checked={gender === "Male"}
                onChange={(e) => setGender(e.target.value)}
                className="mr-2"
              />
              Male
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                value="Female"
                checked={gender === "Female"}
                onChange={(e) => setGender(e.target.value)}
                className="mr-2"
              />
              Female
            </label>
          </div>
        </div>


        <div className=" mt-5 ">

          <span className="">Select Location :</span>


          <SelectAddress
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            selectedVillage={selectedVillage}
            setSelectedVillage={setSelectedVillage}
            className="bg-[#2E3944] text-white"
          />

        </div>


        <label className="block mt-4 bg-[#2E3944]  border-gray-400">Select Work:</label>
        <select value={workType} onChange={handleWorkChange} className="border p-2 w-full bg-[#2E3944]  border-gray-400">
          <option value="">-- Select Work --</option>
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

        {workType === "Other" && (
          <div className="mt-4">
            <label className="block">Specify Other Work:</label>
            <input
              type="text"
              value={otherWork}
              onChange={handleOtherWorkChange}
              className="border p-2 w-full"
              placeholder="Enter work name"
            />
          </div>
        )}

        <div className="mt-4">
          <label className="block">Experience Level</label>
          <select
            name="experienceLevel"

            className="w-full p-1 rounded border border-gray-300 bg-gray-700 text-white"
          >
            <option value="">Select Experience</option>
            <option value="Beginner">Beginner (0 year)</option>
            <option value="Intermediate">Intermediate (1-3 year)</option>
            <option value="Expert">Expert (3 -5 year)</option>
          </select>
        </div>

        <label className="block mt-4">Enter Price:</label>
        <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className="border p-2 w-full" />

        <div className="flex gap-4 mt-2">
          <button className={`p-2 w-1/2 ${priceType === "Per Day" ? "bg-blue-500 text-white" : "bg-gray-600"}`} onClick={() => setPriceType("Per Day")}>
            Per Day
          </button>
          <button className={`p-2 w-1/2 ${priceType === "Per Hour" ? "bg-blue-500 text-white" : "bg-gray-600"}`} onClick={() => setPriceType("Per Hour")}>
            Per Hour
          </button>
        </div>

        <label className="block mt-4">Account Number:</label>
        <input type="text" value={AccountNo} onChange={(e) => setAccountNo(e.target.value)} className="border p-2 w-full" />

        <button className="bg-blue-500 text-white p-2 mt-4 w-full" onClick={handleSubmit}>
          Save Details
        </button>
      </div>
    </>
  );
}


export default LabourRegistration;