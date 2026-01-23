import { motion } from "framer-motion";

const CitySkyline = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-0">
      <motion.svg
        viewBox="0 0 1920 400"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMax slice"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        {/* Background layer - distant buildings */}
        <g fill="white" opacity="0.03">
          <rect x="50" y="280" width="60" height="120" />
          <rect x="130" y="250" width="40" height="150" />
          <rect x="190" y="300" width="50" height="100" />
          <rect x="260" y="220" width="45" height="180" />
          <rect x="330" y="270" width="55" height="130" />
          <rect x="410" y="240" width="35" height="160" />
          <rect x="470" y="290" width="60" height="110" />
          <rect x="550" y="200" width="50" height="200" />
          <rect x="620" y="260" width="40" height="140" />
          <rect x="680" y="230" width="55" height="170" />
          <rect x="760" y="280" width="45" height="120" />
          <rect x="830" y="210" width="60" height="190" />
          <rect x="910" y="250" width="35" height="150" />
          <rect x="970" y="290" width="50" height="110" />
          <rect x="1040" y="220" width="55" height="180" />
          <rect x="1120" y="260" width="40" height="140" />
          <rect x="1180" y="240" width="60" height="160" />
          <rect x="1260" y="280" width="45" height="120" />
          <rect x="1330" y="200" width="50" height="200" />
          <rect x="1400" y="250" width="55" height="150" />
          <rect x="1480" y="270" width="40" height="130" />
          <rect x="1540" y="230" width="60" height="170" />
          <rect x="1620" y="290" width="45" height="110" />
          <rect x="1690" y="260" width="55" height="140" />
          <rect x="1770" y="240" width="50" height="160" />
          <rect x="1840" y="280" width="60" height="120" />
        </g>

        {/* Middle layer - medium buildings */}
        <g fill="white" opacity="0.06">
          <rect x="20" y="300" width="80" height="100" />
          <rect x="120" y="260" width="55" height="140" />
          <rect x="200" y="290" width="70" height="110" />
          <rect x="300" y="240" width="50" height="160" />
          <rect x="380" y="280" width="65" height="120" />
          <rect x="480" y="220" width="75" height="180" />
          <rect x="590" y="270" width="55" height="130" />
          <rect x="680" y="250" width="80" height="150" />
          <rect x="800" y="290" width="60" height="110" />
          <rect x="900" y="230" width="70" height="170" />
          <rect x="1010" y="260" width="50" height="140" />
          <rect x="1100" y="280" width="65" height="120" />
          <rect x="1200" y="220" width="75" height="180" />
          <rect x="1310" y="270" width="55" height="130" />
          <rect x="1400" y="240" width="80" height="160" />
          <rect x="1520" y="290" width="60" height="110" />
          <rect x="1620" y="250" width="70" height="150" />
          <rect x="1730" y="270" width="65" height="130" />
          <rect x="1830" y="300" width="70" height="100" />
        </g>

        {/* Foreground layer - prominent buildings with details */}
        <g fill="white" opacity="0.1">
          {/* Main skyline buildings */}
          <rect x="0" y="320" width="100" height="80" />
          <rect x="80" y="280" width="70" height="120" />
          <rect x="170" y="250" width="60" height="150" />
          <rect x="250" y="300" width="80" height="100" />
          <rect x="360" y="220" width="55" height="180" />
          <rect x="450" y="260" width="90" height="140" />
          <rect x="580" y="200" width="70" height="200" />
          <rect x="690" y="280" width="85" height="120" />
          <rect x="820" y="240" width="60" height="160" />
          
          {/* Central prominent tower */}
          <rect x="920" y="160" width="80" height="240" />
          <rect x="935" y="140" width="50" height="20" />
          
          <rect x="1050" y="270" width="75" height="130" />
          <rect x="1170" y="230" width="65" height="170" />
          <rect x="1280" y="280" width="90" height="120" />
          <rect x="1410" y="210" width="70" height="190" />
          <rect x="1520" y="260" width="80" height="140" />
          <rect x="1640" y="290" width="65" height="110" />
          <rect x="1740" y="250" width="75" height="150" />
          <rect x="1850" y="320" width="80" height="80" />
        </g>

        {/* Window lights - subtle glowing dots */}
        <g fill="white" opacity="0.15">
          {/* Tower windows */}
          <rect x="930" y="170" width="4" height="4" />
          <rect x="945" y="170" width="4" height="4" />
          <rect x="960" y="170" width="4" height="4" />
          <rect x="975" y="170" width="4" height="4" />
          <rect x="930" y="190" width="4" height="4" />
          <rect x="960" y="190" width="4" height="4" />
          <rect x="945" y="210" width="4" height="4" />
          <rect x="975" y="210" width="4" height="4" />
          <rect x="930" y="230" width="4" height="4" />
          <rect x="960" y="250" width="4" height="4" />
          
          {/* Scattered windows on other buildings */}
          <rect x="590" y="220" width="3" height="3" />
          <rect x="605" y="240" width="3" height="3" />
          <rect x="620" y="220" width="3" height="3" />
          <rect x="180" y="270" width="3" height="3" />
          <rect x="195" y="290" width="3" height="3" />
          <rect x="370" y="240" width="3" height="3" />
          <rect x="385" y="260" width="3" height="3" />
          <rect x="1180" y="250" width="3" height="3" />
          <rect x="1195" y="270" width="3" height="3" />
          <rect x="1420" y="230" width="3" height="3" />
          <rect x="1435" y="250" width="3" height="3" />
          <rect x="1450" y="230" width="3" height="3" />
        </g>
      </motion.svg>
    </div>
  );
};

export default CitySkyline;
