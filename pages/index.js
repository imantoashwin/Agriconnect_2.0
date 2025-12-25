import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";
import HomeComponent1 from "../components/HomeComponent/HomeComponent1";
import HomeComponent2 from "../components/HomeComponent/HomeComponent2";
export default function Home() {
  return (
    <div className="">
      <Navbar />
      <HomeComponent1 />
      <HomeComponent2 />
      <Footer />
    </div>
    // <AdminPanel/>
  );
}
