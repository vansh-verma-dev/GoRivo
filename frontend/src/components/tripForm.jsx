import { useState } from "react";
import { FaDotCircle, FaSquare } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { FaCarRear } from "react-icons/fa6";

function FindTripForm() {
    const [pickup, setPickup] = useState("");
    const [dropoff, setDropoff] = useState("");
    const [when, setWhen] = useState("now");
    const [dateTime, setDateTime] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // yahan apna search / API logic daalo
        console.log({ pickup, dropoff, when, dateTime });
    };

    const fieldBox =
        "flex items-center gap-3 rounded-xl bg-gray-100 px-4 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-black";
    const inputClass =
        "w-full bg-transparent py-3.5 text-[15px] text-gray-800 placeholder:text-gray-400 outline-none";

    return (
        <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-6 shadow-lg">
            <form onSubmit={handleSubmit}>
                {/* Heading */}
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">Find a trip</h1>
                        <p className="text-sm text-gray-500">Where do you want to go today?</p>
                    </div>
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-gray-100 text-gray-700">
                        <FaCarRear />
                    </span>
                </div>

                {/* Pick-up + Drop-off with connector line */}
                <div className="relative space-y-3">
                    <span
                        aria-hidden="true"
                        className="absolute left-[21px] top-[28px] h-[calc(100%-56px)] w-px bg-gray-300"
                    />

                    <label className={fieldBox}>
                        <FaDotCircle className="relative z-10 shrink-0 text-sm text-gray-800" />
                        <span className="sr-only">Pick-up location</span>
                        <input
                            type="text"
                            required
                            value={pickup}
                            onChange={(e) => setPickup(e.target.value)}
                            placeholder="Pick-up location"
                            className={inputClass}
                        />
                    </label>

                    <label className={fieldBox}>
                        <FaSquare className="relative z-10 shrink-0 text-[11px] text-gray-800" />
                        <span className="sr-only">Drop-off location</span>
                        <input
                            type="text"
                            required
                            value={dropoff}
                            onChange={(e) => setDropoff(e.target.value)}
                            placeholder="Drop-off location"
                            className={inputClass}
                        />
                    </label>
                </div>

                {/* When */}
                <div className="mt-3 grid gap-3">
                    <label className={fieldBox}>
                        <IoMdTime className="shrink-0 text-lg text-gray-700" />
                        <span className="sr-only">Pick-up time</span>
                        <select
                            value={when}
                            onChange={(e) => setWhen(e.target.value)}
                            className={`${inputClass} cursor-pointer`}
                        >
                            <option value="now">Pick-up now</option>
                            <option value="later">Schedule for later</option>
                        </select>
                    </label>

                    {when === "later" && (
                        <label className={fieldBox}>
                            <span className="sr-only">Date and time</span>
                            <input
                                type="datetime-local"
                                required
                                value={dateTime}
                                onChange={(e) => setDateTime(e.target.value)}
                                className={inputClass}
                            />
                        </label>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="mt-5 w-full rounded-xl bg-black py-3.5 text-[15px] font-semibold text-white transition hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                >
                    Search now
                </button>
            </form>
        </div>
    );
}

export default FindTripForm;