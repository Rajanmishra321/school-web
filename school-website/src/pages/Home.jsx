import React, { useEffect, useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { UserCircle, Bell, ArrowRight } from "lucide-react";
import logo from "../assets/logo.jpg"; // Placeholder logo, replace with actual logo path

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

        // Correct way to access notices from the structure
        const noticesList = noticesSnap.exists() ? noticesSnap.data().noticesList || [] : [];

        // Filter active notices and sort by date
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
        setLoading(false); // Make sure to set loading to false even on error
      }
    };

    fetchAllData();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-blue-50">
      <div className="text-2xl font-bold text-blue-900">Loading...</div>
    </div>
  );

  const NoticesModal = () => (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center transition-opacity ${showNotices ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-3/4 overflow-auto mx-4">
        <div className="bg-blue-900 text-white px-4 py-3 flex justify-between items-center rounded-t-lg">
          <h3 className="text-xl font-bold">Latest Notices</h3>
          <button onClick={() => setShowNotices(false)} className="text-white hover:text-yellow-300">
            ✕
          </button>
        </div>
        <div className="p-6 space-y-4">
          {notices.length > 0 ? (
            notices.map((notice, index) => (
              <div key={index} className="border-l-4 border-yellow-400 pl-4 py-2">
                <h4 className="font-bold text-lg text-blue-900">{notice.title}</h4>
                <p className="text-gray-700">{notice.content}</p>
                <p className="text-xs text-gray-500 mt-1">📅 {notice.date}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No notices available at this time.</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-sans bg-blue-50 min-h-screen">
      {/* Top Navigation */}
      <div className="bg-orange-500 text-white py-2 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="text-center sm:text-left mb-2 sm:mb-0 hidden sm:block">
            <span className="mr-4 block sm:inline">📞 {contactInfo.phone}</span>
            <span className="block sm:inline">✉️ {contactInfo.email}</span>
          </div>
          <div className="flex gap-2 w-full sm:w-auto justify-around">
            <button
              className="flex items-center gap-1 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-medium transition-colors"
              onClick={() => window.location.href = "/admin-login"}
            >
              <UserCircle size={16} />
              <span>Admin Login</span>
            </button>
            <button
              className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-sm font-medium transition-colors text-blue-900"
              onClick={() => setShowNotices(true)}
            >
              <Bell size={16} />
              <span>Notices</span>
            </button>
          </div>
        </div>
      </div>

      {/* Header with Logo */}
      <header className="bg-gradient-to-r bg-gray-300 text-gray-600 py-2">
        <div className="mr-4 ml-4 mx-auto flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center md:mb-1">
            <div className="w-15 h-15 rounded-full sm:w-24 sm:h-24 md:w-30 md:h-30 sm:rounded-full overflow-hidden bg-white mr-4 flex items-center justify-center">
              {/* Logo with explicit rounded corners for mobile */}
              <img
                src={logo}
                alt="School Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div className=" md:text-left text-left">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">{homeContent.schoolName || "Dynamic Academy Of Science"}</h1>
              <p className="text-gray-800 text-sm sm:text-base">{homeContent.tagline || "Growing a bright future"}</p>
            </div>
          </div>

          {/* Desktop Navigation only - No mobile menu */}
          <nav className="hidden md:flex gap-6 display-none">
            <a href="#about" className="hover:text-white hover:border-black hover:bg-black transition-colors rounded-lg border-3 p-2 border-white-400 flex">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 p-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
              About
            </a>
            <a href="#facilities" className="hover:text-white hover:border-black hover:bg-black transition-colors rounded-lg border-3 p-2 border-white-400 flex">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 p-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
              </svg>
              Facilities
            </a>
            <a href="#contact" className="hover:text-white hover:border-black hover:bg-black transition-colors rounded-lg border-3 p-2 border-white-400 flex">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 p-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 3.75v4.5m0-4.5h-4.5m4.5 0-6 6m3 12c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 0 1 4.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 0 0-.38 1.21 12.035 12.035 0 0 0 7.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 0 1 1.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 0 1-2.25 2.25h-2.25Z" />
              </svg>
              Contact
            </a>
          </nav>
        </div>

        {/* Removed Mobile Navigation Links */}
      </header>

      {/* Hero Banner with Moving Gallery Background */}
      <div>
        <section className="relative h-64 sm:h-96 md:h-120 overflow-hidden">
          {/* Moving gallery in background */}
          <div className="absolute inset-0 w-full h-full">
            <div className="flex gap-4 animate-scroll-slow whitespace-nowrap py-4">
              {[...gallery, ...gallery, ...gallery].map((img, index) => (
                <div
                  key={`${img.id}-${index}`}
                  className="min-w-[300px] sm:min-w-[280px] md:min-w-[600px] h-full"
                >
                  <img
                    src={img.imageUrl || "/api/placeholder/1600/900"}
                    alt="gallery"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-green-950 to-transparent flex items-center">
            <div className="container mx-auto px-4 text-center md:text-left md:ml-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-2 sm:mb-4">{homeContent.welcome}</h2>
              <p className="text-sm sm:text-lg md:text-xl text-white max-w-3xl mx-auto md:mx-0 mb-4 sm:mb-8">{homeContent.description}</p>
              <button className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg transition-colors">
                Explore Our School
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Notice Ticker */}
      {notices.length > 0 && (
        <div className="bg-yellow-400 py-2 px-4 overflow-hidden">
          <div className="flex items-center text-blue-900 font-medium">
            <span className="mr-4 whitespace-nowrap text-sm sm:text-base">📢 Latest:</span>
            <div className="whitespace-nowrap animate-marquee text-sm sm:text-base overflow-hidden">
              {notices.map((notice, index) => (
                <span key={index} className="mr-16">
                  {notice.title} {index < notices.length ? " • " + notice.content : ''}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* About Section */}
      <section id="about" className="py-8 sm:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 text-center mb-8 sm:mb-12 relative">
            <span className="relative z-10">About Our School</span>
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1"></span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-blue-50 rounded-lg p-4 sm:p-6 shadow-md transform hover:scale-105 transition-transform">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-yellow-400 flex items-center justify-center text-blue-900 text-xl sm:text-2xl mx-auto mb-4">
                🎯
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-blue-900 text-center mb-2 sm:mb-4">Our Mission</h3>
              <p className="text-gray-700 text-center text-sm sm:text-base">{homeContent.mission}</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 sm:p-6 shadow-md transform hover:scale-105 transition-transform">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-yellow-400 flex items-center justify-center text-blue-900 text-xl sm:text-2xl mx-auto mb-4">
                👁️
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-blue-900 text-center mb-2 sm:mb-4">Our Vision</h3>
              <p className="text-gray-700 text-center text-sm sm:text-base">{homeContent.vision}</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 sm:p-6 shadow-md transform hover:scale-105 transition-transform sm:col-span-2 md:col-span-1 mx-auto sm:mx-0 max-w-md">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-yellow-400 flex items-center justify-center text-blue-900 text-xl sm:text-2xl mx-auto mb-4">
                📜
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-blue-900 text-center mb-2 sm:mb-4">Our History</h3>
              <p className="text-gray-700 text-center text-sm sm:text-base">{homeContent.history}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section with Moving Facilities */}
      <section id="facilities" className="py-8 sm:py-16 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 text-center mb-8 sm:mb-12 relative">
            <span className="relative z-10">Our Facilities</span>
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1"></span>
          </h2>

          <div className="overflow-hidden scroll-container">
            {homeContent.facilities && homeContent.facilities.length > 0 ? (
              <div className="flex gap-4 sm:gap-6 animate-scroll whitespace-nowrap py-4">
                {[...homeContent.facilities, ...homeContent.facilities].map((facility, index) => (
                  <div key={index} className="min-w-52 sm:min-w-64 bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <div className="h-32 sm:h-48 overflow-hidden">
                      <img
                        src={facility.imageUrl || "/api/placeholder/400/300"}
                        alt={facility.name}
                        className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                      />
                    </div>
                    <div className="p-3 sm:p-6">
                      <h3 className="font-bold text-base sm:text-xl text-blue-900 mb-1 sm:mb-2">{facility.name}</h3>
                      <p className="text-gray-600 text-xs sm:text-base">{facility.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">No facilities information available</div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-8 sm:py-16 bg-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 relative">
            <span className="relative z-10">Contact Us</span>
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1"></span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="mb-8">
                <h3 className="text-lg sm:text-xl font-bold mb-4">Get In Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-800 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">📍</div>
                    <div>
                      <h4 className="font-bold text-yellow-400 text-sm sm:text-base">Address</h4>
                      <p className="text-sm sm:text-base">{contactInfo.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-800 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">📞</div>
                    <div>
                      <h4 className="font-bold text-yellow-400 text-sm sm:text-base">Phone</h4>
                      <p className="text-sm sm:text-base">{contactInfo.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-800 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">✉️</div>
                    <div>
                      <h4 className="font-bold text-yellow-400 text-sm sm:text-base">Email</h4>
                      <p className="text-sm sm:text-base">{contactInfo.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-4">School Hours</h3>
                <div className="bg-blue-800 rounded-lg p-3 sm:p-4 text-sm sm:text-base">
                  <div className="flex justify-between py-2 border-b border-blue-700">
                    <span>Monday - Friday</span>
                    <span>8:00 AM - 3:30 PM</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-blue-700">
                    <span>Saturday</span>
                    <span>8:00 AM - 12:30 PM</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Sunday & Holidays</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 md:mt-0">
              {contactInfo.mapUrl ? (
                <iframe
                  src={contactInfo.mapUrl}
                  width="100%"
                  height="300"
                  className="rounded-lg shadow-lg md:h-110"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              ) : (
                <div className="w-full h-64 sm:h-96 bg-blue-800 rounded-lg flex items-center justify-center">
                  <p className="text-center">Map will be displayed here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-2 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-1">
          </div>

          <div className="border-t border-blue-800 pt-4 sm:pt-6 text-center">
            <p className="text-sm sm:text-base">&copy; {new Date().getFullYear()} {homeContent.schoolName || "Dynamic Academy Of Science"}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Notice Modal */}
      <NoticesModal />

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
          width: fit-content; /* Ensure container expands to fit all items */
        }
          /* Mobile-specific animation that moves more slowly */
        @media (max-width: 640px) {
         @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100%)); }
        }
      }
        @keyframes scroll-slow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-700%); }
        }
        .animate-scroll-slow {
          animation: scroll-slow 80s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;