import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaArrowRight } from "react-icons/fa";

import Footer_Banner from "../assits/GoRivo_footer_banner.png"


const links = [
    {
        title: "Company",
        items: ["About us", "Careers", "Blog", "Contact"]
    },
    {
        title: "Rides",
        items: ["Go Mini", "Go Comfort", "Go XL", "Outstation"]
    },
    {
        title: "Support",
        items: ["Help center", "Safety", "Terms of service", "Privacy policy"]
    }
]

const socials = [
    { icon: <FaFacebookF />, link: "#" },
    { icon: <FaInstagram />, link: "#" },
    { icon: <FaTwitter />, link: "#" },
    { icon: <FaLinkedinIn />, link: "#" }
]

function Footer() {
    return (
        <footer className="w-full bg-white pt-6 pb-4">

            {/* Banner */}
            <div className="w-[90%] mx-auto rounded-3xl overflow-hidden">
                <img
                    src={Footer_Banner}
                    alt="Gorivo banner"
                    className="w-full h-auto block"
                />
            </div>

            {/* Links */}
            <div className="w-[90%] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 mt-8">

                {/* Brand */}
                <div className="col-span-2 lg:col-span-1">
                    <h2 className="text-3xl font-bold text-black">
                        Go<span className="text-orange-500">rivo</span>
                    </h2>
                    <p className="text-sm text-gray-500 mt-2 max-w-xs">
                        Easy, safe and affordable rides for every plan. Book in a few taps.
                    </p>

                    <div className="flex gap-3 mt-4">
                        {
                            socials.map((data, i) => {
                                return (
                                    <a
                                        key={i}
                                        href={data.link}
                                        className="w-9 h-9 flex items-center justify-center border border-orange-400 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white duration-300"
                                    >
                                        {data.icon}
                                    </a>
                                )
                            })
                        }
                    </div>
                </div>

                {
                    links.map((data) => {
                        return (
                            <div key={data.title}>
                                <h3 className="text-gray-800 font-semibold mb-3">{data.title}</h3>
                                <ul className="flex flex-col gap-2 text-sm text-gray-500">
                                    {
                                        data.items.map((item) => {
                                            return (
                                                <li
                                                    key={item}
                                                    className="cursor-pointer hover:text-orange-500 duration-300"
                                                >{item}</li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        )
                    })
                }
            </div>

            {/* Bottom */}
            <div className="w-[90%] mx-auto border-t border-gray-200 mt-8 pt-4 text-center sm:text-left text-sm text-gray-500">
                <p>© {new Date().getFullYear()} Gorivo. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer;