import { motion } from "framer-motion";

interface BirdProps {
  delay: number;
  duration: number;
  startX: number;
  startY: number;
  size: number;
  opacity: number;
}

const Bird = ({ delay, duration, startX, startY, size, opacity }: BirdProps) => {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ 
        left: `${startX}%`, 
        top: `${startY}%`,
      }}
      initial={{ x: 0, y: 0, opacity: 0 }}
      animate={{ 
        x: [0, 100, 300, 600, 1000, 1500],
        y: [0, -20, 10, -30, 20, -10],
        opacity: [0, opacity, opacity, opacity, opacity, 0]
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className="text-[#1e3a5f]"
        animate={{
          scaleY: [1, 0.6, 1, 0.6, 1],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Minimalist bird shape - simple curved wings */}
        <motion.path
          d="M12 12 L6 8 Q4 6 2 8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          style={{ opacity: opacity }}
        />
        <motion.path
          d="M12 12 L18 8 Q20 6 22 8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          style={{ opacity: opacity }}
        />
      </motion.svg>
    </motion.div>
  );
};

const FlyingBirds = () => {
  // Generate multiple birds with different properties
  const birds: BirdProps[] = [
    { delay: 0, duration: 12, startX: -5, startY: 20, size: 16, opacity: 0.15 },
    { delay: 2, duration: 14, startX: -8, startY: 35, size: 12, opacity: 0.12 },
    { delay: 4, duration: 10, startX: -3, startY: 50, size: 18, opacity: 0.18 },
    { delay: 6, duration: 16, startX: -10, startY: 25, size: 14, opacity: 0.1 },
    { delay: 8, duration: 11, startX: -6, startY: 45, size: 15, opacity: 0.14 },
    { delay: 1, duration: 13, startX: -4, startY: 60, size: 13, opacity: 0.11 },
    { delay: 3, duration: 15, startX: -7, startY: 15, size: 17, opacity: 0.16 },
    { delay: 5, duration: 12, startX: -2, startY: 40, size: 11, opacity: 0.13 },
    { delay: 7, duration: 14, startX: -9, startY: 55, size: 16, opacity: 0.15 },
    { delay: 9, duration: 11, startX: -5, startY: 30, size: 14, opacity: 0.12 },
    { delay: 10, duration: 13, startX: -3, startY: 70, size: 12, opacity: 0.1 },
    { delay: 11, duration: 15, startX: -8, startY: 65, size: 15, opacity: 0.14 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {birds.map((bird, index) => (
        <Bird key={index} {...bird} />
      ))}
    </div>
  );
};

export default FlyingBirds;
