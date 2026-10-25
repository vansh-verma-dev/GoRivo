import { useState } from "react";
import { IoLocationOutline, IoNavigateOutline } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa";


function RideBookBar() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Searching ride from", pickup, "to", drop);
  }

  return (
    <div className="w-[95%] max-w-7xl mx-auto my-10 bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-2xl shadow-orange-200">
      <p className="text-orange-400 font-bold text-sm">LET'S GET YOU THERE</p>
      <h1 className="text-2xl md:text-3xl font-medium text-gray-600 mb-5">
        Plan your next ride
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-4 md:gap-5"
      >
        <div className="flex flex-1 gap-3 items-center p-3 border border-gray-300 rounded-2xl focus-within:border-orange-400">
          <IoLocationOutline className="text-orange-400 text-4xl" />
          <div className="flex-1">
            <p className="text-gray-500 text-sm">Pickup location</p>
            <input
              type="text"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Enter pickup point"
              className="outline-0 w-full"
            />
          </div>
        </div>

        <div className="flex flex-1 gap-3 items-center p-3 border border-gray-300 rounded-2xl focus-within:border-orange-400">
          <IoNavigateOutline className="text-orange-400 text-4xl" />
          <div className="flex-1">
            <p className="text-gray-500 text-sm">Destination</p>
            <input
              type="text"
              value={drop}
              onChange={(e) => setDrop(e.target.value)}
              placeholder="Where are you going?"
              className="outline-0 w-full"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-orange-600 text-white text-lg rounded-2xl px-12 py-4 hover:bg-orange-700 shadow-lg shadow-orange-300 flex gap-1 items-center"
        >
          Find a ride 
          <FaArrowRight/>
        </button>
      </form>
    </div>
  );
}

export default RideBookBar;