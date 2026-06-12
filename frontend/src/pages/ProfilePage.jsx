import React, { useState, useEffect } from "react";
import ProfileUpperNavigationBar from "../components/ProfileUpperNavigationBar";
import SentRequestTable from "../components/SentRequestTable";
import ReceivedRequestTable from "../components/ReceivedRequestTable";
import PreviewedRequestTable from "../components/PreviewedRequestTable";
import ChatSupport from "./ChatSupport";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ProfileSidebar from "../components/ProfileSidebar";
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";
import LabourItem from "../components/LabourItem";
import LandItem from "../components/LandItem";
import MachineItem from "../components/MachineItem"

const ProfilePage = () => {
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // profile, listings, requests

  // Fresh profile data state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    mobile: "",
    bank_name: "",
    acc_name: "",
    acc_no: "",
    ifsc: "",
    upi_id: ""
  });

  // User listings state
  const [listings, setListings] = useState({
    lands: [],
    labours: [],
    machines: []
  });

  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [fetchingListings, setFetchingListings] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [fetchingTransactions, setFetchingTransactions] = useState(true);
  const [toastAlert, setToastAlert] = useState({ message: "", type: "success" });

  const showAlert = (message, type = "success") => {
    setToastAlert({ message, type });
    setTimeout(() => setToastAlert({ message: "", type: "success" }), 4000);
  };

  const fetchProfile = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/get_profile/`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.status === "success") {
          setProfileData(data.user);
          setUserName(data.user.name || "User");
        }
      }
    } catch (e) {
      console.error("Error fetching profile", e);
    } finally {
      setFetchingProfile(false);
    }
  };

  const fetchListings = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/get_user_listings/`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setListings(data);
      }
    } catch (e) {
      console.error("Error fetching listings", e);
    } finally {
      setFetchingListings(false);
    }
  };

  const fetchTransactions = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/transaction_history/`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.status === "success") {
          setTransactions(data.transactions);
        }
      }
    } catch (e) {
      console.error("Error fetching transactions", e);
    } finally {
      setFetchingTransactions(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      if (!token) {
        navigate("/login");
      } else {
        fetchProfile();
        fetchListings();
        fetchTransactions();
      }
    }
  }, [user, token, loading, navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/update_profile/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        showAlert("Profile and bank details updated successfully!", "success");
        setProfileData(data.user);
        setUserName(data.user.name);
      } else {
        showAlert(data.error || "Failed to update profile", "error");
      }
    } catch (err) {
      showAlert("Network error updating profile", "error");
    }
  };

  const handleUpdateLabour = async (id, updatedFields) => {
    try {
      const res = await fetch(`${API_BASE_URL}/update_labour_listing/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id, ...updatedFields })
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        showAlert("Labour status updated successfully!", "success");
        fetchListings();
      } else {
        showAlert(data.error || "Failed to update listing", "error");
      }
    } catch (err) {
      showAlert("Network error updating listing", "error");
    }
  };

  const handleUpdateLand = async (land_id, updatedFields) => {
    try {
      const res = await fetch(`${API_BASE_URL}/update_land_listing/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ land_id, ...updatedFields })
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        showAlert("Land listing updated successfully!", "success");
        fetchListings();
      } else {
        showAlert(data.error || "Failed to update listing", "error");
      }
    } catch (err) {
      showAlert("Network error updating listing", "error");
    }
  };

  const handleUpdateMachine = async (id, updatedFields) => {
    try {
      const res = await fetch(`${API_BASE_URL}/update_machine_listing/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id, ...updatedFields })
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        showAlert("Machine listing details updated successfully!", "success");
        fetchListings();
      } else {
        showAlert(data.error || "Failed to update listing", "error");
      }
    } catch (err) {
      showAlert("Network error updating listing", "error");
    }
  };

  const hasAnyListing =
    listings.lands.length > 0 ||
    listings.labours.length > 0 ||
    listings.machines.length > 0;

  return (
    <>
      <ProfileUpperNavigationBar />

      {/* Sidebar */}
      <ProfileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={{ name: userName }}
        setIsChatOpen={setIsChatOpen}
      />

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 pt-24 px-4 sm:px-6 lg:px-8 lg:ml-64">
        
        {/* Toast Alert */}
        <AnimatePresence>
          {toastAlert.message && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: -20, x: "-50%" }}
              className="fixed top-20 left-1/2 z-50 transform"
            >
              <div
                className={`px-6 py-3 rounded-xl shadow-2xl border-l-4 font-semibold text-sm ${
                  toastAlert.type === "success"
                    ? "bg-green-100 text-green-800 border-green-500"
                    : "bg-red-100 text-red-800 border-red-500"
                }`}
              >
                {toastAlert.type === "success" ? "✅ " : "❌ "} {toastAlert.message}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-7xl mx-auto space-y-8 pb-12">
          
          {/* Animated Greeting Section */}
          <motion.div
            className="rounded-2xl bg-white/40 backdrop-blur-md border border-white/20 p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.h2
              className="text-3xl font-bold text-green-950"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              👋 Hello, {userName}!
            </motion.h2>
            <motion.p
              className="text-gray-700 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Manage your profile details, listings, and rental bookings.
            </motion.p>
          </motion.div>

          {/* Premium Navigation Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
            {[
              { id: "profile", label: "👤 Profile Settings" },
              { id: "listings", label: "🚜 Manage Listings" },
              { id: "requests", label: "📥 Requests Overview" },
              { id: "transactions", label: "💸 Transaction History" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-green-700 text-white shadow-md shadow-green-700/20"
                    : "bg-white/60 hover:bg-white text-gray-700 hover:text-green-700 border border-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="mt-6">
            <AnimatePresence mode="wait">
              
              {/* Tab 1: Profile Settings */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Basic Details Section */}
                      <div className="bg-white/80 backdrop-blur border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center">
                          <span className="mr-2 text-xl">ℹ️</span> Basic Details
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Full Name</label>
                            <input
                              type="text"
                              value={profileData.name}
                              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                              required
                              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Email Address</label>
                            <input
                              type="email"
                              value={profileData.email}
                              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                              required
                              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Mobile Number (Non-Editable)</label>
                            <input
                              type="text"
                              value={profileData.mobile}
                              disabled
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Bank Details Section */}
                      <div className="bg-white/80 backdrop-blur border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center">
                          <span className="mr-2 text-xl">🏦</span> Bank Account
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Bank Name</label>
                            <input
                              type="text"
                              placeholder="e.g. State Bank of India"
                              value={profileData.bank_name}
                              onChange={(e) => setProfileData({ ...profileData, bank_name: e.target.value })}
                              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Account Holder Name</label>
                            <input
                              type="text"
                              placeholder="Account Holder's Name"
                              value={profileData.acc_name}
                              onChange={(e) => setProfileData({ ...profileData, acc_name: e.target.value })}
                              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Account Number</label>
                              <input
                                type="text"
                                placeholder="Account No"
                                value={profileData.acc_no}
                                onChange={(e) => setProfileData({ ...profileData, acc_no: e.target.value })}
                                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">IFSC Code</label>
                              <input
                                type="text"
                                placeholder="IFSC"
                                value={profileData.ifsc}
                                onChange={(e) => setProfileData({ ...profileData, ifsc: e.target.value })}
                                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* UPI ID Section */}
                      <div className="col-span-full bg-white/80 backdrop-blur border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center">
                          <span className="mr-2 text-xl">📱</span> UPI Configuration
                        </h3>
                        <div>
                          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">UPI ID (VPA)</label>
                          <input
                            type="text"
                            placeholder="e.g. username@upi or mobile@paytm"
                            value={profileData.upi_id}
                            onChange={(e) => setProfileData({ ...profileData, upi_id: e.target.value })}
                            className="max-w-md w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>

                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-green-700 hover:bg-green-800 text-white font-bold py-2.5 px-6 rounded-xl transition duration-200 shadow-md shadow-green-700/15"
                      >
                        💾 Save Profile Settings
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Tab 2: Manage Listings */}
              {activeTab === "listings" && (
                <motion.div
                  key="listings-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
                  {!hasAnyListing ? (
                    <div className="bg-white/80 border border-gray-200 rounded-2xl p-8 text-center max-w-xl mx-auto space-y-4">
                      <div className="text-5xl">🌾</div>
                      <h3 className="text-xl font-bold text-gray-900">No Listings Registered Yet</h3>
                      <p className="text-gray-600 text-sm">
                        You have not registered as a land owner, equipment provider, or labour. Register now to display your listings here and receive request calls!
                      </p>
                      <div className="flex flex-wrap justify-center gap-3 pt-2">
                        <button onClick={() => navigate("/PostLand")} className="bg-green-700 text-white font-semibold text-xs px-4 py-2 rounded-xl hover:bg-green-800">
                          Register Land
                        </button>
                        <button onClick={() => navigate("/labour_registration")} className="bg-blue-600 text-white font-semibold text-xs px-4 py-2 rounded-xl hover:bg-blue-700">
                          Register Labour Profile
                        </button>
                        <button onClick={() => navigate("/machine_registration")} className="bg-orange-600 text-white font-semibold text-xs px-4 py-2 rounded-xl hover:bg-orange-700">
                          Register Machinery
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8">

                 
                      {listings.labours.map(labour => (
                      <LabourItem
                        key={labour.id}
                        labour={labour}
                        onUpdate={handleUpdateLabour}
                      />
                    ))}

                      
{listings.lands.map(land => (
                       <LandItem
                          key={land.land_id}
                          land={land}
                          onUpdate={handleUpdateLand}
                        />
                      ))}
                     
{listings.machines.map(machine => (
                         <MachineItem
                           key={machine.id}
                           machine={machine}
                           onUpdate={handleUpdateMachine}
                         />
                       ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Tab 3: Requests Overview */}
              {activeTab === "requests" && (
                <motion.div
                  key="requests-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold text-green-950 mb-6 flex items-center">
                    <span className="mr-2 text-2xl font-normal">📥</span> Rental Bookings & Requests Log
                  </h3>
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-md font-bold text-gray-800 mb-3 border-b border-gray-100 pb-1.5">Received Request Orders</h4>
                      <ReceivedRequestTable />
                    </div>
                    <div>
                      <h4 className="text-md font-bold text-gray-800 mb-3 border-b border-gray-100 pb-1.5">Sent Hiring Requests</h4>
                      <SentRequestTable />
                    </div>
                    <div>
                      <h4 className="text-md font-bold text-gray-800 mb-3 border-b border-gray-100 pb-1.5">Previewed / Closed Request Summary</h4>
                      <PreviewedRequestTable />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 4: Transaction History */}
              {activeTab === "transactions" && (
                <motion.div
                  key="transactions-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold text-green-950 mb-6 flex items-center">
                    <span className="mr-2 text-2xl font-normal">💸</span> Razorpay Transaction History
                  </h3>
                  
                  {fetchingTransactions ? (
                    <div className="flex justify-center p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
                    </div>
                  ) : transactions.length === 0 ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
                      <h4 className="text-lg font-bold text-gray-700">No Transactions Found</h4>
                      <p className="text-sm text-gray-500 mt-1">You haven't made or received any payments yet.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700 uppercase font-bold text-[11px] tracking-wider border-b border-gray-200">
                          <tr>
                            <th className="px-5 py-4">Date</th>
                            <th className="px-5 py-4">Order ID</th>
                            <th className="px-5 py-4">Description</th>
                            <th className="px-5 py-4 text-center">Type</th>
                            <th className="px-5 py-4 text-center">Status</th>
                            <th className="px-5 py-4 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {transactions.map((txn, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/50 transition">
                              <td className="px-5 py-4 text-gray-600 font-medium whitespace-nowrap">{txn.date}</td>
                              <td className="px-5 py-4 text-gray-400 font-mono text-xs">{txn.order_id}</td>
                              <td className="px-5 py-4 text-gray-800 font-medium max-w-xs truncate" title={txn.description}>{txn.description}</td>
                              <td className="px-5 py-4 text-center">
                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold tracking-wide uppercase ${
                                  txn.type === "Credited" ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-100"
                                }`}>
                                  {txn.type === "Credited" ? "↓ CREDITED" : "↑ DEBITED"}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-center">
                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold tracking-wide uppercase ${
                                  txn.status === "paid" ? "bg-green-100 text-green-700 border border-green-200" : 
                                  txn.status === "failed" ? "bg-red-50 text-red-700 border border-red-100" :
                                  "bg-yellow-50 text-yellow-700 border border-yellow-200"
                                }`}>
                                  {txn.status.toUpperCase()}
                                </span>
                              </td>
                              <td className={`px-5 py-4 text-right font-bold whitespace-nowrap ${txn.type === "Credited" ? "text-green-600" : "text-gray-900"}`}>
                                {txn.type === "Credited" ? "+" : "-"}₹{parseFloat(txn.amount).toLocaleString('en-IN')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Chat Support - Floating or embedded */}
          <div className="col-span-full pt-4">
            <ChatSupport />
          </div>

        </div>
      </div>
    </>
  );
};

export default ProfilePage;