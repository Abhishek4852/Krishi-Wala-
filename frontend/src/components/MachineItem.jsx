import React, { useState } from "react";

export default function MachineItem({ machine, onUpdate }) {
  const [costAcre, setCostAcre] = useState(machine.hiring_cost_acre);
  const [costHour, setCostHour] = useState(machine.hiring_cost_hour);
  const [qty, setQty] = useState(machine.quantity);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          {machine.images && machine.images.length > 0 ? (
            <img src={machine.images[0]} alt={machine.machine_name} className="w-16 h-16 rounded-xl object-cover border" />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-orange-100 flex items-center justify-center text-2xl text-orange-700">🚜</div>
          )}
          <div>
            <h4 className="font-bold text-gray-900">{machine.machine_name}</h4>
            <p className="text-xs bg-orange-100 text-orange-800 font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5">
              {machine.purpose}
            </p>
          </div>
        </div>
        <div className="text-xs text-gray-600 space-y-1">
          <p><strong>Owner:</strong> {machine.owner_name}</p>
          <p><strong>Location:</strong> {machine.village}, {machine.district}, {machine.state}</p>
          <p><strong>Tractor Attached:</strong> {machine.with_tractor ? `Yes (${machine.tractor_company} ${machine.tractor_model})` : "No"}</p>
          <p className="line-clamp-2"><strong>Specification:</strong> {machine.specification}</p>
        </div>
      </div>

      <div className="md:col-span-2 space-y-4 flex flex-col justify-between">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Cost / Acre (₹)</label>
            <input
              type="number"
              value={costAcre}
              onChange={e => setCostAcre(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Cost / Hour (₹)</label>
            <input
              type="number"
              value={costHour}
              onChange={e => setCostHour(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Quantity Available</label>
            <input
              type="number"
              value={qty}
              onChange={e => setQty(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        <div className="flex justify-end pt-3 border-t border-gray-100">
          <button
            onClick={() => onUpdate(machine.id, { hiring_cost_acre: costAcre, hiring_cost_hour: costHour, quantity: qty })}
            className="bg-green-700 hover:bg-green-800 text-white font-semibold text-xs px-4 py-2 rounded-xl transition shadow-sm"
          >
            Update Machine Listing
          </button>
        </div>
      </div>
    </div>
  );
}
