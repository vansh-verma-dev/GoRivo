import React from 'react';
import {
  FiShield,
  FiKey,
  FiShare2,
  FiHeadphones,
  FiTag,
  FiStar,
} from 'react-icons/fi';

const features = [
  {
    title: 'OTP Ride Verification',
    description:
      'Har ride start hone se pehle 4-digit PIN verify hota hai taaki aap sahi driver aur gaadi mein hi baithein.',
    icon: FiKey,
  },
  {
    title: 'Live Trip Sharing',
    description:
      'Ek tap mein apni live route location family ya doston ke saath share karein.',
    icon: FiShare2,
  },
  {
    title: 'Verified Captains',
    description:
      'Har GoRivo driver ka background check, license verification aur regular vehicle inspection hota hai.',
    icon: FiShield,
  },
  {
    title: 'Upfront Transparent Pricing',
    description:
      'Booking se pehle exact fare dekhein — koi hidden charges ya unexpected surge surprise nahi.',
    icon: FiTag,
  },
  {
    title: '24/7 Emergency SOS',
    description:
      'In-app SOS button aur dedicated safety team har waqt aapki madad ke liye active rehti hai.',
    icon: FiHeadphones,
  },
  {
    title: 'Top-Rated Experience',
    description:
      'Clean vehicles, polite drivers aur har trip ke baad instant rating system.',
    icon: FiStar,
  },
];

const SafetyFeatures = () => {
  return (
    <section
      id="safety"
      className="bg-orange-50/40 py-16 lg:py-24 border-t border-orange-100/70"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <span className="inline-block px-3.5 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider">
            Why GoRivo
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Built for your <span className="text-orange-500">safety & comfort.</span>
          </h2>
          <p className="text-gray-600 text-base">
            Har safar mein bharosa aur suraksha — GoRivo ke smart safety tools ke saath.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_6px_24px_rgb(0,0,0,0.04)] hover:border-orange-200 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center text-xl mb-5">
                  <IconComponent />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
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

export default SafetyFeatures;