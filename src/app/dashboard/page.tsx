"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/app/components/common/button";
import { Input } from "@/app/components/common/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent
} from "@/app/components/common/select";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { getFlights } from "@/app/lib/features/flightSlice";
import { Flight } from "@/types";
import UpdateFlightStatus from "@/app/components/dashboard/ManageFlightStatus";
import { getRole, removeAccessToken, removeRole } from "@/utils/auth";
import { useRouter } from "next/navigation";
const statusOptions = [
  "Delayed",
  "Cancelled",
  "In-flight",
  "Scheduled/En Route",
  "All"
];
const airlineOptions = [
  "PIA",
  "Emirates",
  "Qatar Airlines",
  "Air India",
  "All"
];
const flightTypeOptions = ["Private", "Commercial", "Military", "All"];

const FlightTable = () => {
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState("");
  const [airline, setAirline] = useState("");
  const [flightType, setFlightType] = useState("");
  const dispatch = useAppDispatch();
  const { loading, error, flights, pagination } = useAppSelector(
    state => state.flight
  );
  const role = getRole();
  const router = useRouter();

  const currentPageRef = useRef(currentPage);
  const searchQueryRef = useRef(searchQuery);
  const statusRef = useRef(status);
  const airlineRef = useRef(airline);
  const flightTypeRef = useRef(flightType);
  const limitRef = useRef(limit);

  // Update refs on state changes
  useEffect(() => {
    currentPageRef.current = currentPage;
    searchQueryRef.current = searchQuery;
    statusRef.current = status;
    airlineRef.current = airline;
    flightTypeRef.current = flightType;
    limitRef.current = limit;
  }, [currentPage, searchQuery, status, airline, flightType, limit]);

  // WebSocket connection
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onmessage = () => {
      getAndSetFlight();
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    getAndSetFlight();
  }, [currentPage, searchQuery, limit, status, airline, flightType]);

  const getAndSetFlight = async () => {
    const params = {
      page: currentPageRef.current,
      search: searchQueryRef.current,
      status: statusRef.current,
      airline: airlineRef.current,
      flightType: flightTypeRef.current,
      limit: limitRef.current
    };

    await dispatch(getFlights(params));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilter = (type: string, value: string) => {
    if (type == "status") {
      setStatus(value === "All" ? "" : value);
    }
    if (type == "airline") {
      setAirline(value === "All" ? "" : value);
    }
    if (type == "flightType") {
      setFlightType(value === "All" ? "" : value);
    }
  };

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (flight: Flight) => {
    setSelectedFlight(flight);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFlight(null);
  };
  const logout = () => {
    removeAccessToken();
    removeRole();
    router.replace("/login");
  };
  return (
    <div className="p-8 space-y-6 bg-slate-600 min-h-screen">
      <div className="flex justify-between">
        <h1 className="text-5xl font-bold font-mono text-white mb-4 text-center mx-auto">
          Flight Management System
        </h1>
        <Button className="text-xl p-5 bg-green-600" onClick={logout}>
          SignOut
        </Button>
      </div>

      {/* Filter Dropdowns */}
      <div className="flex justify-between w-full">
        <div className="flex flex-wrap gap-4 flex-1">
          {/* Search bar */}
          <Input
            placeholder="Search Flights"
            onChange={handleSearch}
            className="w-full max-w-md p-3  rounded-md shadow-md"
          />
          <Select
            onValueChange={(value: string) => handleFilter("status", value)}
          >
            <SelectTrigger className="p-2 rounded-md shadow-md w-48">
              <span>Status</span>
            </SelectTrigger>
            <SelectContent className="bg-gray-900">
              {statusOptions.map(status => (
                <SelectItem
                  key={status}
                  value={status}
                  className=" hover:bg-gray-500"
                >
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value: string) => handleFilter("airline", value)}
          >
            <SelectTrigger className="p-2  rounded-md shadow-md w-48">
              <span>Airline</span>
            </SelectTrigger>
            <SelectContent className=" bg-gray-900">
              {airlineOptions.map(airline => (
                <SelectItem
                  key={airline}
                  value={airline}
                  className=" hover:bg-gray-500"
                >
                  {airline}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value: string) => handleFilter("flightType", value)}
          >
            <SelectTrigger className="p-2  rounded-md shadow-md w-48 ">
              <span>Flight Type</span>
            </SelectTrigger>
            <SelectContent className="bg-gray-900">
              {flightTypeOptions.map(flightType => (
                <SelectItem
                  key={flightType}
                  value={flightType}
                  className=" hover:bg-gray-500"
                >
                  {flightType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-xl ">Limit</p>
          <select
            onChange={handleLimitChange}
            value={limit}
            className="p-2  border border-gray-300 bg-black rounded-md shadow-sm"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={50}>75</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && !isModalOpen && (
        <div className="flex justify-center py-4">
          <div className="w-8 h-8 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center text-red-600 py-4">
          <p>{error}</p>
        </div>
      )}

      {/* No Data Found */}
      {!loading && !error && flights.length === 0 && (
        <div className="text-center text-gray-600 py-4">
          <p>No Data Found</p>
        </div>
      )}

      {/* Flight Table */}
      {!loading && !error && flights.length > 0 && (
        <table className="w-full bg-white rounded-lg shadow-md border-collapse">
          <thead>
            <tr className="bg-gray-500 text-white text-left">
              <th className="p-4">Flight Number</th>
              <th className="p-4">Origin</th>
              <th className="p-4">Destination</th>
              <th className="p-4">Status</th>
              <th className="p-4">Airline</th>
              <th className="p-4">Flight Type</th>
              {role == "admin" && <th className="p-4">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {flights.map((flight: Flight) => (
              <tr
                key={flight._id}
                className="border-b border-gray-200 bg-black hover:bg-slate-600 transition duration-150"
              >
                <td className="p-4">{flight.flightNumber}</td>
                <td className="p-4">{flight.origin}</td>
                <td className="p-4">{flight.destination}</td>
                <td className="p-4">{flight.status}</td>
                <td className="p-4">{flight.airline}</td>
                <td className="p-4">{flight.flightType}</td>
                {role == "admin" && (
                  <td className="p-4">
                    <Button
                      onClick={() => openModal(flight)}
                      className="bg-green-600 text-md text-white py-1 px-3 rounded-md hover:bg-green-700 transition"
                    >
                      Update Status
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <span className="text-white text-lg font-medium">
        Total Flights: {pagination.totalFlights}
      </span>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex justify-between w-full">
          <Button
            onClick={handlePreviousPage}
            disabled={currentPage <= 1}
            className="p-5 bg-green-600 rounded-md text-xl"
          >
            Previous
          </Button>
          <p className="text-2xl font-medium text-white">
            Page {currentPage} of {pagination.totalPages}
          </p>
          <Button
            onClick={handleNextPage}
            disabled={currentPage >= pagination.totalPages}
            className="p-5 bg-green-600 rounded-md text-xl"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Modal */}
      {selectedFlight && (
        <UpdateFlightStatus
          isOpen={isModalOpen}
          onClose={closeModal}
          flight={selectedFlight}
        />
      )}
    </div>
  );
};

export default FlightTable;
