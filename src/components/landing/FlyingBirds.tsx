import { motion } from "framer-motion";

interface BirdProps {
  delay: number;
  duration: number;
  startX: number;
  startY: number;
  size: number;
}

const Bird = ({ delay, duration, startX, startY, size }: BirdProps) => {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ 
        left: `${startX}%`, 
        top: `${startY}%`,
      }}
      initial={{ x: 0, y: 0, opacity: 0 }}
      animate={{ 
        x: ["0vw", "120vw"],
        y: [0, -15, 8, -20, 12, -8, 0],
        opacity: [0, 0.4, 0.4, 0.4, 0.4, 0.4, 0]
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
        y: {
          duration: duration / 3,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
    >
      {/* Bird body with flapping wings */}
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className="text-[#1e3a5f]"
      >
        {/* Left wing */}
        <motion.path
          d="M16 16 L8 10 Q4 6 1 9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          animate={{
            d: [
              "M16 16 L8 10 Q4 6 1 9",
              "M16 16 L8 16 Q4 18 1 17",
              "M16 16 L8 10 Q4 6 1 9",
            ]
          }}
          transition={{
            duration: 0.25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {/* Right wing */}
        <motion.path
          d="M16 16 L24 10 Q28 6 31 9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          animate={{
            d: [
              "M16 16 L24 10 Q28 6 31 9",
              "M16 16 L24 16 Q28 18 31 17",
              "M16 16 L24 10 Q28 6 31 9",
            ]
          }}
          transition={{
            duration: 0.25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {/* Body - small dot */}
        <circle cx="16" cy="16" r="1.5" fill="currentColor" />
      </motion.svg>
    </motion.div>
  );
};

const FlyingBirds = () => {
  const birds: BirdProps[] = [
    { delay: 0, duration: 8, startX: -5, startY: 15, size: 20 },
    { delay: 1.5, duration: 10, startX: -8, startY: 30, size: 16 },
    { delay: 3, duration: 7, startX: -3, startY: 45, size: 22 },
    { delay: 4.5, duration: 12, startX: -10, startY: 20, size: 18 },
    { delay: 6, duration: 9, startX: -6, startY: 55, size: 20 },
    { delay: 2, duration: 11, startX: -4, startY: 65, size: 14 },
    { delay: 7.5, duration: 8, startX: -7, startY: 25, size: 24 },
    { delay: 5, duration: 10, startX: -2, startY: 40, size: 16 },
    { delay: 8.5, duration: 9, startX: -9, startY: 50, size: 18 },
    { delay: 10, duration: 11, startX: -5, startY: 35, size: 20 },
    { delay: 11.5, duration: 8, startX: -3, startY: 70, size: 15 },
    { delay: 13, duration: 10, startX: -8, startY: 60, size: 17 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {birds.map((bird, index) => (
        <Bird key={index} {...bird} />
      ))}
    </div>
  );
};

export default FlyingBirds;
