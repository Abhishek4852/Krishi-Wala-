import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Headerpart from '../components/Headerpart';
import { API_BASE_URL } from "../config";

function Register() {
  const [name, setname] = useState("");
  const [mobile, setmobile] = useState("");
  const [email, setemail] = useState("");
  const [pass, setpass] = useState("");
  const [cnf_pass, setcnf_pass] = useState("");
  const [alert, setAlert] = useState({ message: '', type: '' });

  const navigate = useNavigate();

  const showAlert = (message, type = 'error') => {
    setAlert({ message, type });

    setTimeout(() => {
      setAlert({ message: '', type: '' });
    }, 4000);
  };

  const check = () => {
    if (!isAllFieldEntered()) {
      showAlert("Please enter all details");
      return;
    }

    if (!isAllFieldValid()) return;

    const formdata = {
      fname: name,
      fmobile: mobile,
      femail: email,
      fpass: pass,
    };

    const senddata = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/register/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formdata)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error?.message || "An error occurred");
        }

        showAlert(data.message || "Registered successfully", 'success');
        setTimeout(() => navigate("/Login"), 1500);
      } catch (error) {
        showAlert(error.message || "Registration failed");
        console.error("Error:", error.message);
      }
    };

    senddata();
  };

  const isAllFieldValid = () => (
    isAlpha() && isValidMobile() && isValidEmail() && isValidPassword() && matchpass()
  );

  const isAlpha = () => {
    const regex = /^[A-Za-z]+( [A-Za-z]+){0,3}$/;
    if (!regex.test(name)) {
      showAlert("Please enter a valid name (only alphabets, with at most 3 spaces).");
      return false;
    }
    return true;
  };

  const isValidMobile = () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      showAlert("Please enter a valid mobile number (10 digits, starting from 6-9).");
      return false;
    }
    return true;
  };

  const isValidEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      showAlert("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const isValidPassword = () => {
    if (pass.length < 4 || pass > 9) {
      showAlert("Password length must be between 4-8");
      return false;
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)/;
    if (!passwordRegex.test(pass)) {
      showAlert("Password must contain at least one letter and one number.");
      return false;
    }
    return true;
  };

  const matchpass = () => {
    if (pass !== cnf_pass) {
      showAlert("Passwords do not match.");
      return false;
    }
    return true;
  };

  const isAllFieldEntered = () => name && mobile && email && pass && cnf_pass;

  return (
    <div>
      <div className="flex min-h-screen flex-col md:flex-row h-full">

        {/* Left Side */}
        <div className="w-full md:w-1/2 flex items-center justify-center text-white p-10 relative overflow-hidden bg-gradient-to-br from-green-600 to-green-800">
          <div className="absolute inset-0 clip-arrow bg-gradient-to-br from-green-600 to-green-800 z-0"></div>
          <div className="text-center z-10">
            <div className="text-6xl mb-4 drop-shadow-xl">🌾</div>
            <h1 className="text-4xl font-bold mb-4">Welcome To KrishiWala</h1>
            <p className="mb-6 text-lg">Already registered? Login to your account.</p>
            <button
              onClick={() => navigate("/Login")}
              className="bg-white text-green-700 px-6 py-2 rounded-md font-semibold hover:bg-green-100 transition"
            >
              Login
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 p-8">
          <div className="bg-white p-8 rounded-xl shadow-3xl w-full max-w-md">
            <div className="flex items-center justify-center mb-6">
              <div className="text-4xl mr-2 drop-shadow-xl">🌾</div>
              <h2 className="text-3xl text-green-700 font-bold text-center">Register</h2>
            </div>

            {/* Alert Box */}
            {alert.message && (
              <div className={`mb-4 p-3 rounded-md text-sm font-medium ${alert.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {alert.message}
              </div>
            )}

            <form>
              <label className="block text-green-700 font-semibold mb-1">Full Name <span className="text-red-500">*</span></label>
              <input type="text" className="w-full text-green-800 p-3 border border-green-500 rounded-xl mb-4" onChange={(e) => setname(e.target.value)} required />

              <label className="block text-green-700 font-semibold mb-1">Mobile No. <span className="text-red-500">*</span></label>
              <input type="text" className="w-full text-green-800 p-3 border border-green-500 rounded-xl mb-4" onChange={(e) => setmobile(e.target.value)} />

              <label className="block text-green-700 font-semibold mb-1">Email ID <span className="text-red-500">*</span></label>
              <input type="text" className="w-full p-3 border border-green-500 text-green-800 rounded-xl mb-4" onChange={(e) => setemail(e.target.value)} />

              <label className="block text-green-700 font-semibold mb-1">Create Password  <span className="text-red-500">*</span></label>
              <input type="password" className="w-full p-3 border border-green-500 text-green-800 rounded-xl mb-4" onChange={(e) => setpass(e.target.value)} />
              <p className="text-xs text-red-600 mb-4 -mt-2">
                Note:  Enter a password 4–8 characters long, with at least one letter and one number.
              </p>

              <label className="block text-green-700 font-semibold mb-1">Confirm Password <span className="text-red-500">*</span></label>
              <input type="password" className="w-full text-green-800 p-3 border border-green-500 rounded-xl mb-6" onChange={(e) => setcnf_pass(e.target.value)} />

              <button
                type="button"
                className="w-full bg-green-600 text-white py-3 text-lg rounded-xl font-semibold hover:bg-green-700 transition"
                onClick={check}
              >
                Register
              </button>

              <p className="mt-2 text-green-800">
                Already registered?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="underline cursor-pointer font-semibold"
                >
                  Login
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;