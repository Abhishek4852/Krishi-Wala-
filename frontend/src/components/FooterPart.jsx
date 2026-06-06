import React from "react";

function FooterPart() {
  return (
    <footer className="bg-green-700 border-b-4 text-white w-full mt-auto border-t-2 border-green-700 shadow-inner">
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Company Info */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">🌾 KrishiWala</h2>
          <p className="text-sm">"Digital Solutions for Farmers"</p>
          <p className="text-sm">📞 +91 9876543899</p>
          <p className="text-sm">✉ contact@krishiWalawebsite.com</p>
          <p className="text-sm">📍block  seoni malwa dist. Narmadapuram , India</p>
        </div>

        {/* Navigation */}
        <div>
          <h2 className="text-xl font-semibold text-white">📌 Navigation</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="#" className="hover:pl-2 transition-all duration-300 ease-in-out hover:text-green-800">🏠 Home</a>
            </li>
         
            <li>
              <a href="#" className="hover:pl-2 transition-all duration-300 ease-in-out hover:text-green-800">🚜 our Services</a>
            </li>
            

            <li>
              <a href="#" className="hover:pl-2 transition-all duration-300 ease-in-out hover:text-green-800">📬 Contact Us</a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="text-xl font-semibold text-white">🌐 Follow Us</h2>
          <div className="flex flex-col space-y-2 mt-4 text-sm">
            <a href="#" className="flex items-center gap-2 hover:text-green-800 transition-all duration-300">
              📘 Facebook
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-green-800 transition-all duration-300">
              🐦 Twitter
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-green-800 transition-all duration-300">
              📷 Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-green-300/50 py-4 text-center text-lg text-white">
      Developed by : <a href="https://www.linkedin.com/in/abhishek-yaduwanshi-8b5065267/" className="hover:text-yellow-400 transition-colors duration-300"> <u  >Abhishek Yaduwanshi</u> </a> <a href="https://www.linkedin.com/in/geetanshi-jain-0b310725a/" className="hover:text-yellow-400 transition-colors duration-300"><u>Geetanshi jain,</u></a> <a href="https://www.linkedin.com/in/sachin-yaduwanshi-b5709a251/" className="hover:text-yellow-400 transition-colors duration-300"><u>Sachin yaduwanshi</u> </a>
      <p>@ 2025 All Rights Reserved .</p>
      </div>
    </footer>
  );
}

export default FooterPart;