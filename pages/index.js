import { useContext, useState } from "react";
import ConnectTogether from "../components/ConnectTogether/ConnectTogether";
import FarmingContent from "../components/FarmingContent/FarmingContent";
import FarmToHome from "../components/FarmToHome/FarmToHome";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";
import NewsFeed from "../components/NewsFeed/NewsFeed";
import OrdersLocation from "../components/OrdersLocation/OrdersLocation";
import { getCookie, hasCookie, setCookie } from "cookies-next";
import AdminPanel from "../components/AdminPanel/adminPanel";
import HomeComponent1 from "../components/HomeComponent/HomeComponent1";
export default function Home() {
  return (
    <div className="">
      <Navbar />
      <HomeComponent1 />
      <Footer />
    </div>
    // <AdminPanel/>
  );
}
