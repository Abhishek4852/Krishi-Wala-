import React, { useState } from "react";

export default function LandItem({ land, onUpdate }) {
  const [rentPerAcre, setRentPerAcre] = useState(land.RentPricePerAcre);
  const [totalRent, setTotalRent] = useState(land.TotalRentPrice);
  const [period, setPeriod] = useState(land.rentPeriod);
  const [facilities, setFacilities] = useState(land.extraFacilities);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          {land.images && land.images.length > 0 ? (
            <img src={land.images[0]} alt={land.name} className="w-16 h-16 rounded-xl object-cover border" />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center text-2xl text-blue-700">🏕️</div>
          )}
          <div>
            <h4 className="font-bold text-gray-900">{land.LandSize} Acres Land</h4>
            <p className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5">Owner: {land.name}</p>
          </div>
        </div>
        <div className="text-xs text-gray-600 space-y-1">
          <p><strong>Location:</strong> {land.village}, {land.district}, {land.state}</p>
          <p><strong>Irrigation:</strong> {land.irrigationSource}</p>
          {land.map_location && (
            <p><a href={land.map_location} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">📍 View Map Location</a></p>
          )}
        </div>
      </div>
      <div className="md:col-span-2 space-y-4 flex flex-col justify-between">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Rent price / Month (₹)</label>
            <input type="number" value={rentPerAcre} onChange={e => setRentPerAcre(e.target.value)} className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Total Rent price (₹)</label>
            <input type="number" value={totalRent} onChange={e => setTotalRent(e.target.value)} className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Rent Period (Months)</label>
            <input type="number" value={period} onChange={e => setPeriod(e.target.value)} className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Extra Facilities</label>
            <input type="text" placeholder="Electricity, Water, etc." value={facilities} onChange={e => setFacilities(e.target.value)} className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>
        <div className="flex justify-end pt-3 border-t border-gray-100">
          <button onClick={() => onUpdate(land.land_id, { RentPricePerAcre: rentPerAcre, TotalRentPrice: totalRent, rentPeriod: period, extraFacilities: facilities })} className="bg-green-700 hover:bg-green-800 text-white font-semibold text-xs px-4 py-2 rounded-xl transition shadow-sm">
            Update Land Listing
          </button>
        </div>
      </div>
    </div>
  );
}
