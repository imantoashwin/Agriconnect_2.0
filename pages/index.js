import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";
import HomeComponent1 from "../components/HomeComponent/HomeComponent1";
import HomeComponent2 from "../components/HomeComponent/HomeComponent2";
import HomeComponent3 from "../components/HomeComponent/HomeComponent3";
import HomeComponent4 from "../components/HomeComponent/HomeComponent4";
import HomeComponent5 from "../components/HomeComponent/HomeComponent5";

export default function Home() {
  return (
    <div className="">
      <Navbar />
      <HomeComponent1 />
      <HomeComponent2 />
      <HomeComponent3 />
      <HomeComponent4 />
      <HomeComponent5 />
      <Footer />
    </div>
  );
}
