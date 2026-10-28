import { FaArrowRight, FaRegClock } from "react-icons/fa";
import { HiOutlineShieldCheck } from "react-icons/hi";
import { IoWalletOutline } from "react-icons/io5";

const Details = [
    {
        icon: <HiOutlineShieldCheck />,
        name: "Safety comes first",
        tittle: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos quod natus itaque minus dolorem quidem, quaerat"
    },
    {
        icon: <IoWalletOutline />,
        name: "Clear pricing",
        tittle: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos quod natus itaque minus dolorem quidem, quaerat"
    },
    {
        icon: <FaRegClock />,
        name: "Save your time",
        tittle: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos quod natus itaque minus dolorem quidem, quaerat"
    }
]

function WhyGorivoSection() {
    return (
        <div className="w-full p-4 sm:p-6 lg:p-10 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">

            {/* Header */}
            <div className="lg:w-[40%]">
                <p className="text-orange-400 font-bold text-sm sm:text-base">THE GORIVO DIFFERENCE</p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
                    Good rides begin with <br className="hidden sm:block" /> a better experience.
                </h1>
                <p className="text-gray-500 text-base sm:text-lg mt-2 max-w-md">
                    We want to make booking a ride feel easy from the first tap to the end of your journey.
                </p>
                <button
                    className="mt-4 bg-orange-500 text-white shadow-md shadow-amber-300 flex justify-center items-center gap-2 px-6 py-3 rounded-2xl hover:bg-orange-600 duration-300"
                >
                    Start your journey <FaArrowRight />
                </button>
            </div>

            {/* Cards */}
            <div className="flex overflow-x-auto py-2 lg:w-[60%]">
                {
                    Details.map((data) => {
                        return (
                            <div
                                key={data.name}
                                className="w-[260px] sm:w-[300px] lg:w-auto lg:flex-1 shrink-0 lg:shrink border border-gray-300 m-2 rounded-2xl p-4 hover:shadow-lg hover:border-orange-400 duration-300 cursor-pointer"
                            >
                                <span className="w-12 h-12 flex items-center justify-center bg-orange-300 text-orange-600 text-2xl rounded-full">
                                    {data.icon}
                                </span>
                                <h2 className="text-xl font-semibold text-gray-800 mt-3">{data.name}</h2>
                                <p className="text-sm text-gray-500 mt-1">{data.tittle}</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default WhyGorivoSection;