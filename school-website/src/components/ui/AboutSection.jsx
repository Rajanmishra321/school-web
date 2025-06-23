import React from 'react';
import { motion } from 'framer-motion';

const AboutSection = ({ homeContent }) => {
  // Animation variants for different elements
  const fadeUpVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const fadeLeftVariants = {
    hidden: { 
      opacity: 0, 
      x: -80,
      rotate: -5
    },
    visible: { 
      opacity: 1, 
      x: 0,
      rotate: 0,
      transition: {
        duration: 0.9,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const fadeRightVariants = {
    hidden: { 
      opacity: 0, 
      x: 80,
      rotate: 5
    },
    visible: { 
      opacity: 1, 
      x: 0,
      rotate: 0,
      transition: {
        duration: 0.9,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const lineVariants = {
    hidden: { 
      width: 0,
      opacity: 0
    },
    visible: { 
      width: '6rem',
      opacity: 1,
      transition: {
        duration: 1.2,
        delay: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const cardHoverVariants = {
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2
      }
    }
  };

  const dotVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: 0.4
      }
    }
  };

  return (
    <section 
      id="about" 
      className="py-16 sm:py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden"
    >
      {/* Animated Background elements */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.1 }}
        transition={{ duration: 2 }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <motion.div 
          className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"
          animate={{ 
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
        >
          <motion.h2 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
            variants={fadeUpVariants}
          >
            About Our <span className="text-yellow-400">School</span>
          </motion.h2>
          <motion.div 
            className="h-1 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto mb-6"
            variants={lineVariants}
          />
          <motion.p 
            className="text-blue-100 text-xl max-w-3xl mx-auto leading-relaxed"
            variants={fadeUpVariants}
          >
            Discover the values, vision, and rich heritage that shape our educational excellence
          </motion.p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Central Timeline Line */}
          <motion.div 
            className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 via-orange-400 to-yellow-400 hidden lg:block"
            initial={{ scaleY: 0, originY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.2 }}
          />

          {/* Mission Section - Left Side */}
          <motion.div 
            className="flex flex-col lg:flex-row items-center mb-16 lg:mb-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
          >
            <div className="lg:w-1/2 lg:pr-12 mb-8 lg:mb-0">
              <motion.div 
                className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 relative"
                variants={fadeLeftVariants}
                whileHover={cardHoverVariants.hover}
              >
                {/* Timeline dot */}
                <motion.div 
                  className="absolute -right-6 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-yellow-400 rounded-full border-4 border-blue-900 hidden lg:block"
                  variants={dotVariants}
                />
                <div className="flex items-center mb-6">
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl mr-4"
                    variants={iconVariants}
                    whileHover={{ 
                      rotate: 360,
                      transition: { duration: 0.5 }
                    }}
                  >
                    🎯
                  </motion.div>
                  <motion.h3 
                    className="text-3xl font-bold text-white"
                    variants={fadeUpVariants}
                  >
                    Our Mission
                  </motion.h3>
                </div>
                <motion.p 
                  className="text-blue-100 text-lg leading-relaxed"
                  variants={fadeUpVariants}
                >
                  {homeContent?.mission || 'To provide exceptional education that empowers students to reach their full potential, fostering creativity, critical thinking, and character development in every student.'}
                </motion.p>
              </motion.div>
            </div>
            <div className="lg:w-1/2"></div>
          </motion.div>

          {/* Vision Section - Right Side */}
          <motion.div 
            className="flex flex-col lg:flex-row items-center mb-16 lg:mb-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
          >
            <div className="lg:w-1/2 order-2 lg:order-1"></div>
            <div className="lg:w-1/2 order-1 lg:order-2 lg:pl-12 mb-8 lg:mb-0">
              <motion.div 
                className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 relative"
                variants={fadeRightVariants}
                whileHover={cardHoverVariants.hover}
              >
                {/* Timeline dot */}
                <motion.div 
                  className="absolute -left-6 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-purple-400 rounded-full border-4 border-blue-900 hidden lg:block"
                  variants={dotVariants}
                />
                <div className="flex items-center mb-6">
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-2xl mr-4"
                    variants={iconVariants}
                    whileHover={{ 
                      rotate: 360,
                      transition: { duration: 0.5 }
                    }}
                  >
                    🌟
                  </motion.div>
                  <motion.h3 
                    className="text-3xl font-bold text-white"
                    variants={fadeUpVariants}
                  >
                    Our Vision
                  </motion.h3>
                </div>
                <motion.p 
                  className="text-blue-100 text-lg leading-relaxed"
                  variants={fadeUpVariants}
                >
                  {homeContent?.vision || 'To be a leading educational institution that inspires innovation, critical thinking, and lifelong learning, preparing students to become confident global citizens.'}
                </motion.p>
              </motion.div>
            </div>
          </motion.div>

          {/* History Section - Left Side */}
          <motion.div 
            className="flex flex-col lg:flex-row items-center mb-16 lg:mb-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
          >
            <div className="lg:w-1/2 lg:pr-12 mb-8 lg:mb-0">
              <motion.div 
                className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 relative"
                variants={fadeLeftVariants}
                whileHover={cardHoverVariants.hover}
              >
                {/* Timeline dot */}
                <motion.div 
                  className="absolute -right-6 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-green-400 rounded-full border-4 border-blue-900 hidden lg:block"
                  variants={dotVariants}
                />
                <div className="flex items-center mb-6">
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-2xl mr-4"
                    variants={iconVariants}
                    whileHover={{ 
                      rotate: 360,
                      transition: { duration: 0.5 }
                    }}
                  >
                    📚
                  </motion.div>
                  <motion.h3 
                    className="text-3xl font-bold text-white"
                    variants={fadeUpVariants}
                  >
                    Our History
                  </motion.h3>
                </div>
                <motion.p 
                  className="text-blue-100 text-lg leading-relaxed"
                  variants={fadeUpVariants}
                >
                  {homeContent?.history || 'Founded with a commitment to excellence, we have been building a legacy of academic achievement and community service for decades, shaping future leaders.'}
                </motion.p>
              </motion.div>
            </div>
            <div className="lg:w-1/2"></div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
        >
          <motion.button 
            className="inline-flex items-center bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 px-8 rounded-full transition-all duration-300"
            variants={fadeUpVariants}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(255, 193, 7, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            Join Our Educational Journey
            <motion.span 
              className="ml-2 w-2 h-2 bg-blue-900 rounded-full"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;