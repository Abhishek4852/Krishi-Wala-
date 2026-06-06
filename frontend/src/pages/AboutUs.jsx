import React from "react";

const AboutUs = () => {
  return (
    <div className="bg-gradient-to-br from-green-50 via-white to-green-100 py-16 px-6 sm:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-green-800 mb-6">
          🌾 About Us
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-8">
          <strong>KrishiWala</strong> is a smart agricultural platform built to uplift farmers by providing easy and quick access to essential resources like land, machinery, and laborers. Our aim is to reduce the hassle and bring technology closer to the fields.
        </p>
        <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-8">
          Whether you're a landowner, a machine provider, or a skilled worker — KrishiWala connects you to the right people in just a few clicks. Our simple interface ensures that even first-time users can post, search, and collaborate without any confusion.
        </p>
        <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
          With KrishiWala, we’re not just building a platform — we’re building a community. A community that supports farmers, respects labor, and celebrates agriculture.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
