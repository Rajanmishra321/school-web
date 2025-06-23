import React from "react";

const ContactSection = ({ contactInfo = {} }) => {
  return (
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
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-800 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    📍
                  </div>
                  <div>
                    <h4 className="font-bold text-yellow-400 text-sm sm:text-base">Address</h4>
                    <p className="text-sm sm:text-base">
                      {contactInfo.address || "Address will be displayed here"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-800 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    📞
                  </div>
                  <div>
                    <h4 className="font-bold text-yellow-400 text-sm sm:text-base">Phone</h4>
                    <p className="text-sm sm:text-base">
                      {contactInfo.phone || "Phone number will be displayed here"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-800 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    ✉️
                  </div>
                  <div>
                    <h4 className="font-bold text-yellow-400 text-sm sm:text-base">Email</h4>
                    <p className="text-sm sm:text-base">
                      {contactInfo.email || "Email will be displayed here"}
                    </p>
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
                title="School Location Map"
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
  );
};

export default ContactSection;