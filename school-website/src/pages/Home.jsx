import React, { useEffect, useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { UserCircle, Bell } from "lucide-react";
import logo from "../assets/logo.jpg";
import GallerySection from "@/components/ui/gallarySection";
import FacilitiesSection from "@/components/ui/FacilitiesSection";
import AboutSection from "@/components/ui/AboutSection";
import ContactSection from "@/components/ui/ContactSection";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const [homeContent, setHomeContent] = useState({});
  const [contactInfo, setContactInfo] = useState({});
  const [gallery, setGallery] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotices, setShowNotices] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const homeSnap = await getDoc(doc(db, "siteContent", "home"));
        const contactSnap = await getDoc(doc(db, "schoolData", "contactInfo"));
        const gallerySnap = await getDocs(collection(db, "galleryImages"));
        const noticesSnap = await getDoc(doc(db, "siteContent", "notices"));

        const noticesList = noticesSnap.exists() ? noticesSnap.data().noticesList || [] : [];
        const activeNotices = noticesList
          .filter(notice => notice.active)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setNotices(activeNotices);
        if (homeSnap.exists()) setHomeContent(homeSnap.data());
        if (contactSnap.exists()) setContactInfo(contactSnap.data());

        const galleryData = gallerySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setGallery(galleryData);

        setLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center items-center h-screen bg-blue-50"
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="text-2xl font-bold text-blue-900"
      >
        Loading...
      </motion.div>
    </motion.div>
  );

  const NoticesModal = () => (
    <AnimatePresence>
      {showNotices && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-auto mx-4"
          >
            <div className="bg-blue-900 text-white px-4 py-3 flex justify-between items-center rounded-t-lg">
              <h3 className="text-xl font-bold">Latest Notices</h3>
              <button
                onClick={() => setShowNotices(false)}
                className="text-white hover:text-yellow-300 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              {notices.length > 0 ? (
                notices.map((notice, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-l-4 border-yellow-400 pl-4 py-2"
                  >
                    <h4 className="font-bold text-lg text-blue-900">{notice.title}</h4>
                    <p className="text-gray-700">{notice.content}</p>
                    <p className="text-xs text-gray-500 mt-1">📅 {notice.date}</p>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-gray-500">No notices available at this time.</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // SVG paths for navigation icons
  const navIcons = {
    about: "M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5",
    facilities: "M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z",
    contact: "M20.25 3.75v4.5m0-4.5h-4.5m4.5 0-6 6m3 12c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 0 1 4.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 0 0-.38 1.21 12.035 12.035 0 0 0 7.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 0 1 1.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 0 1-2.25 2.25h-2.25Z"
  };

  return (
    <div className="font-sans bg-blue-50 min-h-screen overflow-x-hidden">
      {/* Top Navigation */}
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-orange-500 text-white py-2 px-4"
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center sm:text-left mb-2 sm:mb-0 hidden sm:block"
          >
            <span className="mr-4 block sm:inline">📞 {contactInfo.phone}</span>
            <span className="block sm:inline">✉️ {contactInfo.email}</span>
          </motion.div>
          <div className="flex gap-2 w-full sm:w-auto justify-around">
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-medium transition-colors"
              onClick={() => window.location.href = "/admin-login"}
            >
              <UserCircle size={16} />
              <span>Admin Login</span>
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-sm font-medium transition-colors text-blue-900"
              onClick={() => setShowNotices(true)}
            >
              <Bell size={16} />
              <span>Notices</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Header with Logo */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r bg-gray-300 text-gray-600 py-2"
      >
        <div className="mr-4 ml-4 mx-auto flex flex-col sm:flex-row items-center justify-between">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", delay: 0.3 }}
            className="flex items-center md:mb-1"
          >
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="w-15 h-15 rounded-full sm:w-24 sm:h-24 sm:rounded-full overflow-hidden bg-white mr-4 flex items-center justify-center"
            >
              <img
                src={logo}
                alt="School Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </motion.div>
            <div className="md:text-left text-left">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl sm:text-2xl md:text-3xl font-bold"
              >
                {homeContent.schoolName || "Dynamic Academy Of Science"}
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-800 text-sm sm:text-base"
              >
                {homeContent.tagline || "Growing a bright future"}
              </motion.p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="hidden md:flex gap-6"
          >
            {[
              { href: "#about", icon: "about", text: "About" },
              { href: "#facilities", icon: "facilities", text: "Facilities" },
              { href: "#contact", icon: "contact", text: "Contact" }
            ].map((item, index) => (
              <motion.a
                key={index}
                whileHover={{
                  y: -3,
                  backgroundColor: "#000",
                  color: "#fff"
                }}
                whileTap={{ scale: 0.95 }}
                href={item.href}
                className="hover:text-white hover:border-black hover:bg-black transition-colors rounded-lg border-3 p-2 border-white-400 flex"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 p-1"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={navIcons[item.icon]} />
                </svg>
                {item.text}
              </motion.a>
            ))}
          </motion.nav>
        </div>
      </motion.header>

      {/* Hero Banner with Moving Gallery Background */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <GallerySection
          gallery={gallery}
          homeContent={homeContent}
          loading={loading}
        />
      </motion.div>

      {/* Notice Ticker */}
      {notices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-yellow-400 py-2 px-4 overflow-hidden relative"
        >
          <div className="flex items-center text-blue-900 font-medium">
            <span className="mr-4 whitespace-nowrap text-sm sm:text-base z-10 relative bg-yellow-400">📢 Latest:</span>
            <div className="flex-1 relative overflow-hidden">
              <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-yellow-400 to-transparent z-10 pointer-events-none"></div>
              <motion.div
                animate={{
                  x: ["0%", "-100%"]
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="whitespace-nowrap text-sm sm:text-base"
              >
                {notices.map((notice, index) => (
                  <span key={index} className="mr-16 inline-block">
                    {notice.title} • {notice.content}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {/* About Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        id="about"
      >
        <AboutSection homeContent={homeContent} />
      </motion.section>

      {/* Facilities Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.2 }}
        id="facilities"
      >
        <FacilitiesSection
          homeContent={homeContent}
          loading={loading}
        />
      </motion.section>

      {/* Contact Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        id="contact"
      >
        <ContactSection contactInfo={contactInfo} />
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-blue-900 text-white"
      >
        <div className="max-w-6xl mx-auto px-2 py-2">
          <div className="border-t border-blue-800 pt-4 sm:pt-6 text-center">
            <p className="text-sm sm:text-base">&copy; {new Date().getFullYear()} {homeContent.schoolName || "Dynamic Academy Of Science"}. All rights reserved.</p>
          </div>
        </div>
      </motion.footer>

      {/* Notice Modal */}
      <NoticesModal />
    </div>
  );
};

export default Home;