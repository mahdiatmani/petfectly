'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Heart,
  X,
  MessageCircle,
  Dog,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Hand,
  ArrowLeft,
  ArrowRight,
  Check,
} from 'lucide-react';

// Tutorial state interface
interface TutorialState {
  phase: 'entry' | 'gesture' | 'firstSwipe' | 'buttons' | 'chat' | 'complete';
  showOverlay: boolean;
  showGestureHint: boolean;
  showButtonTooltip: boolean;
  showChatTooltip: boolean;
  hasUserSwiped: boolean;
  gestureTimeout: number | null;
}

// Tutorial configuration
const TUTORIAL_CONFIG = {
  gestureTimeout: 5000, // 5 seconds before showing tap hint
  animationDuration: 2000, // 2 seconds for ghost hand animation
  tooltipDelay: 1000, // 1 second delay before showing tooltips
};

// Sample pet data for tutorial
const tutorialPet = {
  id: 1,
  name: 'Luna',
  age: '2 years',
  breed: 'Golden Retriever',
  distance: '1.2 miles away',
  bio: 'Friendly and playful, loves to fetch and swim!',
  interests: ['Fetch', 'Swimming', 'Hiking'],
  personality: ['Friendly', 'Energetic', 'Social'],
  images: [
    'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
  ],
  lastActive: '10 min ago',
};

// CSS animations as a string
const animationStyles = `
  @keyframes ghostSwipe {
    0%, 100% {
      transform: translateX(-20px);
    }
    50% {
      transform: translateX(20px);
    }
  }
  
  @keyframes swipe-left {
    0% {
      transform: translateX(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateX(-120%) rotate(-20deg);
      opacity: 0;
    }
  }
  
  @keyframes swipe-right {
    0% {
      transform: translateX(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateX(120%) rotate(20deg);
      opacity: 0;
    }
  }
  
  .animate-swipe-left {
    animation: swipe-left 0.5s ease-out forwards;
  }
  
  .animate-swipe-right {
    animation: swipe-right 0.5s ease-out forwards;
  }
  
  @keyframes pulse-border {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.7);
    }
    50% {
      box-shadow: 0 0 0 8px rgba(236, 72, 153, 0);
    }
  }
  
  .animate-pulse-border {
    animation: pulse-border 2s infinite;
  }
  
  .ghost-hand-animation {
    animation: ghostSwipe 2s infinite ease-in-out;
  }
  
  @keyframes confetti-fall {
    0% {
      transform: translateY(-100vh) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(360deg);
      opacity: 0;
    }
  }
  
  .confetti-particle {
    animation: confetti-fall 1.5s ease-in forwards;
  }
`;

// Confetti animation component
const ConfettiExplosion: React.FC<{ show: boolean }> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute confetti-particle"
          style={{
            left: `${20 + (i * 6)}%`,
            top: `-10px`,
            animationDelay: `${i * 0.1}s`,
          }}
        >
          <Sparkles
            size={16}
            className={`text-${['pink', 'yellow', 'purple', 'blue'][i % 4]}-400`}
          />
        </div>
      ))}
    </div>
  );
};

// Ghost hand animation component
const GhostHandAnimation: React.FC<{ show: boolean }> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
      <div className="relative">
        <Hand
          size={48}
          className="text-white opacity-80 ghost-hand-animation"
          style={{
            filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.3))',
          }}
        />
        <ArrowRight
          size={24}
          className="absolute -right-8 top-3 text-white opacity-60 animate-pulse"
        />
      </div>
    </div>
  );
};

// Tooltip component
const Tooltip: React.FC<{
  show: boolean;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  text: string;
  arrow: 'up' | 'down' | 'left' | 'right';
}> = ({ show, position, text, arrow }) => {
  if (!show) return null;

  const arrowStyle = {
    up: {
      borderLeft: '8px solid transparent',
      borderRight: '8px solid transparent',
      borderBottom: '8px solid #ec4899',
      top: '-8px',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    down: {
      borderLeft: '8px solid transparent',
      borderRight: '8px solid transparent',
      borderTop: '8px solid #ec4899',
      bottom: '-8px',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    left: {
      borderTop: '8px solid transparent',
      borderBottom: '8px solid transparent',
      borderRight: '8px solid #ec4899',
      left: '-8px',
      top: '50%',
      transform: 'translateY(-50%)',
    },
    right: {
      borderTop: '8px solid transparent',
      borderBottom: '8px solid transparent',
      borderLeft: '8px solid #ec4899',
      right: '-8px',
      top: '50%',
      transform: 'translateY(-50%)',
    },
  };

  return (
    <div
      className="absolute z-50 animate-in fade-in zoom-in duration-300"
      style={position}
    >
      <div className="relative bg-pink-500 text-white px-4 py-2 rounded-lg shadow-lg max-w-xs">
        <p className="text-sm font-medium">{text}</p>
        <div
          className="absolute w-0 h-0"
          style={arrowStyle[arrow]}
        />
      </div>
    </div>
  );
};

// Main tutorial component
const PetAppTutorial: React.FC = () => {
  const [tutorialState, setTutorialState] = useState<TutorialState>({
    phase: 'entry',
    showOverlay: true,
    showGestureHint: false,
    showButtonTooltip: false,
    showChatTooltip: false,
    hasUserSwiped: false,
    gestureTimeout: null,
  });

  const [showConfetti, setShowConfetti] = useState(false);
  const [cardAnimation, setCardAnimation] = useState('');
  const [showFallbackHint, setShowFallbackHint] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle tutorial progression
  const advanceTutorial = useCallback(() => {
    setTutorialState((prev) => {
      switch (prev.phase) {
        case 'entry':
          // Clear any existing timeout
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          
          // Start gesture timeout for fallback hint
          const gestureTimeout = setTimeout(() => {
            setShowFallbackHint(true);
            setTutorialState((state) => ({
              ...state,
              showGestureHint: false,
            }));
          }, TUTORIAL_CONFIG.gestureTimeout);
          
          timeoutRef.current = gestureTimeout;
          
          return {
            ...prev,
            phase: 'gesture',
            showOverlay: false,
            showGestureHint: true,
          };
        case 'gesture':
        case 'firstSwipe':
          return {
            ...prev,
            phase: 'buttons',
            showGestureHint: false,
            showButtonTooltip: true,
            hasUserSwiped: true,
          };
        case 'buttons':
          return {
            ...prev,
            phase: 'chat',
            showButtonTooltip: false,
            showChatTooltip: true,
          };
        case 'chat':
          return {
            ...prev,
            phase: 'complete',
            showChatTooltip: false,
          };
        default:
          return prev;
      }
    });
  }, []);

  // Handle swipe gestures
  const handleSwipe = useCallback(
    (direction: 'left' | 'right') => {
      if (tutorialState.phase === 'gesture' || tutorialState.phase === 'firstSwipe') {
        // Clear gesture timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        setShowFallbackHint(false);

        // Animate card
        setCardAnimation(direction === 'left' ? 'swipe-left' : 'swipe-right');
        
        // Show confetti for right swipe (like)
        if (direction === 'right') {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 1500);
        }

        // Advance tutorial after animation
        setTimeout(() => {
          advanceTutorial();
          setCardAnimation('');
        }, 500);
      }
    },
    [tutorialState.phase, advanceTutorial]
  );

  // Handle button clicks
  const handleButtonClick = useCallback(
    (action: 'like' | 'dislike' | 'chat') => {
      switch (action) {
        case 'like':
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 1500);
          if (tutorialState.phase === 'buttons') {
            setTimeout(advanceTutorial, 800);
          }
          break;
        case 'dislike':
          if (tutorialState.phase === 'buttons') {
            setTimeout(advanceTutorial, 800);
          }
          break;
        case 'chat':
          if (tutorialState.phase === 'chat') {
            setTimeout(advanceTutorial, 500);
          }
          break;
      }
    },
    [tutorialState.phase, advanceTutorial]
  );

  // Touch gesture handling
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (tutorialState.phase !== 'gesture' && tutorialState.phase !== 'firstSwipe') return;
    
    const startX = e.touches[0].clientX;
    const startY = e.touches[0].clientY;
    
    const handleTouchEnd = (endEvent: TouchEvent) => {
      const endX = endEvent.changedTouches[0].clientX;
      const endY = endEvent.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = startY - endY;
      
      // Only register as swipe if horizontal movement is greater than vertical
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        handleSwipe(diffX > 0 ? 'left' : 'right');
      }
      
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchend', handleTouchEnd);
  }, [tutorialState.phase, handleSwipe]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Include CSS animations */}
      <style>{animationStyles}</style>

      <div className="h-screen max-w-lg mx-auto flex flex-col bg-gray-50 relative overflow-hidden">
        {/* Header */}
        <header className="p-4 flex items-center justify-between bg-white border-b border-gray-100 relative z-10">
          <div className="flex items-center">
            <Dog className="text-pink-500" size={24} />
            <h1 className="text-xl font-bold ml-2 bg-gradient-to-r from-pink-500 to-red-500 text-transparent bg-clip-text">
              Pawfect Match
            </h1>
          </div>
          <div className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full font-medium">
            Tutorial
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-grow overflow-hidden px-4 pb-4 pt-2 relative">
          {/* Pet Card */}
          <div className="h-full flex flex-col relative">
            <div className="relative flex-grow">
              <div
                className={`relative h-full rounded-2xl shadow-xl overflow-hidden bg-white ${
                  cardAnimation ? `animate-${cardAnimation}` : ''
                }`}
                onTouchStart={handleTouchStart}
              >
                {/* Pet Image */}
                <div className="w-full h-full">
                  <img
                    src={tutorialPet.images[0]}
                    alt={tutorialPet.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Pet info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
                  <div className="flex items-center">
                    <h2 className="text-3xl font-bold">
                      {tutorialPet.name}, {tutorialPet.age}
                    </h2>
                    <div className="ml-2 bg-white bg-opacity-20 px-2 py-1 rounded-full text-sm">
                      {tutorialPet.breed}
                    </div>
                  </div>
                  <p className="text-sm mb-3 mt-2">{tutorialPet.bio}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {tutorialPet.interests.map((interest, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-pink-500 bg-opacity-30 px-2 py-1 rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Ghost hand animation */}
                <GhostHandAnimation show={tutorialState.showGestureHint} />

                {/* Fallback touch hint */}
                {showFallbackHint && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
                    <div className="bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg text-center animate-in fade-in zoom-in duration-300">
                      <p className="text-sm font-medium">
                        Tap ✓ ✗ to respond
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-center space-x-8 py-6 relative">
              <div className="relative">
                <button
                  onClick={() => handleButtonClick('dislike')}
                  className={`w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-lg border border-gray-200 transition-all hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-200 ${
                    tutorialState.phase === 'buttons' || showFallbackHint ? 'animate-pulse-border' : ''
                  }`}
                  aria-label="Pass on this pet"
                >
                  <X className="text-red-500" size={32} />
                </button>
                
                {/* Button tooltip */}
                <Tooltip
                  show={tutorialState.showButtonTooltip}
                  position={{ bottom: '80px', left: '-20px' }}
                  text="Tap here to pass"
                  arrow="down"
                />
              </div>

              <div className="relative">
                <button
                  onClick={() => handleButtonClick('like')}
                  className={`w-16 h-16 flex items-center justify-center bg-gradient-to-r from-pink-500 to-red-500 rounded-full shadow-lg text-white transition-all hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-pink-400 ${
                    tutorialState.phase === 'buttons' || showFallbackHint ? 'animate-pulse-border' : ''
                  }`}
                  aria-label="Like this pet"
                >
                  <Heart className="text-white" size={32} />
                </button>
                
                {/* Button tooltip */}
                <Tooltip
                  show={tutorialState.showButtonTooltip}
                  position={{ bottom: '80px', right: '-20px' }}
                  text="Tap here to connect"
                  arrow="down"
                />
              </div>
            </div>
          </div>
        </main>

        {/* Bottom navigation */}
        <nav className="border-t border-gray-200 bg-white relative">
          <div className="flex justify-around">
            <button className="py-3 flex flex-col items-center flex-1 text-pink-500">
              <Dog size={24} />
              <span className="text-xs mt-1">Discover</span>
            </button>
            
            <div className="relative">
              <button
                onClick={() => handleButtonClick('chat')}
                className={`py-3 flex flex-col items-center flex-1 text-gray-500 relative ${
                  tutorialState.phase === 'chat' ? 'animate-pulse-border rounded-lg' : ''
                }`}
              >
                <MessageCircle size={24} />
                <span className="text-xs mt-1">Messages</span>
              </button>
              
              {/* Chat tooltip */}
              <Tooltip
                show={tutorialState.showChatTooltip}
                position={{ bottom: '60px', left: '-40px' }}
                text="Tap here to start chatting"
                arrow="down"
              />
            </div>
            
            <button className="py-3 flex flex-col items-center flex-1 text-gray-500">
              <div className="w-6 h-6 rounded-full bg-gray-400" />
              <span className="text-xs mt-1">Profile</span>
            </button>
          </div>
        </nav>

        {/* Entry Overlay */}
        {tutorialState.showOverlay && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full text-center animate-in zoom-in duration-500">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-white" size={32} />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Here's how to find your match
              </h2>
              
              <p className="text-gray-600 mb-6">
                Swipe → to connect, ← to pass on potential pet friends
              </p>
              
              <div className="flex justify-center space-x-8 mb-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
                    <ArrowLeft className="text-red-500" size={24} />
                  </div>
                  <span className="text-sm text-gray-600">Pass</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-2">
                    <ArrowRight className="text-pink-500" size={24} />
                  </div>
                  <span className="text-sm text-gray-600">Connect</span>
                </div>
              </div>
              
              <button
                onClick={advanceTutorial}
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-lg font-medium hover:from-pink-600 hover:to-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-pink-400 flex items-center justify-center"
              >
                <Check className="mr-2" size={20} />
                Got it!
              </button>
            </div>
          </div>
        )}

        {/* Tutorial complete overlay */}
        {tutorialState.phase === 'complete' && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full text-center animate-in zoom-in duration-500">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="text-white" size={32} />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Tutorial Complete!
              </h2>
              
              <p className="text-gray-600 mb-6">
                You're ready to start finding pawfect matches. Happy swiping!
              </p>
              
              <button
                //onClick={() => window.location.reload()}
                onClick={() => window.location.href = '/'}
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-lg font-medium hover:from-pink-600 hover:to-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                Start Swiping
              </button>
            </div>
          </div>
        )}

        {/* Confetti explosion */}
        <ConfettiExplosion show={showConfetti} />
      </div>
    </>
  );
};

export default PetAppTutorial;
