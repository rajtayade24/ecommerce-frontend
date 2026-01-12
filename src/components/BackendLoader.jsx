import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { waitForBackend } from "@/utils/waitForBackend";

export const BACKEND_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

const BackendLoader = ({ children }) => {
  const [backendReady, setBackendReady] = useState(false);

  useEffect(() => {
    waitForBackend(BACKEND_URL).then(setBackendReady);
  }, []);

  if (backendReady) return children;

  return (
    <div className="fixed inset-0 bg-black text-white flex items-center justify-center overflow-hidden">
      {/* Moving signal lines */}
      <div className="absolute inset-0 flex items-center justify-center gap-2">
        {[...Array(9)].map((_, i) => (
          <motion.div
            key={i}
            className="w-[3px] h-[80px] bg-white/70 rounded-full"
            animate={{
              scaleY: [0.3, 1.2, 0.3],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.1,
            }}
          />
        ))}
      </div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute bottom-16 text-center"
      >
        <p className="text-sm tracking-widest text-white/70">
          CONNECTING TO SERVER
        </p>

        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-2 text-xs text-white/40"
        >
          This may take a few seconds
        </motion.p>
      </motion.div>
    </div>
  );
};

export default BackendLoader;
