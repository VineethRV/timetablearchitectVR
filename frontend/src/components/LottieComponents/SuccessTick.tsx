import React, { useRef, useEffect } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import successAnimation from '@/app/lottie-animations/success-anim.json';

const SuccessTick = () => {
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const tickFrame = 38; // Replace with the actual frame number where the tick mark appears

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.play();
    }
  }, []);

  return (
    <div>
      <Lottie 
        lottieRef={lottieRef}
        animationData={successAnimation}
        loop={false} // Prevent looping
        onComplete={() => {
          // Go to the exact frame with the tick mark and stop
          lottieRef.current?.goToAndStop(tickFrame, true);
        }}
      />
    </div>
  );
};

export default SuccessTick;
