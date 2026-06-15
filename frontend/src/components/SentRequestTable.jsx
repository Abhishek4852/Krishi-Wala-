import React, { useState } from "react";
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";

const SentRequestTable = () => {
  const { user, token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [showPaymentInput, setShowPaymentInput] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  // const [pdata, setpdata] = useState("");
  const handleFetchRequests = async () => {
    setLoading(true);
    if (!user) {
      alert("Please log in first.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/sent_request/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          sender_mobile: user.mobile,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const data = await response.json();
      const sorted = [...data].sort(
        (a, b) => new Date(b.sentDate) - new Date(a.sentDate)
      );

      setRequests(sorted);
      setShowTable(true);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const visibleRequests = showAll ? requests : requests.slice(0, 5);

  const handlePayNowClick = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/check_payment_readiness/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          sender_mobile: user.mobile,
          receiver_mobile: selectedRequest.receiver_mobile
        })
      });
      const data = await res.json();
      if (data.status === "error") {
        alert(data.message);
      } else if (data.status === "ready") {
        setShowPaymentInput(true);
      }
    } catch (e) {
      alert("Error checking payment readiness");
    }
  };

  const handleConfirmPayment = async () => {
    if (!paymentAmount || isNaN(paymentAmount) || Number(paymentAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    try {
      let reqType = "";
      if (selectedRequest.type === "land") reqType = "Land Rent";
      else if (selectedRequest.type === "labour") reqType = "Labour";
      else reqType = "Machine Rent";

      const res = await fetch(`${API_BASE_URL}/bookings/create_razorpay_order/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: paymentAmount,
          request_id: selectedRequest.id,
          request_type: reqType
        })
      });
      const orderData = await res.json();
      
      if (orderData.error) {
        alert("Error creating order: " + orderData.error);
        return;
      }

      const options = {
        key: orderData.key_id,
        amount: orderData.amount * 100,
        currency: "INR",
        name: "Krishi Wala",
        description: `Payment for ${selectedRequest.type} request`,
        order_id: orderData.order_id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${API_BASE_URL}/bookings/verify_razorpay_payment/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyData.status === "success") {
              alert("Payment Successful!");
              setSelectedRequest(null);
              setShowPaymentInput(false);
              handleFetchRequests();
            } else {
              alert("Payment verification failed!");
            }
          } catch (e) {
            alert("Error verifying payment");
          }
        },
        prefill: {
          name: user.name,
          contact: user.mobile,
          email: user.email || ""
        },
        theme: {
          color: "#16a34a"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        alert("Payment failed: " + response.error.description);
      });
      rzp.open();
      
    } catch (e) {
      console.error(e);
      alert("Error initiating payment");
    }
  };

  return (
    <div className="p-4 bg-white text-black">
      <button
        onClick={handleFetchRequests}
        className="px-4 py-2 bg-white text-black underline rounded mb-4"
      >
        {loading ? "Loading..." : "Show Your Sent Requests..."}
      </button>

      {showTable && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-black text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-black px-4 py-2 text-left">S.No.</th>
                <th className="border border-black px-4 py-2 text-left">Request ID</th>
                <th className="border border-black px-4 py-2 text-left">Request Type</th>
                <th className="border border-black px-4 py-2 text-left">Sent Date</th>
                <th className="border border-black px-4 py-2 text-left">Status</th>
                <th className="border border-black px-4 py-2 text-left">Receiver Mobile</th>
                <th className="border border-black px-4 py-2 text-left">Preview</th>
              </tr>
            </thead>
            <tbody>
              {visibleRequests.map((req, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-black px-4 py-2">{index + 1}</td>
                  <td className="border border-black px-4 py-2">{req.id}</td>
                  <td className="border border-black px-4 py-2">{req.type}</td>
                  <td className="border border-black px-4 py-2">{req.sentDate}</td>
                  <td className="border border-black px-4 py-2">{req.status}</td>
                  <td className="border border-black px-4 py-2">{req.receiver_mobile}</td>
                  <td className="border border-black px-4 py-2">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded"
                      onClick={() => setSelectedRequest(req)}
                    >
                      Preview
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {requests.length > 5 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {showAll ? "Show Less" : "Show More"}
              </button>
            </div>
          )}
        </div>
      )}

{selectedRequest && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl relative overflow-y-auto max-h-[90vh]">
      <button
        className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl font-bold"
        onClick={() => { setSelectedRequest(null); setShowPaymentInput(false); }}
      >
        &times;
      </button>

      <h2 className="text-2xl font-bold mb-4 text-center">
        Request Type: {selectedRequest.type}
      </h2>

      <div className="grid grid-cols-2 gap-6">
        {/* Receiver Info Section */}
        <div className="bg-gray-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Receiver Details</h3>
          <p><strong>Mobile No:</strong> {selectedRequest.receiver_mobile}</p>
          <p><strong>Response Date:</strong> {selectedRequest.sender?.response_date || "Pending"}</p>
          <p><strong>Request Price:</strong> ₹{selectedRequest.sender?.request_price || "Not Provided"}</p>
          <p><strong>Receiver Description:</strong> {selectedRequest.sender?.preview_description || "N/A"}</p>
        </div>

        {/* Purpose Section */}
        <div className="bg-gray-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Purpose of Request</h3>
          {selectedRequest.type === "labour" && (
            <>
              <p><strong>Work Type:</strong> {selectedRequest.sender?.workType}</p>
              <p><strong>Description:</strong> {selectedRequest.sender?.description}</p>
              <p><strong>Time:</strong> {selectedRequest.sender?.workTime} {selectedRequest.sender?.workUnit}</p>
              <p><strong>Location:</strong> {selectedRequest.sender?.village}, {selectedRequest.sender?.district}, {selectedRequest.sender?.state}</p>
              <p><strong>Period:</strong> {selectedRequest.sender?.period_start} to {selectedRequest.sender?.period_end}</p>
            </>
          )}
          {selectedRequest.type === "land" && (
            <>
              <p><strong>Land Size:</strong> {selectedRequest.sender?.landSize} acre(s)</p>
              <p><strong>Description:</strong> {selectedRequest.sender?.description}</p>
              <p><strong>Period:</strong> {selectedRequest.sender?.period_start} to {selectedRequest.sender?.period_end}</p>
            </>
          )}
          {selectedRequest.type === "machine" && (
            <>
              <p><strong>Machine Name:</strong> {selectedRequest.sender?.machine_name}</p>
              <p><strong>Hours:</strong> {selectedRequest.sender?.hour} hrs</p>
              <p><strong>Description:</strong> {selectedRequest.sender?.description}</p>
              <p><strong>Location:</strong> {selectedRequest.sender?.village}, {selectedRequest.sender?.district}, {selectedRequest.sender?.state}</p>
              <p><strong>Period:</strong> {selectedRequest.sender?.period_start} to {selectedRequest.sender?.period_end}</p>
            </>
          )}
        </div>
      </div>

      <div className="text-center mt-6 flex justify-center gap-4">
        {selectedRequest.status === "approved" && !showPaymentInput && (
          <button
            className="px-6 py-2 bg-green-600 text-white rounded"
            onClick={handlePayNowClick}
          >
            Pay Now
          </button>
        )}
        <button
          className="px-6 py-2 bg-black text-white rounded"
          onClick={() => { setSelectedRequest(null); setShowPaymentInput(false); }}
        >
          Close
        </button>
      </div>

      {showPaymentInput && (
        <div className="mt-4 border-t pt-4 text-center">
            <h3 className="font-bold mb-2">Enter the agreed payment amount (INR):</h3>
            <input 
              type="number" 
              value={paymentAmount} 
              onChange={(e) => setPaymentAmount(e.target.value)} 
              className="border border-gray-400 p-2 rounded mb-2 w-1/2" 
              placeholder="e.g. 5000"
            />
            <br/>
            <button 
              className="bg-blue-600 text-white px-6 py-2 rounded"
              onClick={handleConfirmPayment}
            >
              Confirm & Pay
            </button>
        </div>
      )}
    </div>
  </div>
)}

    </div>
  );
};

export default SentRequestTable;