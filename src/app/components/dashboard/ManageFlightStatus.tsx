"use client";
import React, { useState } from "react";
import { Flight } from "@/types";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { resetError, updateFlight } from "@/app/lib/features/flightSlice";

interface ManageFlightStatusProps {
  isOpen: boolean;
  flight: Flight;
  onClose: () => void;
}

const statusOptions = [
  "Delayed",
  "On Time",
  "Cancelled",
  "In-flight",
  "Scheduled/En Route"
];

const ManageFlightStatus: React.FC<ManageFlightStatusProps> = ({
  flight,
  isOpen,
  onClose
}) => {
  const [selectedStatus, setSelectedStatus] = useState(flight.status);
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.flight);
  if (!isOpen) return null;

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value);
  };

  const handleUpdateClick = async () => {
    dispatch(resetError());

    const response = await dispatch(
      updateFlight({
        flightNumber: flight.flightNumber,
        status: selectedStatus
      })
    );
    if ((response.payload as { success: boolean }).success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-[#272A40] text-white rounded-lg w-full max-w-md md:max-w-2xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-xl hover:text-gray-400"
        >
          &times;
        </button>

        {/* Modal Title */}
        <h2 className="text-xl font-semibold mb-4">
          Update Flight{" "}
          <span className="text-green-600">{flight.flightNumber}</span> Status
        </h2>

        {/* Status Dropdown */}
        <div className="mb-4">
          <label
            htmlFor="status"
            className="block mb-2 text-md font-medium text-white"
          >
            Select Status
          </label>
          <select
            id="status"
            value={selectedStatus}
            onChange={handleStatusChange}
            className="w-full px-3 py-2 bg-[#3B3F5C] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Update Button */}
        <div className="mt-4">
          <button
            onClick={handleUpdateClick}
            className="w-full bg-green-600 text-white py-2 rounded-md"
          >
            {loading ? "Loading" : "Update"}
          </button>
        </div>
        <div className="w-full mt-2">
          {error && (
            <div className="p-4 bg-red-600 text-white rounded-md">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageFlightStatus;
