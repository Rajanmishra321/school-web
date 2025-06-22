// FacilitiesSection.jsx
import React, { useEffect, useRef } from 'react';

const FacilitiesSection = ({ homeContent, loading }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    // Don't start animation if data is still loading or facilities is empty
    if (loading || !homeContent?.facilities || homeContent.facilities.length === 0) return;

    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const scrollStep = 0.8; // pixels per frame - adjust for speed
    const scrollSpeed = 10; // milliseconds between frames

    const scroll = () => {
      scrollAmount += scrollStep;
      
      // Get the width of one complete set (half of total width since we duplicated)
      const totalWidth = scrollContainer.scrollWidth;
      const singleSetWidth = totalWidth / 2;
      
      // Reset when we've scrolled through one complete set
      if (scrollAmount >= singleSetWidth) {
        scrollAmount = 0;
      }
      
      scrollContainer.style.transform = `translateX(-${scrollAmount}px)`;
    };

    const interval = setInterval(scroll, scrollSpeed);
    return () => clearInterval(interval);
  }, [loading, homeContent?.facilities]);

  // Show loading state
  if (loading) {
    return (
      <section id="facilities" className="py-8 sm:py-16 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 text-center mb-8 sm:mb-12">
            Our Facilities
          </h2>
          <div className="text-center text-gray-500">Loading facilities...</div>
        </div>
      </section>
    );
  }

  // Show message if no facilities
  if (!homeContent?.facilities || homeContent.facilities.length === 0) {
    return (
      <section id="facilities" className="py-8 sm:py-16 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 text-center mb-8 sm:mb-12">
            Our Facilities
          </h2>
          <div className="text-center text-gray-500">No facilities information available</div>
        </div>
      </section>
    );
  }

  return (
    <section id="facilities" className="py-8 sm:py-16 bg-blue-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 text-center mb-8 sm:mb-12 relative">
          <span className="relative z-10">Our Facilities</span>
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-yellow-400"></span>
        </h2>

        <div className="overflow-hidden">
          <div className="py-4">
            <div 
              ref={scrollRef}
              className="flex gap-4 sm:gap-6"
              style={{ width: 'max-content' }}
            >
              {/* Original facilities */}
              {homeContent.facilities.map((facility, index) => (
                <div 
                  key={`original-${index}`} 
                  className="w-52 sm:w-64 bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow flex-shrink-0"
                >
                  {/* Fixed height image container */}
                  <div className="h-32 sm:h-48 overflow-hidden">
                    <img
                      src={facility.imageUrl || "/api/placeholder/400/300"}
                      alt={facility.name}
                      className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                    />
                  </div>
                  
                  {/* Content container with flexible height */}
                  <div className="p-3 sm:p-6 flex flex-col">
                    <h3 className="font-bold text-base sm:text-xl text-blue-900 mb-1 sm:mb-2 line-clamp-2">
                      {facility.name}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {facility.description}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Duplicate facilities for seamless loop */}
              {homeContent.facilities.map((facility, index) => (
                <div 
                  key={`duplicate-${index}`} 
                  className="w-52 sm:w-64 bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow flex-shrink-0"
                >
                  {/* Fixed height image container */}
                  <div className="h-32 sm:h-48 overflow-hidden">
                    <img
                      src={facility.imageUrl || "/api/placeholder/400/300"}
                      alt={facility.name}
                      className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                    />
                  </div>
                  
                  {/* Content container with flexible height */}
                  <div className="p-3 sm:p-6 flex flex-col">
                    <h3 className="font-bold text-base sm:text-xl text-blue-900 mb-1 sm:mb-2 line-clamp-2">
                      {facility.name}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {facility.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
    
  );
};

export default FacilitiesSection;