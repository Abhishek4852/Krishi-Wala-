import React from "react";
import SelectAddress from "../components/SelectAddress";
import Headerpart from "../components/Headerpart";
import Mainpart from "../components/Mainpart";
import FooterPart from "../components/FooterPart";
import AboutUs from "./AboutUs";
function Home() {

  return (
    <>
      <Headerpart />
      {/* <div className='h-1 w-full bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200'>    </div> */}

      <Mainpart />
      <AboutUs />
      <FooterPart />
    </>
  );
};

export default Home;