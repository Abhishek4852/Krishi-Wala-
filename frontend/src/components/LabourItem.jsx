import React, { useState } from "react";

// Component to render a single labour listing with editable fields.
// This isolates hook usage per item, avoiding Hook order violations in ProfilePage.
export default function LabourItem({ labour, onUpdate }) {
  const [price, setPrice] = useState(labour.price);
  const [priceType, setPriceType] = useState(labour.price_type);
  const [availTime, setAvailTime] = useState(labour.availability_time);
  const [isAvail, setIsAvail] = useState(labour.is_available);

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          {labour.avatar ? (
            <img
              src={labour.avatar}
              alt={labour.name}
              className="w-16 h-16 rounded-full object-cover border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-2xl text-green-700">
              👷
            </div>
          )}
          <div>
            <h4 className="font-bold text-gray-900">{labour.name}</h4>
            <p className="text-xs bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5">
              {labour.work_type}
            </p>
          </div>
        </div>
        <div className="text-xs text-gray-600 space-y-1">
          <p>
            <strong>Location:</strong> {labour.selected_village}, {labour.selected_district}, {labour.selected_state}
          </p>
          <p>
            <strong>Experience:</strong> {labour.experience} Years
          </p>
          <p>
            <strong>Age:</strong> {labour.age} | <strong>Gender:</strong> {labour.gender}
          </p>
        </div>
      </div>

      <div className="md:col-span-2 space-y-4 flex flex-col justify-between">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
              Wage Cost (₹)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-1/2 bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <select
                value={priceType}
                onChange={(e) => setPriceType(e.target.value)}
                className="w-1/2 bg-white border border-gray-300 rounded-xl px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Per Day">Per Day</option>
                <option value="Per Hour">Per Hour</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
              Availability Shift / Timing
            </label>
            <input
              type="text"
              placeholder="e.g. 9 AM - 6 PM"
              value={availTime}
              onChange={(e) => setAvailTime(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        <div className="sm:col-span-2 flex items-center space-x-3 pt-2">
          <input
            type="checkbox"
            id={`avail-labour-${labour.id}`}
            checked={isAvail}
            onChange={(e) => setIsAvail(e.target.checked)}
            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <label
            htmlFor={`avail-labour-${labour.id}`}
            className="text-sm font-semibold text-gray-700 select-none cursor-pointer"
          >
            Available for work
          </label>
        </div>
      <div className="flex justify-end pt-3 border-t border-gray-100">
          <button
            onClick={() => onUpdate(labour.id, { price, price_type: priceType, availability_time: availTime, is_available: isAvail })}
            className="bg-green-700 hover:bg-green-800 text-white font-semibold text-xs px-4 py-2 rounded-xl transition shadow-sm"
          >
            Update Labour Listing
          </button>
        </div>
      </div>
    </div>
  );
}
