import React, { useState } from "react";
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";

const PreviewedRequestTable = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  

 const [requestprice, setrequestprice] = useState("");
 const [preview_desc, setpreview_desc] = useState("");
 const[pdata,setpdata]=useState("");

  const handleFetchRequests = async () => {
    setLoading(true);
    
    if (!user) { alert("Please log in first."); return; }
};

//   const handleIgnore = (id) => {
//     console.log("Ignored Request ID:", id);
//     setRequests((prev) => prev.filter((r) => r.id !== id));
//   };


function afterprivew(status , preview_request){
    console.log(status)
     console.log(requestprice)
     console.log(preview_desc)
    
    console.log(preview_request)
const requestupdate = {
   preview_request,
   "preview_status":"",
   "preview_price":"",
   "preview_description":"",
}
    if (status == "approved"){
        requestupdate.preview_status = "approved"
        requestupdate.preview_price = requestprice
        requestupdate.preview_description = preview_desc
        
    }
    if(status == "rejected"){
        requestupdate.preview_status = "rejected"   
    }
    async function senddata(){
        try {
          const response = await fetch(`${API_BASE_URL}/preview_request/`,{
            method:"POST",
            headers:{
              'Content-Type':"application/json"
            },
            body:JSON.stringify(requestupdate)
          })
          if(!response.ok){
            const error = await response.text();
            throw new Error(error)
          }
          const data = await response.json()

          console.log(data)
          alert(data.message)
        }
        catch(e){
          if(e.name === "TypeError" )
            alert("Connection failed")
          else {
            alert("something went wrong")
            console.log(e.message)
          }
        }
      }
senddata();
    console.log(requestupdate)
    setSelectedRequest(null)
    setrequestprice("")
    setpreview_desc("")
}


  return (
    <div className="p-4 bg-white text-black">
      <button
        onClick={handleFetchRequests}
        className="px-4 py-2 bg-white text-black underline rounded mb-4"
      >
        {loading ? "Loading..." : "Show Your Previewed Requests"}
      </button>

      {showTable && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-black text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-black px-4 py-2 text-left">Serial no.</th>
                <th className="border border-black px-4 py-2 text-left">Request ID</th>
                <th className="border border-black px-4 py-2 text-left">Request Type</th>
                <th className="border border-black px-4 py-2 text-left">Received Date</th>
                <th className="border border-black px-4 py-2 text-left">Status</th>
                <th className="border border-black px-4 py-2 text-left">Preview</th>
                {/* <th className="border border-black px-4 py-2 text-left">Ignore</th> */}
              </tr>
            </thead>
            <tbody>
              {requests.filter(req => req.sender?.status !== "pending").map((req,index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-black px-4 py-2">{index+1}</td>
                  <td className="border border-black px-4 py-2">{req.id}</td>
                  <td className="border border-black px-4 py-2">{req.type}</td>
                  <td className="border border-black px-4 py-2">{req.receivedDate}</td>
                  <td className="border border-black px-4 py-2">{req.sender.status}</td>
                  <td className="border border-black px-4 py-2">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded"
                      onClick={() => setSelectedRequest(req)}
                    >
                      Preview
                    </button>
                  </td>
                  {/* <td className="border border-black px-4 py-2">
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => handleIgnore(req.id)}
                    >
                      Ignore
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

{selectedRequest && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded shadow-lg w-full max-w-4xl">

         {/* Close (X) Button */}
      <button
        onClick={() => setSelectedRequest(null)}
        className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl font-bold"
      >
        &times;
      </button>
      <h2 className="text-2xl font-bold mb-6 text-center border-b pb-2">
        Request for {selectedRequest.type.split(" ")[0]}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sender Details (Left Side) */}
        <div>
          <h3 className="text-lg font-semibold mb-2 border-b">Sender Details</h3>
          {Object.entries(selectedRequest.sender).map(([key, value]) => (
            !['land_id', 'machine_id', 'machine_name', 'workTime', 'workUnit', 'workType', 'state', 'district', 'village'].includes(key) && (
              <p key={key}>
                <strong>{key}:</strong> {value}
              </p>
            )
          ))}
        </div>

        {/* Purpose Details (Right Side) */}
        <div>
          <h3 className="text-lg font-semibold mb-2 border-b">Purpose Details</h3>
          {selectedRequest.type === "Land Rent" && (
            <>
              <p><strong>Land ID:</strong> {selectedRequest.sender.land_id}</p>
              <p><strong>Land Size:</strong> {selectedRequest.sender.landSize}</p>
              <p><strong>Purpose Description:</strong> {selectedRequest.sender.description}</p>
              <p><strong>Rent Period:</strong> {selectedRequest.sender.period_start} to {selectedRequest.sender.period_end}</p>
            </>
          )}
          {selectedRequest.type === "Machine Rent" && (
            <>
              <p><strong>Machine ID:</strong> {selectedRequest.sender.machine_id}</p>
              <p><strong>Machine Name:</strong> {selectedRequest.sender.machine_name}</p>
              <p><strong>Hours:</strong> {selectedRequest.sender.hour}</p>
              <p><strong>Location:</strong> {selectedRequest.sender.village}, {selectedRequest.sender.district}, {selectedRequest.sender.state}</p>
              <p><strong>Rent Period:</strong> {selectedRequest.sender.period_start} to {selectedRequest.sender.period_end}</p>
              <p><strong>Description:</strong> {selectedRequest.sender.description}</p>
            </>
          )}
          {selectedRequest.type === "Labour Rent" && (
            <>
              <p><strong>Work Type:</strong> {selectedRequest.sender.workType}</p>
              <p><strong>Work Unit:</strong> {selectedRequest.sender.workUnit}</p>
              <p><strong>Work Time:</strong> {selectedRequest.sender.workTime}</p>
              <p><strong>Location:</strong> {selectedRequest.sender.village}, {selectedRequest.sender.district}, {selectedRequest.sender.state}</p>
              <p><strong>Description:</strong> {selectedRequest.sender.description}</p>
              <p><strong>Rent Period:</strong> {selectedRequest.sender.period_start} to {selectedRequest.sender.period_end}</p>
            </>
          )}
        </div>
      </div>
      {selectedRequest.sender.status === "pending" ? (
  <>
    {/* Price & Description Input */}
    <div className="mt-6 border-t pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Enter price for this request:</label>
          <input
            type="number"
            value={requestprice}
            onChange={(e) => setrequestprice(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g., 5000"
          />
        </div>
        <div>
          <label className="block font-medium">Add description:</label>
          <textarea
            rows="2"
            value={preview_desc}
            onChange={(e) => setpreview_desc(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g., Price is negotiable based on duration."
          />
        </div>
      </div>
    </div>

    {/* Approve/Reject Buttons */}
    <div className="mt-6 flex justify-end gap-4">
      <button
        className="bg-green-600 text-white px-6 py-2 rounded"
        onClick={() => afterprivew("approved", selectedRequest)}
      >
        Approve Request
      </button>
      <button
        className="bg-red-600 text-white px-6 py-2 rounded"
        onClick={() => afterprivew("rejected", selectedRequest)}
      >
        Reject Request
      </button>
    </div>
  </>
) : (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2 border-b">
        Previewed Response
      </h3>
  
      {selectedRequest.sender.status === "approved" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>Preview Description:</strong> {selectedRequest.sender.preview_description}</p>
          <p><strong>Request Price:</strong> ₹{selectedRequest.sender.request_price}</p>
          <p><strong>Preview Date:</strong> {selectedRequest.sender.preview_date}</p>
        </div>
      ):(
  
      
        <p><strong>Rejected Date:</strong> {selectedRequest.preview_date}</p>
      )}
  
      <div className="mt-4 flex justify-end">
        <button
          className="bg-gray-500 text-white px-6 py-2 rounded"
          onClick={() => setSelectedRequest(null)}
        >
          Close
        </button>
      </div>
    </div>
  )}

    </div>
  </div>
)}

    </div>
  );
};

export default PreviewedRequestTable;