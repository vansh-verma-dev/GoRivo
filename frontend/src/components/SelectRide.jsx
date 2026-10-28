import { FaRupeeSign, FaArrowRight } from "react-icons/fa";

function SelectRide() {
 
    const details = [
        {
            bage: "Budget friendly",
            name: "Go Mini",
            tittle: "Affordable everyday rides",
            price: 149,
            seats: 3,
            img: "https://i.pinimg.com/736x/42/9a/3a/429a3a5a9b3016bf66875f8640ad17e5.jpg"
        },
        {
            bage: "Popular choice",
            name: "Go Comfort",
            tittle: "Extra comfort for your journey",
            price: 219,
            seats: 4,
            img: "https://i.pinimg.com/1200x/5d/3e/4d/5d3e4de2193c4ff877d165eac3a5bf5e.jpg"
        },
        {
            bage: "Extra Space",
            name: "Go XL",
            tittle: "More space for your group",
            price: 329,
            seats: 6,
            img: "https://i.pinimg.com/736x/a7/cc/5c/a7cc5c8ab2a74fbf7e8cda2db6ac0440.jpg"
        }
    ]

    return (
        <div className="w-full p-4 sm:p-6 lg:p-10">
            <p className="text-orange-400 font-bold text-sm sm:text-base">FIND YOUR FIT</p>
            <h1 className="font-medium text-2xl sm:text-3xl lg:text-4xl text-gray-800">A ride for every plan.</h1>
            <p className="text-gray-500 text-base sm:text-lg">From quick everyday trips to group, choose an option that works for you.</p>

            <div className="w-full flex overflow-x-auto py-2 mt-5 lg:grid lg:grid-cols-3 lg:overflow-visible">
                {
                    details.map((data, i) => {
                        return (
                            <div
                                key={i}
                                className="h-[300px] w-[280px] sm:w-[340px] lg:w-auto shrink-0 lg:shrink border border-gray-300 m-2 rounded-2xl pl-4 relative hover:shadow-lg hover:border-orange-400 duration-300"
                            >
                                <span
                                    className="absolute top-2 right-2 bg-amber-100 border border-orange-400 text-xs sm:text-sm text-orange-500 font-semibold rounded-2xl px-2"
                                >{data.bage}</span>

                                <img src={data.img} alt={data.name} className="w-32 sm:w-40" />

                                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">{data.name}</h2>
                                <p className="text-[13px] sm:text-[14px] text-gray-500">{data.tittle}</p>
                                <p className="text-xl sm:text-2xl font-bold text-orange-500 flex items-center">
                                    <FaRupeeSign />{data.price}
                                </p>
                                <p className="font-medium text-gray-600">{data.seats} seats</p>

                                <button
                                    className="flex items-center gap-1 border border-gray-400 rounded-2xl w-[90%] p-2 justify-center absolute bottom-3 hover:bg-orange-500 hover:text-white hover:border-orange-500 duration-300"
                                >Choose {data.name} <FaArrowRight /></button>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default SelectRide