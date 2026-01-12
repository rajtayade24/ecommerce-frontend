import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { waitForBackend } from "@/utils/waitForBackend";

export const VITE_API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

const BackendLoader = ({ children }) => {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [max, setMax] = useState(0);

  useEffect(() => {
    let alive = true;

    waitForBackend(VITE_API_BASE, {
      onAttempt: (i, m) => {
        if (!alive) return;
        setAttempt(i);
        setMax(m);
      },
    }).then((ok) => {
      if (!alive) return;
      if (ok) setReady(true);
      else setFailed(true);
    });

    return () => {
      alive = false;
    };
  }, []);

  if (ready) return children;

  if (failed) {
    return (
      <div className="fixed inset-0 bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="tracking-widest text-sm">SERVER UNAVAILABLE</p>
          <p className="mt-2 text-xs text-white/50">
            Please refresh or try again later
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black text-white flex items-center justify-center overflow-hidden">
      {/* Signal animation */}
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
        
        <p className="mt-2 text-xs text-white/40">
          Attempt {attempt} / {max}
        </p>
      </motion.div>
    </div>
  );
};

export default BackendLoader;