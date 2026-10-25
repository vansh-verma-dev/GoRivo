import { FaArrowRight, FaRegCheckCircle } from "react-icons/fa";
import GoRivoHeroIMG from "../assits/GoRivo_Hero.png"
import { useNavigate } from "react-router-dom";
 
function HeroSection() {
  const navigate = useNavigate();
  return (
    <div className="sm:flex w-full px-4 sm:px-6 md:px-10 py-8 md:py-10  bg-white">
      <div className="flex flex-col gap-2 w-full md:w-[60%] lg:w-[50%] items-start text-left ">

        <h1 className="bg-orange-200 text-orange-500 font-bold rounded-2xl w-fit px-4 text-center text-xs sm:text-sm py-0.5">
          YOUR JOURNEY MADE SIMPLE
        </h1>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-700">
          Every journey <br className="hidden sm:block" />
          starts with
        </h2>

        <h1 className="text-3xl sm:text-4xl font-bold text-orange-500 mt-2 md:mt-4">
          GoRivo.
        </h1>

        <p className="font-serif text-sm sm:text-base">
          where life takes you, get there with a <br className="hidden md:block" />
          ride that fits yours plans, your comfort and your budget
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 md:gap-10 mt-4 w-full sm:w-auto">
          <button 
          onClick={()=> navigate("/bookRide")}
          className="flex gap-1 justify-center items-center px-6 sm:px-10 py-3 sm:py-4 rounded-2xl border bg-orange-500 text-white font-medium cursor-pointer">
            Book your ride <FaArrowRight />
          </button>
          <button className="flex gap-1 justify-center items-center px-6 sm:px-10 py-3 sm:py-4 rounded-2xl border font-medium cursor-pointer">
            Explore GoRivo
          </button>
        </div>

        <div className="flex  gap-3 sm:gap-10 mt-5 items-start sm:items-center">
          <div className="flex items-center font-medium gap-1.5">
            <FaRegCheckCircle className="text-xl sm:text-2xl text-orange-300" />
            <p className="text-sm sm:text-base">Simple booking</p>
          </div>

          <div className="flex items-center font-medium gap-1.5">
            <FaRegCheckCircle className="text-xl sm:text-2xl text-orange-300" />
            <p className="text-sm sm:text-base">Clear estimated fares</p>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <img src={GoRivoHeroIMG} alt="GoRivo"
        className="rounded-4xl"/>
      </div>
    </div>
  );
}

export default HeroSection;