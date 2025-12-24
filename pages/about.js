import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Head from "next/head";

function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>About AgriConnect</title>
      </Head>
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <section className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-poppins">
            About AgriConnect
          </h1>
          <p className="text-gray-600 text-base md:text-lg font-poppins max-w-2xl mx-auto">
            AgriConnect is a minimal, modern ecommerce platform that connects farmers
            directly with consumers, helping fresh produce move from farm to home
            with transparency and trust.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-10 mb-12">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3 font-poppins">
              What this application does
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed font-poppins">
              The application provides a simple marketplace for agricultural products:
            </p>
            <ul className="mt-3 space-y-2 text-gray-600 text-sm md:text-base font-poppins list-disc list-inside">
              <li>Farmers list fruits, vegetables and other produce with price and stock.</li>
              <li>Consumers browse nearby products, view details and add items to cart.</li>
              <li>Orders are placed securely with support for online payment or cash on delivery.</li>
              <li>Order history, ratings and reviews help buyers choose trusted sellers.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3 font-poppins">
              Who uses AgriConnect
            </h2>
            <ul className="space-y-2 text-gray-600 text-sm md:text-base font-poppins list-disc list-inside">
              <li>
                <span className="font-semibold text-gray-800">Consumers</span> discover
                fresh local produce, compare prices and get orders delivered to their doorstep.
              </li>
              <li>
                <span className="font-semibold text-gray-800">Farmers</span> manage their
                inventory, track orders and reach more customers without middlemen.
              </li>
              <li>
                <span className="font-semibold text-gray-800">Administrators</span>{" "}
                oversee products, users and orders through a dedicated dashboard.
              </li>
            </ul>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-100 p-5 shadow-sm">
            <h3 className="text-md font-semibold text-gray-900 mb-2 font-poppins">
              Transparent pricing
            </h3>
            <p className="text-gray-600 text-sm font-poppins">
              Direct farmer-to-consumer pricing, with no hidden layers or complex flows on the frontend.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-5 shadow-sm">
            <h3 className="text-md font-semibold text-gray-900 mb-2 font-poppins">
              Simple experience
            </h3>
            <p className="text-gray-600 text-sm font-poppins">
              Clean navigation, focused product cards and streamlined cart & checkout pages.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-5 shadow-sm">
            <h3 className="text-md font-semibold text-gray-900 mb-2 font-poppins">
              Built for growth
            </h3>
            <p className="text-gray-600 text-sm font-poppins">
              The UI is designed so you can easily extend categories, add new product types
              and evolve the platform without clutter.
            </p>
          </div>
        </section>

        <section className="mt-12 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3 font-poppins">Origin</h2>
            <p className="text-gray-600 text-sm md:text-base font-poppins">
              AgriConnect began as a student project to solve food waste and improve
              farmer incomes by connecting local growers directly with consumers.
              The prototype focused on simplicity: clear product listings, honest
              pricing and an easy checkout flow tailored for small-scale producers.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3 font-poppins">Achievements</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Launched MVP in 2024 and onboarded 500+ farmers.</li>
              <li>Processed 10,000+ orders with an average rating of 4.8/5.</li>
              <li>Formed partnerships with local co-ops to improve supply chain visibility.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3 font-poppins">Project Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* Team Card: Asha */}
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden h-80 md:h-96 flex flex-col">
                <div className="relative h-[60%] w-full bg-gray-200">
                  {/* Replace with team photo: /Images/Team/Asha.jpg */}
                  {/* <Image src="/Images/Team/Asha.jpg" alt="Asha" fill className="object-cover" /> */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-semibold">Photo
                  </div>
                </div>
                <div className="h-[40%] w-full p-4 flex flex-col justify-center">
                  <p className="font-semibold text-gray-900 text-lg">Asha S.</p>
                  <p className="text-gray-600 text-sm md:text-base">Product Lead — building product vision and farmer partnerships.</p>
                </div>
              </div>

              {/* Team Card: Rahul */}
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden h-80 md:h-96 flex flex-col">
                <div className="relative h-[60%] w-full bg-gray-200">
                  {/* Replace with team photo: /Images/Team/Rahul.jpg */}
                  {/* <Image src="/Images/Team/Rahul.jpg" alt="Rahul" fill className="object-cover" /> */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-semibold">Photo
                  </div>
                </div>
                <div className="h-[40%] w-full p-4 flex flex-col justify-center">
                  <p className="font-semibold text-gray-900 text-lg">Rahul P.</p>
                  <p className="text-gray-600 text-sm md:text-base">Frontend Engineer — UI/UX and responsive design.</p>
                </div>
              </div>

              {/* Team Card: Nina */}
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden h-80 md:h-96 flex flex-col">
                <div className="relative h-[60%] w-full bg-gray-200">
                  {/* Replace with team photo: /Images/Team/Nina.jpg */}
                  {/* <Image src="/Images/Team/Nina.jpg" alt="Nina" fill className="object-cover" /> */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-semibold">Photo
                  </div>
                </div>
                <div className="h-[40%] w-full p-4 flex flex-col justify-center">
                  <p className="font-semibold text-gray-900 text-lg">Nina K.</p>
                  <p className="text-gray-600 text-sm md:text-base">Backend Engineer — APIs, data and integrations.</p>
                </div>
              </div>

              {/* Team Card: Jon */}
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden h-80 md:h-96 flex flex-col">
                <div className="relative h-[60%] w-full bg-gray-200">
                  {/* Replace with team photo: /Images/Team/Jon.jpg */}
                  {/* <Image src="/Images/Team/Jon.jpg" alt="Jon" fill className="object-cover" /> */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-semibold">Photo
                  </div>
                </div>
                <div className="h-[40%] w-full p-4 flex flex-col justify-center">
                  <p className="font-semibold text-gray-900 text-lg">Jon M.</p>
                  <p className="text-gray-600 text-sm md:text-base">Operations — farmer outreach and logistics.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default About;
