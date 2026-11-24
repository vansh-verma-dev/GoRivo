import React from 'react';
import { FiNavigation } from 'react-icons/fi';
import { FaInstagram, FaTwitter, FaLinkedinIn, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200/80 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-100">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center">
                <FiNavigation className="w-4 h-4 rotate-45" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                Go<span className="text-orange-500">Rivo</span>
              </span>
            </a>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              Fast, safe aur affordable city rides — har roz ke safar ko
              banayein aasan GoRivo ke saath.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {[FaInstagram, FaTwitter, FaLinkedinIn, FaGithub].map(
                (Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-orange-500 text-gray-600 hover:text-white flex items-center justify-center transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                )
              )}
            </div>
          </div>

          {/* Column 1 */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li><a href="#" className="hover:text-orange-500">About Us</a></li>
              <li><a href="#" className="hover:text-orange-500">Careers</a></li>
              <li><a href="#" className="hover:text-orange-500">Blog</a></li>
              <li><a href="#" className="hover:text-orange-500">Press</a></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
              Products
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li><a href="#rides" className="hover:text-orange-500">GoRivo Moto</a></li>
              <li><a href="#rides" className="hover:text-orange-500">GoRivo Auto</a></li>
              <li><a href="#rides" className="hover:text-orange-500">GoRivo Mini</a></li>
              <li><a href="#rides" className="hover:text-orange-500">GoRivo Prime</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li><a href="#safety" className="hover:text-orange-500">Safety Center</a></li>
              <li><a href="#" className="hover:text-orange-500">Help & FAQs</a></li>
              <li><a href="#" className="hover:text-orange-500">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-orange-500">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} GoRivo Technologies. All rights reserved.</p>
          <p>Made with React & Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;