import React, { useEffect, useRef, useState } from 'react';

const AboutSection = ({ homeContent }) => {
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef({});

  // List of all section keys
  const sections = ['header', 'mission', 'vision', 'history', 'cta'];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.dataset.section;
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({ ...prev, [sectionId]: true }));
          } else {
            setVisibleSections(prev => ({ ...prev, [sectionId]: false }));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    // Observe all sections
    sections.forEach(section => {
      if (sectionRefs.current[section]) {
        observer.observe(sectionRefs.current[section]);
      }
    });

    return () => {
      sections.forEach(section => {
        if (sectionRefs.current[section]) {
          observer.unobserve(sectionRefs.current[section]);
        }
      });
    };
  }, []);

  const setSectionRef = (section) => (el) => {
    if (el) {
      el.dataset.section = section;
      sectionRefs.current[section] = el;
    }
  };

  return (
    <section 
      id="about" 
      className="py-16 sm:py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div 
          ref={setSectionRef('header')}
          className={`text-center mb-16 transition-all duration-700 ease-out ${
            visibleSections.header ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            About Our <span className="text-yellow-400">School</span>
          </h2>
          <div className={`h-1 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto mb-6 transition-all duration-700 ease-out ${
            visibleSections.header ? 'w-24' : 'w-0'
          }`}></div>
          <p className="text-blue-100 text-xl max-w-3xl mx-auto leading-relaxed">
            Discover the values, vision, and rich heritage that shape our educational excellence
          </p>
        </div>

        {/* Mission Section */}
        <div 
          ref={setSectionRef('mission')}
          className={`flex flex-col lg:flex-row items-center mb-16 transition-all duration-700 ease-out ${
            visibleSections.mission ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}
        >
          <div className="lg:w-1/2 lg:pr-12 mb-8 lg:mb-0">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl mr-4">
                  🎯
                </div>
                <h3 className="text-3xl font-bold text-white">Our Mission</h3>
              </div>
              <p className="text-blue-100 text-lg leading-relaxed">
                {homeContent?.mission || 'To provide exceptional education that empowers students to reach their full potential.'}
              </p>
            </div>
          </div>
          <div className="lg:w-1/2"></div>
        </div>

        {/* Vision Section */}
        <div 
          ref={setSectionRef('vision')}
          className={`flex flex-col lg:flex-row items-center mb-16 transition-all duration-700 ease-out ${
            visibleSections.vision ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}
        >
          <div className="lg:w-1/2 order-2 lg:order-1 lg:pl-12 mb-8 lg:mb-0">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-2xl mr-4">
                  🌟
                </div>
                <h3 className="text-3xl font-bold text-white">Our Vision</h3>
              </div>
              <p className="text-blue-100 text-lg leading-relaxed">
                {homeContent?.vision || 'To be a leading educational institution that inspires innovation and critical thinking.'}
              </p>
            </div>
          </div>
          <div className="lg:w-1/2 order-1 lg:order-2"></div>
        </div>

        {/* History Section */}
        <div 
          ref={setSectionRef('history')}
          className={`flex flex-col lg:flex-row items-center mb-16 transition-all duration-700 ease-out ${
            visibleSections.history ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}
        >
          <div className="lg:w-1/2 lg:pr-12 mb-8 lg:mb-0">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-2xl mr-4">
                  📚
                </div>
                <h3 className="text-3xl font-bold text-white">Our History</h3>
              </div>
              <p className="text-blue-100 text-lg leading-relaxed">
                {homeContent?.history || 'Founded with a commitment to excellence, building a legacy of academic achievement.'}
              </p>
            </div>
          </div>
          <div className="lg:w-1/2"></div>
        </div>

        {/* Call to Action */}
        <div 
          ref={setSectionRef('cta')}
          className={`text-center mt-20 transition-all duration-700 ease-out ${
            visibleSections.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <button className="inline-flex items-center bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 px-8 rounded-full transition-all duration-300">
            Join Our Educational Journey
            <span className="ml-2 w-2 h-2 bg-blue-900 rounded-full animate-ping"></span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;