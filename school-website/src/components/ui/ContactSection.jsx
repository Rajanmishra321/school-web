import React, { useState, useEffect, useRef } from "react";
import { MapPin, Phone, Mail, Clock, ArrowRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ContactSection = ({ contactInfo = {} }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [hoveredItem, setHoveredItem] = useState(null);
  const constraintsRef = useRef(null);

  const contactItems = [
    {
      id: 'address',
      icon: MapPin,
      title: 'Our Location',
      content: contactInfo.address || "123 Education Street, Learning City",
      color: 'emerald',
      iconColor: 'text-emerald-400',
      bgColor: 'bg-emerald-900/20',
      borderColor: 'border-emerald-400/30'
    },
    {
      id: 'phone',
      icon: Phone,
      title: 'Call Us',
      content: contactInfo.phone || "+1 (555) 123-4567",
      color: 'blue',
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-900/20',
      borderColor: 'border-blue-400/30'
    },
    {
      id: 'email',
      icon: Mail,
      title: 'Email Us',
      content: contactInfo.email || "hello@school.edu",
      color: 'purple',
      iconColor: 'text-purple-400',
      bgColor: 'bg-purple-900/20',
      borderColor: 'border-purple-400/30'
    }
  ];

  const scheduleItems = [
    { day: 'Mon - Fri', time: '8:00 AM - 3:30 PM', active: true },
    { day: 'Saturday', time: '8:00 AM - 12:30 PM', active: true },
    { day: 'Sun & Holidays', time: 'Closed', active: false }
  ];

  const floatingVariants = {
    initial: { y: 0 },
    animate: (i) => ({
      y: [0, -15, 0],
      transition: {
        duration: 3 + i,
        repeat: Infinity,
        ease: "easeInOut"
      }
    })
  };

  return (
    <section id='contact' className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={floatingVariants}
            initial="initial"
            animate="animate"
            className={`absolute rounded-full opacity-10 ${i % 2 === 0 ? 'bg-emerald-400' : 'bg-purple-400'}`}
            style={{
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-teal-300 bg-clip-text text-transparent">
              Contact Us
            </span>
          </h2>
          <div className="w-24 h-1 mx-auto bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mb-6" />
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">
            We're here to help and answer any questions you might have
          </p>
        </motion.div>

        {/* Contact Cards - Elegant Grid */}
        <motion.div
          ref={constraintsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {contactItems.map((item, index) => (
            <motion.div
              key={item.id}
              className={`relative rounded-2xl overflow-hidden ${item.bgColor} border ${item.borderColor} backdrop-blur-sm`}
              whileHover={{ y: -5 }}
              onMouseEnter={() => setHoveredItem(index)}
              onMouseLeave={() => setHoveredItem(null)}
              drag
              dragConstraints={constraintsRef}
              dragElastic={0.1}
            >
              <div className="p-8 h-full flex flex-col">
                {/* Icon with floating animation */}
                <motion.div
                  animate={{
                    rotate: hoveredItem === index ? [0, 10, -10, 0] : 0,
                    transition: { duration: 0.6 }
                  }}
                  className={`w-16 h-16 rounded-xl ${item.bgColor} border ${item.borderColor} flex items-center justify-center mb-6`}
                >
                  <item.icon className={`w-8 h-8 ${item.iconColor}`} />
                </motion.div>

                <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                <p className="text-blue-200 mb-6">{item.content}</p>

                {/* Animated arrow */}
                <motion.div
                  animate={{
                    x: hoveredItem === index ? [0, 5, 0] : 0,
                    transition: { duration: 1.5, repeat: Infinity }
                  }}
                  className="mt-auto self-start"
                >
                </motion.div>
              </div>

              {/* Hover effect */}
              <AnimatePresence>
                {hoveredItem === index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute inset-0 ${item.color === 'emerald' ? 'bg-emerald-400' : item.color === 'blue' ? 'bg-blue-400' : 'bg-purple-400'}`}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* Schedule and Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Schedule */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8"
          >
            <div className="flex items-center mb-8">
              <div className="p-3 rounded-lg bg-emerald-900/30 border border-emerald-400/30 mr-4">
                <Clock className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Operating Hours</h3>
            </div>

            <div className="space-y-4">
              {scheduleItems.map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className={`flex justify-between items-center p-4 rounded-xl ${item.active ? 'bg-blue-900/20' : 'bg-slate-700/20'} border ${item.active ? 'border-blue-400/20' : 'border-slate-600/20'}`}
                >
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-4 ${item.active ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    <span className={`font-medium ${item.active ? 'text-white' : 'text-slate-400'}`}>
                      {item.day}
                    </span>
                  </div>
                  <span className={`text-sm ${item.active ? 'text-blue-300' : 'text-slate-500'}`}>
                    {item.time}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden border border-slate-700/50"
          >
            {contactInfo.mapUrl ? (
              <>
                <iframe
                  src={contactInfo.mapUrl}
                  width="100%"
                  height="100%"
                  className="aspect-video"
                  allowFullScreen
                  loading="lazy"
                  title="School Location Map"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none" />
              </>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-blue-900/50 to-purple-900/50 flex items-center justify-center">
                <div className="text-center p-8">
                  <MapPin className="w-12 h-12 mx-auto text-blue-400 mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">Our Location</h3>
                  <p className="text-blue-300">{contactItems[0].content}</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Floating CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;