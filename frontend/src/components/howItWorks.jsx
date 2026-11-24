import React, { useState } from 'react';
import {
  FiMapPin,
  FiNavigation,
  FiCheckCircle,
  FiUserCheck,
  FiDollarSign,
  FiSmartphone,
} from 'react-icons/fi';

const flows = {
  rider: [
    {
      step: '01',
      title: 'Set Pickup & Drop',
      description:
        'Apna current pickup location aur destination enter karein — turant upfront fare aur ETA dekhein.',
      icon: FiMapPin,
    },
    {
      step: '02',
      title: 'Pick Your GoRivo Ride',
      description:
        'Moto, Auto, Mini ya Prime mein se apni pasand ki ride chunein aur ek tap mein confirm karein.',
      icon: FiNavigation,
    },
    {
      step: '03',
      title: 'Track & Ride Safely',
      description:
        'Live map par driver ko track karein, OTP verify karke ride shuru karein aur seamlessly pay karein.',
      icon: FiCheckCircle,
    },
  ],
  driver: [
    {
      step: '01',
      title: 'Go Online Anytime',
      description:
        'GoRivo Partner dashboard kholein aur apni marzi ke time par online aakar nearby requests paayein.',
      icon: FiSmartphone,
    },
    {
      step: '02',
      title: 'Accept & Pick Up Rider',
      description:
        'Clear pickup route aur fare preview ke saath ride accept karein aur rider ko safely pick karein.',
      icon: FiUserCheck,
    },
    {
      step: '03',
      title: 'Complete & Earn Instantly',
      description:
        'Trip complete hote hi aapki earnings seedhe wallet mein credit ho jaati hain — zero delay.',
      icon: FiDollarSign,
    },
  ],
};

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState('rider'); // 'rider' | 'driver'
  const currentSteps = flows[activeTab];

  return (
    <section className="bg-white py-16 lg:py-24 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header + Toggle */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
          <span className="inline-block px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200/80 text-orange-600 text-xs font-bold uppercase tracking-wider">
            How GoRivo Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Book a ride in <span className="text-orange-500">3 easy steps.</span>
          </h2>
          <p className="text-gray-600 text-base">
            Simple, fast aur transparent — chahe aap ride book kar rahe hon ya
            GoRivo ke saath drive kar rahe hon.
          </p>

          {/* Rider / Driver Switcher */}
          <div className="pt-2 flex justify-center">
            <div className="inline-flex bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('rider')}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'rider'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                For Riders
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('driver')}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'driver'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                For Drivers
              </button>
            </div>
          </div>
        </div>

        {/* 3 Steps Grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Connecting Line on Desktop */}
          <div className="hidden md:block absolute top-14 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-orange-200 via-orange-400 to-orange-200 z-0" />

          {currentSteps.map((item) => {
            const IconComponent = item.icon;

            return (
              <div
                key={item.step}
                className="relative z-10 bg-white rounded-2xl p-7 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-orange-200 hover:shadow-md transition-all text-center flex flex-col items-center"
              >
                {/* Step Number + Icon */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 text-orange-500 flex items-center justify-center text-2xl shadow-xs">
                    <IconComponent />
                  </div>
                  <span className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                    {item.step}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold text-gray-900 mb-2.5">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;