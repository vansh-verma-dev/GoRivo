import React from 'react';
import { FiArrowRight, FiCheck, FiTrendingUp } from 'react-icons/fi';

const DriverPartnerSection = () => {
  return (
    <section id="drive" className="bg-white py-16 lg:py-24 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-orange-500 to-orange-600 p-8 sm:p-12 lg:p-14 text-white shadow-xl shadow-orange-500/15 overflow-hidden relative">
          {/* Decorative Circle */}
          <div className="absolute -right-16 -bottom-16 w-72 h-72 rounded-full bg-white/10 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-white text-xs font-bold uppercase tracking-wider">
                <FiTrendingUp className="w-4 h-4" />
                GoRivo Captain Partner
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
                Drive when you want, earn what you deserve.
              </h2>

              <p className="text-orange-50 text-base sm:text-lg max-w-xl leading-relaxed">
                Apni bike, auto ya car ko GoRivo ke saath register karein aur
                zero commission pressure ke saath daily instant payouts paayein.
              </p>

              {/* Quick Perks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-sm font-medium">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-white text-orange-600 flex items-center justify-center shrink-0">
                    <FiCheck className="w-3.5 h-3.5" />
                  </span>
                  Flexible working hours
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-white text-orange-600 flex items-center justify-center shrink-0">
                    <FiCheck className="w-3.5 h-3.5" />
                  </span>
                  Instant bank withdrawal
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-white text-orange-600 flex items-center justify-center shrink-0">
                    <FiCheck className="w-3.5 h-3.5" />
                  </span>
                  Weekly bonus & incentives
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-white text-orange-600 flex items-center justify-center shrink-0">
                    <FiCheck className="w-3.5 h-3.5" />
                  </span>
                  24/7 Captain support
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  className="bg-white text-orange-600 hover:bg-orange-50 font-bold px-6 py-3.5 rounded-xl inline-flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <span>Register as Driver</span>
                  <FiArrowRight className="w-4 h-4" />
                </button>
                <span className="text-sm text-orange-100">
                  Takes less than 5 minutes to apply
                </span>
              </div>
            </div>

            {/* Right Stats Card */}
            <div className="lg:col-span-5">
              <div className="bg-white text-gray-900 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
                    Partner Highlights
                  </p>
                  <p className="text-xl font-extrabold text-gray-900 mt-1">
                    Growing across 25+ Cities
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="bg-orange-50/70 p-4 rounded-xl">
                    <p className="text-2xl sm:text-3xl font-extrabold text-orange-500">
                      ₹25k+
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Avg. monthly partner earnings
                    </p>
                  </div>
                  <div className="bg-orange-50/70 p-4 rounded-xl">
                    <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                      0%
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Joining or onboarding fee
                    </p>
                  </div>
                  <div className="bg-orange-50/70 p-4 rounded-xl">
                    <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                      15k+
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Active verified captains
                    </p>
                  </div>
                  <div className="bg-orange-50/70 p-4 rounded-xl">
                    <p className="text-2xl sm:text-3xl font-extrabold text-orange-500">
                      24/7
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Instant payout support
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DriverPartnerSection;