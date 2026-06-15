import React, { useState, useEffect, useRef } from "react";
import TakeLandOnRentHeader from "../components/TakeLandOnRentHeader";
import BookingRequestLand from "./BookingRequestLand";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";
// import { use } from "react";

function TakeLandOnRent() {
  const { user, token, loading } = useAuth();
  // State variables for filters
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [size, setsize] = useState(0)
  const [pricePerAcre, setpricePerAcre] = useState(0)
  const [period, setperiod] = useState(0);
  const [irrigationSource, setirrigationSource] = useState([]);
  const [filteredData, setfilteredData] = useState();
  const [responseData, setresponseData] = useState()

  const navigate = useNavigate()

    useEffect(() => {
    if (!loading) {
      if (!token) {
        alert("Please log in first.");
        navigate("/login");
      }
    }
  }, [user, token, loading, navigate]);


  // Booking Request state
  const [selectedLand, setSelectedLand] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // State to store fetched product data
  const [landListings, setLandListings] = useState([]);
  useEffect(() => {
    if (Array.isArray(responseData)) {
      setLandListings(responseData);
      console.log("land listing data ", landListings)
    } else {
      console.error("Invalid responseData format", responseData);
      setLandListings([]);
    }
  }, [responseData]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/search/filter_land/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        if (response.ok) {
          const data = await response.json();
          setresponseData(data);
        }
      } catch (e) {
        console.error("Error fetching initial land data", e);
      }
    };
    fetchInitialData();
  }, []);


  const scrollRefs = useRef([]);


  const handleScrollWithTimeout = (index) => {
    const container = scrollRefs.current[index];
    if (container) {
      // Show scrollbar immediately when user scrolls
      container.classList.remove("scrollbar-hide");
      container.classList.add("scrollbar-thin", "scrollbar-thumb-gray-400");

      // Clear any previous timeout if it's set
      if (container.hideScrollbarTimeout) clearTimeout(container.hideScrollbarTimeout);

      // Set a new timeout to hide scrollbar after 1 second of no scroll
      container.hideScrollbarTimeout = setTimeout(() => {
        container.classList.add("scrollbar-hide");
        container.classList.remove("scrollbar-thin", "scrollbar-thumb-gray-400");
      }, 1000);
    }
  };







  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <TakeLandOnRentHeader
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        selectedVillage={selectedVillage}
        setSelectedVillage={setSelectedVillage}
        size={size}
        setsize={setsize}
        pricePerAcre={pricePerAcre}
        setpricePerAcre={setpricePerAcre}
        period={period}
        setperiod={setperiod}
        irrigationSource={irrigationSource}
        setirrigationSource={setirrigationSource}
        filteredData={filteredData}
        setfilteredData={setfilteredData}
        setresponseData={setresponseData}


      />


      {/* Main Content Area with Scrollbar */}
      <div className="flex-grow p-6 overflow-y-auto max-h-screen flex-col md:ml-64 ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {landListings.map((land, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 text-black border-2 border-green-700   shadow-lg rounded-lg flex flex-col md:flex-row overflow-hidden w-full">

              {/* Left Side - Image Slider */}
              <div className="w-full md:w-1/2 relative overflow-hidden">
                <div
                  className="flex overflow-x-auto space-x-2 p-2 scrollbar-hide"
                  ref={(el) => (scrollRefs.current[index] = el)}
                  onScroll={() => handleScrollWithTimeout(index)}
                >
                  {land.images?.map((photo, idx) => (
                    <img
                      key={idx}
                      src={`${photo}`}
                      alt="Land"
                      className="w-full h-56 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>

              {/* Right Side - Details */}
              <div className="w-full md:w-1/2 p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold">{land.village}, {land.district}</h3>
                  <p>Size: <span className="font-semibold">{land.LandSize} acres</span></p>
                  <p>Price: <span className="font-semibold">₹{land.RentPricePerAcre}/acre</span></p>
                  <p>Period: <span className="font-semibold">{land.rentPeriod} months</span></p>
                  <p>Irrigation: <span className="font-semibold">{Array.isArray(land.irrigationSource) ? land.irrigationSource.join(", ") : land.irrigationSource}</span></p>
                  <p>Facilities: <span className="font-semibold">{land.extraFacilities}</span></p>
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-4">
                  <button onClick={() => { setSelectedLand(land); setIsBookingOpen(true); }} className="bg-green-600 text-white px-3 py-1 rounded">Book request</button>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded">Contact</button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Render BookingRequest */}
      {isBookingOpen && <BookingRequestLand isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} landData={selectedLand} />}
    </div>
    // </div>
  );
}

export default TakeLandOnRent;