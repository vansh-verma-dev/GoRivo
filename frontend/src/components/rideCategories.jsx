import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaMotorcycle,
  FaCarSide,
  FaCar,
  FaUsers,
  FaClock,
} from 'react-icons/fa';
import { MdElectricRickshaw } from 'react-icons/md';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';

const rides = [
  {
    id: 'moto',
    name: 'GoRivo Moto',
    tagline: 'Beat traffic & save big on quick solo trips',
    seats: '1 Rider',
    eta: '2 min away',
    baseFare: '₹39',
    perKm: '₹6/km',
    badge: 'Fastest',
    icon: FaMotorcycle,
  },
  {
    id: 'auto',
    name: 'GoRivo Auto',
    tagline: 'Pocket-friendly everyday city travel with zero haggling',
    seats: '3 Riders',
    eta: '3 min away',
    baseFare: '₹59',
    perKm: '₹10/km',
    badge: 'Budget Pick',
    icon: MdElectricRickshaw,
  },
  {
    id: 'mini',
    name: 'GoRivo Mini',
    tagline: 'Compact AC hatchbacks for comfortable daily rides',
    seats: '4 Riders',
    eta: '4 min away',
    baseFare: '₹89',
    perKm: '₹13/km',
    badge: 'Popular',
    icon: FaCarSide,
  },
  {
    id: 'prime',
    name: 'GoRivo Prime',
    tagline: 'Spacious sedans & top-rated drivers for smooth rides',
    seats: '4 Riders',
    eta: '5 min away',
    baseFare: '₹129',
    perKm: '₹16/km',
    badge: 'Comfort+',
    icon: FaCar,
  },
];

const RideCategories = () => {
  const [selectedId] = useState('mini');
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };

  const activeRide = rides.find((r) => r.id === selectedId) || rides[2];

  return (
    <section className="bg-orange-50/40 py-16 lg:py-24 border-t border-orange-100/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div className="space-y-2.5 max-w-2xl">
            <span className="inline-block px-3.5 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider">
              Ride Options
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Choose the ride that fits{' '}
              <span className="text-orange-500">your plan.</span>
            </h2>
            <p className="text-gray-600 text-base">
              Quick bike zip se lekar AC sedan tak — transparent fare ke saath
              apni pasand ki ride chunein.
            </p>
          </div>

          <div className="text-sm text-gray-600 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-2xs w-fit">
            Selected:{' '}
            <span className="font-bold text-gray-900">{activeRide.name}</span>{' '}
            <span className="text-orange-600 font-semibold">
              ({activeRide.baseFare} onwards)
            </span>
          </div>
        </div>

        {/* Ride Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {rides.map((ride) => {
            const IconComponent = ride.icon;
            const isSelected = ride.id === selectedId;

            return (
              <div
                key={ride.id}
                onClick={goToLogin}
                className={`group relative rounded-2xl p-6 transition-all duration-200 cursor-pointer border bg-white flex flex-col justify-between ${
                  isSelected
                    ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-lg -translate-y-1'
                    : 'border-gray-200/80 hover:border-orange-300 hover:shadow-md'
                }`}
              >
                <div>
                  {/* Top Row: Icon + Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-13 h-13 rounded-2xl flex items-center justify-center text-2xl transition-colors ${
                        isSelected
                          ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                          : 'bg-orange-50 text-orange-500 group-hover:bg-orange-100'
                      }`}
                    >
                      <IconComponent />
                    </div>

                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        isSelected
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {ride.badge}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3 className="text-lg font-bold text-gray-900">
                      {ride.name}
                    </h3>
                    {isSelected && (
                      <FiCheckCircle className="w-5 h-5 text-orange-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mb-5">
                    {ride.tagline}
                  </p>
                </div>

                {/* Bottom Meta + Fare */}
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1.5">
                      <FaUsers className="text-gray-400" />
                      {ride.seats}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-orange-600 font-medium">
                      <FaClock className="text-orange-400" />
                      {ride.eta}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xl font-extrabold text-gray-900">
                        {ride.baseFare}
                      </span>
                      <span className="text-xs text-gray-400 ml-1.5">
                        {ride.perKm}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        isSelected ? 'text-orange-600' : 'text-gray-400'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Tap to pick'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Action Bar */}
        <div className="mt-10 bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="text-center sm:text-left">
            <p className="text-sm font-bold text-gray-900">
              Ready to book {activeRide.name}?
            </p>
            <p className="text-xs text-gray-500">
              Estimated arrival in {activeRide.eta} • Upfront fare, no hidden
              charges
            </p>
          </div>
          <button
            type="button"
            onClick={goToLogin}
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm shadow-orange-500/20"
          >
            <span>Continue with {activeRide.name}</span>
            <FiArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default RideCategories;