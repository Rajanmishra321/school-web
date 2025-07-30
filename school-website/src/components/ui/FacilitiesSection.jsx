import React, { useEffect, useRef, useState, useCallback } from 'react';

const FacilitiesSection = ({ homeContent, loading }) => {
  const scrollRef = useRef(null);
  const animationRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const [hoveredCard, setHoveredCard] = useState(null);
  const observerRef = useRef(null);
  const scrollPosition = useRef(0);
  const hoverTimeoutRef = useRef(null);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                    window.innerWidth <= 768 || 
                    'ontouchstart' in window;
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards(prev => new Set([...prev, entry.target.dataset.index]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (loading || !homeContent?.facilities || homeContent.facilities.length === 0) return;

    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollSpeed = 1;
    
    const animate = () => {
      if (!isPaused && scrollContainer) {
        scrollPosition.current += scrollSpeed;
        
        const singleSetWidth = scrollContainer.scrollWidth / 2;
        
        if (scrollPosition.current >= singleSetWidth) {
          scrollPosition.current = 0;
        }
        
        scrollContainer.style.transform = `translateX(-${scrollPosition.current}px)`;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [loading, homeContent?.facilities, isPaused]);

  const clearAllTimeouts = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  const resetHoverState = useCallback(() => {
    clearAllTimeouts();
    setIsPaused(false);
    setHoveredCard(null);
  }, [clearAllTimeouts]);

  const handleCardHover = useCallback((cardId, isHovering) => {
    // Skip all hover logic on mobile
    if (isMobile) return;

    clearAllTimeouts();

    if (isHovering) {
      setIsPaused(true);
      setHoveredCard(cardId);
    } else {
      // Add delay to prevent flickering
      hoverTimeoutRef.current = setTimeout(() => {
        setIsPaused(false);
        setHoveredCard(null);
      }, 200);
    }
  }, [isMobile, clearAllTimeouts]);

  // Force reset on container mouse leave
  const handleContainerMouseLeave = useCallback(() => {
    if (isMobile) return;
    resetHoverState();
  }, [isMobile, resetHoverState]);

  // Handle window focus/blur to reset stuck states
  useEffect(() => {
    const handleFocus = () => {
      if (!isMobile) resetHoverState();
    };

    const handleBlur = () => {
      if (!isMobile) resetHoverState();
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isMobile, resetHoverState]);

  if (loading) {
    return (
      <section id="facilities" className="py-16 sm:py-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-indigo-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-100 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          
          <div className="flex gap-6 overflow-hidden">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="w-80 bg-white rounded-2xl shadow-lg animate-pulse flex-shrink-0">
                <div className="h-56 bg-gray-200 rounded-t-2xl"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-100 rounded mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!homeContent?.facilities || homeContent.facilities.length === 0) {
    return (
      <section id="facilities" className="py-16 sm:py-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 text-center mb-12">
            Our Facilities
          </h2>
          <div className="text-center text-gray-500 text-lg">No facilities information available</div>
        </div>
      </section>
    );
  }

  const FacilityCard = ({ facility, index, isOriginal }) => {
    const cardRef = useRef(null);
    const cardId = `${isOriginal ? 'original' : 'duplicate'}-${index}`;
    const isHovered = !isMobile && hoveredCard === cardId;
    
    useEffect(() => {
      if (cardRef.current && observerRef.current) {
        cardRef.current.dataset.index = cardId;
        observerRef.current.observe(cardRef.current);
      }
    }, [cardId]);

    const isVisible = visibleCards.has(cardId);

    return (
      <div 
        ref={cardRef}
        className={`w-80 bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-500 ease-out flex-shrink-0 group ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        } ${
          isHovered 
            ? 'shadow-2xl -translate-y-6 scale-110 z-50' 
            : isMobile 
              ? 'shadow-lg z-10' 
              : 'hover:shadow-xl hover:-translate-y-2 hover:scale-105 z-10'
        }`}
        style={{ 
          transitionDelay: `${index * 100}ms`,
          transformOrigin: 'center center'
        }}
        onMouseEnter={!isMobile ? () => handleCardHover(cardId, true) : undefined}
        onMouseLeave={!isMobile ? () => handleCardHover(cardId, false) : undefined}
        onTouchStart={(e) => {
          if (isMobile) {
            e.preventDefault();
          }
        }}
      >
        <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
          isHovered 
            ? 'bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-indigo-500/10' 
            : 'bg-transparent'
        }`}></div>
        
        <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
          isHovered 
            ? 'ring-2 ring-blue-400/30 ring-offset-2 ring-offset-white' 
            : 'ring-0'
        }`}></div>
        
        <div className="h-56 overflow-hidden relative">
          <div className={`absolute inset-0 bg-gradient-to-t transition-all duration-500 z-10 ${
            isHovered 
              ? 'from-black/40 via-transparent to-transparent' 
              : 'from-black/20 via-transparent to-transparent'
          }`}></div>
          
          <img
            src={facility.imageUrl || "/api/placeholder/400/300"}
            alt={facility.name}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isHovered 
                ? 'scale-110 brightness-110' 
                : 'scale-100 brightness-100'
            }`}
            loading="lazy"
            draggable={false}
          />
          
          <div className={`absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-blue-600 shadow-md transition-all duration-500 ${
            isHovered 
              ? 'opacity-100 translate-x-0 scale-110' 
              : 'opacity-0 translate-x-8 scale-90'
          } z-20`}>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className={`p-6 relative z-20 transition-all duration-500 ${
          isHovered 
            ? 'bg-gradient-to-b from-white to-blue-50/30' 
            : 'bg-white'
        }`}>
          <h3 className={`font-bold text-xl mb-3 transition-all duration-500 ${
            isHovered 
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 scale-105' 
              : 'text-gray-900 scale-100'
          }`}>
            {facility.name}
          </h3>
          
          <p className={`text-sm leading-relaxed mb-4 transition-all duration-500 ${
            isHovered 
              ? 'text-gray-700' 
              : 'text-gray-600'
          }`}>
            {facility.description}
          </p>
          
          {!isMobile && (
            <button className={`relative w-full py-3 px-6 rounded-xl font-medium overflow-hidden transition-all duration-500 ${
              isHovered 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white opacity-100 translate-y-0 shadow-lg scale-105' 
                : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white opacity-0 translate-y-4 scale-100'
            }`}>
              Learn More
            </button>
          )}
        </div>
      </div>
    );
  };

  const mockFacilities = homeContent?.facilities || [
    {
      name: "Modern Conference Room",
      description: "State-of-the-art conference room equipped with the latest technology for seamless meetings and presentations.",
      imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Fitness Center",
      description: "Fully equipped fitness center with modern equipment and professional trainers to help you stay in shape.",
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Rooftop Garden",
      description: "Beautiful rooftop garden providing a peaceful environment for relaxation and outdoor meetings.",
      imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Cafeteria",
      description: "Spacious cafeteria serving fresh, healthy meals prepared by professional chefs using quality ingredients.",
      imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <section id="facilities" className="py-16 sm:py-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-indigo-400 rounded-full blur-3xl animate-pulse"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4 relative">
            Our Facilities
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 w-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"></div>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Discover our world-class facilities designed to provide the best experience and support for your needs
          </p>
        </div>

        <div 
          ref={containerRef}
          className="overflow-hidden relative"
          onMouseLeave={handleContainerMouseLeave}
        >
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-blue-50 via-blue-50/80 to-transparent z-30 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-indigo-50 via-indigo-50/80 to-transparent z-30 pointer-events-none"></div>
          
          <div className="py-8">
            <div 
              ref={scrollRef}
              className="flex gap-8"
              style={{ 
                width: 'max-content',
                willChange: 'transform'
              }}
            >
              {mockFacilities.map((facility, index) => (
                <FacilityCard 
                  key={`original-${index}`}
                  facility={facility}
                  index={index}
                  isOriginal={true}
                />
              ))}
              
              {mockFacilities.map((facility, index) => (
                <FacilityCard 
                  key={`duplicate-${index}`}
                  facility={facility}
                  index={index}
                  isOriginal={false}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FacilitiesSection;