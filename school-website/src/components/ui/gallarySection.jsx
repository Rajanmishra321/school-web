// GallerySection.jsx
import React, { useEffect, useRef } from 'react';

const GallerySection = ({ gallery, homeContent, loading }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    // Don't start animation if data is still loading or gallery is empty
    if (loading || !gallery || gallery.length === 0) return;

    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const scrollStep = 1; // pixels per frame - increase for faster speed
    const scrollSpeed = 10; // milliseconds between frames - decrease for faster speed

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
  }, [loading, gallery]); // Re-run when loading or gallery changes

  // Show loading state
  if (loading) {
    return (
      <section className="relative h-64 sm:h-96 md:h-120 overflow-hidden bg-gray-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500">Loading gallery...</div>
        </div>
      </section>
    );
  }

  // Show message if no gallery images
  if (!gallery || gallery.length === 0) {
    return (
      <section className="relative h-64 sm:h-96 md:h-120 overflow-hidden bg-gray-100">
        <div className="absolute inset-0 bg-gradient-to-r from-green-950 to-transparent flex items-center">
          <div className="container mx-auto px-4 text-center md:text-left md:ml-12">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-2 sm:mb-4">
              {homeContent?.welcome || "Welcome"}
            </h2>
            <p className="text-sm sm:text-lg md:text-xl text-white max-w-3xl mx-auto md:mx-0 mb-4 sm:mb-8">
              {homeContent?.description || ""}
            </p>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg transition-colors">
              Explore Our School
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-64 sm:h-96 md:h-120 overflow-hidden">
      {/* Moving gallery in background */}
      <div className="absolute inset-0 w-full h-full mb-5">
        <div className="h-full py-4 overflow-hidden">
          <div 
            ref={scrollRef}
            className="flex gap-4 h-full"
            style={{ width: 'max-content' }}
          >
            {/* Original images */}
            {gallery.map((img, index) => (
              <div
                key={`original-${img.id}-${index}`}
                className="min-w-[300px] sm:min-w-[280px] md:min-w-[600px] h-full flex-shrink-0"
              >
                <img
                  src={img.imageUrl || "/api/placeholder/1600/900"}
                  alt="gallery"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
            {/* Duplicate images for seamless loop */}
            {gallery.map((img, index) => (
              <div
                key={`duplicate-${img.id}-${index}`}
                className="min-w-[300px] sm:min-w-[280px] md:min-w-[600px] h-full flex-shrink-0"
              >
                <img
                  src={img.imageUrl || "/api/placeholder/1600/900"}
                  alt="gallery"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Overlay content */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-950 to-transparent flex items-center">
        <div className="container mx-auto px-4 text-center md:text-left md:ml-12">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-2 sm:mb-4">
            {homeContent?.welcome || "Welcome"}
          </h2>
          <p className="text-sm sm:text-lg md:text-xl text-white max-w-3xl mx-auto md:mx-0 mb-4 sm:mb-8">
            {homeContent?.description || ""}
          </p>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg transition-colors">
            Explore Our School
          </button>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;