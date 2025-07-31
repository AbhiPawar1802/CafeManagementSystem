import React from "react";
// import Header from "../../components/Header";
// import Footer from "../../components/Footer";
// import Dashboard from "../Reservation";
import HeroSection from "../../components/HeroSection";
import AboutSection from "../../components/AboutSection";
import MenuSection from "../../components/MenuSection";
import ChefsSection from "../../components/ChefsSection";
import Reservation from "../../components/Reservation";
import Footer from "../../components/Footer";
// import Sidebar from "../../components/Sidebar";
import './Dashboard.css';



const Dashboard = () => {
  return (
    <>
      {/* <Header /> */}
      <HeroSection/>
      <AboutSection/>
      <MenuSection />
      <ChefsSection />
      <Reservation />
      <Footer />
      {/* <Sidebar/> */}
      {/* <Footer /> */}
    </>
  );
};

export default Dashboard;
