import React from 'react';
import { Link } from 'react-router-dom';
import { howWorks } from '../assets/assets';

const Work = () => {

  const getRoute = (title) => {
    switch (title) {
      case "Create account":
        return "/signup";

      case "Upload resume":
        return "/my-profile";

      case "Find job":
        return "/all-jobs";

      case "Apply Job":
        return "/my-applications";

      default:
        return "/";
    }
  };

  return (
    <div className="bg-gray-50 py-10 px-4 md:px-20">
      <h1 className="text-3xl font-bold text-center mb-10 text-indigo-700">
        How It Works
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {howWorks.map((item) => (
          <Link
            key={item._id}
            to={getRoute(item.title)}
          >
            <div className="flex flex-col items-center text-center bg-gradient-to-b from-white via-indigo-50 to-white p-6 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 h-full">

              <img
                src={item.icon}
                alt={item.title}
                className="w-14 h-14 mb-4"
              />

              <h3 className="text-xl font-semibold mb-2">
                {item.title}
              </h3>

              <p className="text-gray-600">
                {item.desc}
              </p>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Work;