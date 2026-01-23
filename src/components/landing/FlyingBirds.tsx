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
        x: ["0vw", "130vw"],
        y: [0, -12, 6, -18, 10, -6, 0],
        opacity: [0, 0.5, 0.5, 0.5, 0.5, 0.5, 0]
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
        y: {
          duration: duration / 4,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className="text-white/60"
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
            duration: 0.2,
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
            duration: 0.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {/* Body */}
        <circle cx="16" cy="16" r="1.5" fill="currentColor" />
      </motion.svg>
    </motion.div>
  );
};

// Bird formation group - birds flying together in V formation
const BirdFormation = ({ baseDelay, baseY, duration }: { baseDelay: number; baseY: number; duration: number }) => {
  return (
    <>
      {/* Leader bird */}
      <Bird delay={baseDelay} duration={duration} startX={-8} startY={baseY} size={22} />
      
      {/* Left wing of formation */}
      <Bird delay={baseDelay + 0.15} duration={duration} startX={-10} startY={baseY - 3} size={18} />
      <Bird delay={baseDelay + 0.3} duration={duration} startX={-12} startY={baseY - 6} size={16} />
      <Bird delay={baseDelay + 0.45} duration={duration} startX={-14} startY={baseY - 9} size={14} />
      
      {/* Right wing of formation */}
      <Bird delay={baseDelay + 0.15} duration={duration} startX={-10} startY={baseY + 3} size={18} />
      <Bird delay={baseDelay + 0.3} duration={duration} startX={-12} startY={baseY + 6} size={16} />
      <Bird delay={baseDelay + 0.45} duration={duration} startX={-14} startY={baseY + 9} size={14} />
    </>
  );
};

// Small scattered group
const BirdCluster = ({ baseDelay, baseY, duration }: { baseDelay: number; baseY: number; duration: number }) => {
  return (
    <>
      <Bird delay={baseDelay} duration={duration} startX={-5} startY={baseY} size={20} />
      <Bird delay={baseDelay + 0.1} duration={duration} startX={-7} startY={baseY - 2} size={16} />
      <Bird delay={baseDelay + 0.2} duration={duration} startX={-6} startY={baseY + 3} size={18} />
      <Bird delay={baseDelay + 0.25} duration={duration} startX={-9} startY={baseY + 1} size={15} />
    </>
  );
};

const FlyingBirds = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Formation groups - V shape */}
      <BirdFormation baseDelay={0} baseY={25} duration={9} />
      <BirdFormation baseDelay={8} baseY={55} duration={10} />
      <BirdFormation baseDelay={16} baseY={40} duration={8} />
      
      {/* Smaller scattered clusters */}
      <BirdCluster baseDelay={4} baseY={15} duration={11} />
      <BirdCluster baseDelay={12} baseY={70} duration={9} />
      <BirdCluster baseDelay={20} baseY={35} duration={10} />
      
      {/* Individual scattered birds */}
      <Bird delay={2} duration={12} startX={-3} startY={48} size={17} />
      <Bird delay={6} duration={8} startX={-6} startY={62} size={19} />
      <Bird delay={10} duration={11} startX={-4} startY={22} size={16} />
      <Bird delay={14} duration={9} startX={-7} startY={75} size={18} />
      <Bird delay={18} duration={10} startX={-5} startY={32} size={20} />
      <Bird delay={22} duration={8} startX={-8} startY={58} size={15} />
    </div>
  );
};

export default FlyingBirds;
