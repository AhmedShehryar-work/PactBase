import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="font-sans text-gray-900 bg-gradient-to-b from-gray-50 to-gray-100">
      {/* ======= HERO SECTION ======= */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 sm:px-12">
        <motion.h1
          className="text-4xl sm:text-6xl font-extrabold mb-6 text-[#0b0a1f] leading-tight"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to <span className="text-[#0a063d]">PactBase</span>
        </motion.h1>

        <motion.h5
  className="text-xl sm:text-2xl font-semibold mb-6 text-[#0b0a1f] leading-snug"
  initial={{ opacity: 0, y: -30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1 }}
>
  <span className="text-[#0a063d]">Promises</span> Etched Onto Eternity
</motion.h5>


        <motion.p
          className="max-w-2xl text-gray-700 text-lg sm:text-xl mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          Securely verify and manage your pacts, CNICs, and legal agreements online. 
          Fast, reliable, and fully digital.
        </motion.p>

        <motion.div
          className="flex gap-4 flex-wrap justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 rounded-lg bg-[#0b0a1f] text-white font-semibold hover:bg-[#111024] transition"
          >
            Get Started
          </button>

          <button
            onClick={() => navigate("/search-pact")}
            className="px-6 py-3 rounded-lg border-2 border-[#0b0a1f] text-[#0b0a1f] font-semibold hover:bg-[#0b0a1f] hover:text-white transition"
          >
            Search Pacts
          </button>
        </motion.div>
      </section>

      {/* ======= FEATURES SECTION ======= */}
      <section className="py-20 bg-white">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#0b0a1f] mb-12">
          Why PactBase?
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6">
          <FeatureCard
            title="Secure Verification"
            description="All CNIC and pact data is encrypted and securely verified."
            icon="🔒"
          />
          <FeatureCard
            title="Instant Search"
            description="Find and verify pacts in seconds with our advanced search."
            icon="⚡"
          />
          <FeatureCard
            title="User Friendly"
            description="Clean and intuitive interface for seamless experience."
            icon="👌"
          />
          <FeatureCard
            title="Digital Management"
            description="Manage your agreements and documents fully online."
            icon="💻"
          />
          <FeatureCard
            title="Reliable"
            description="Our platform is designed for high uptime and fast responses."
            icon="⏱️"
          />
          <FeatureCard
            title="24/7 Support"
            description="Get help whenever you need from our dedicated team."
            icon="📞"
          />
        </div>
      </section>

      {/* ======= CTA SEARCH SECTION ======= */}
      <section className="py-20 bg-gradient-to-r from-[#0b0a1f] to-[#0a063d] text-white text-center px-6">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Find a Pact Instantly
        </motion.h2>
        <motion.p
          className="max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          Use our advanced search engine to check or verify any pact quickly and securely.
        </motion.p>

        <button
          onClick={() => navigate("/search-pact")}
          className="px-8 py-3 rounded-lg bg-white text-[#0b0a1f] font-semibold hover:bg-gray-200 transition"
        >
          Search Now
        </button>
      </section>

      {/* ======= FOOTER ======= */}
      <footer className="bg-[#0b0a1f] text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} PactBase. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- FEATURE CARD COMPONENT ---------- */
function FeatureCard({ title, description, icon }) {
  return (
    <motion.div
      className="bg-gray-50 p-6 rounded-xl shadow-md flex flex-col items-center text-center hover:shadow-xl transition"
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}
