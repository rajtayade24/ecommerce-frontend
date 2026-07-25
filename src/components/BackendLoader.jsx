import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { waitForBackend } from "@/utils/waitForBackend";

const SESSION_KEY = "backend-ready";
const SHOW_LOADER_DELAY = 2000; // Show loader only after 2 seconds

const BackendLoader = ({ children }) => {
  const isPaymentSuccess = window.location.pathname.includes("payment-success");

  const [ready, setReady] =useState(() => {
    if (isPaymentSuccess) return true;
    return sessionStorage.getItem(SESSION_KEY) === "true";
  });

  const [failed, setFailed] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(0);

  useEffect(() => {
    if (ready || isPaymentSuccess) return;

    let cancelled = false;

    // Don't show loader immediately.
    const loaderTimer = setTimeout(() => {
      if (!cancelled) {
        setShowLoader(true);
      }
    }, SHOW_LOADER_DELAY);

    (async () => {
      const ok = await waitForBackend({
        maxRetries: 20,
        retryDelay: 2000,
        timeout: 3000,
        onAttempt: (current, total) => {
          if (cancelled) return;
          setAttempt(current);
          setMaxAttempts(total);
        },
      });

      clearTimeout(loaderTimer);

      if (cancelled) return;

      if (ok) {
        sessionStorage.setItem(SESSION_KEY, "true");
        setReady(true);
      } else {
        setShowLoader(true);
        setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(loaderTimer);
    };
  }, [ready, isPaymentSuccess]);

  if (ready) {
    return children;
  }

  // Don't render anything during the first 2 seconds.
  // The backend may already be awake.
  if (!showLoader) {
    return null;
  }

  if (failed) {
    return (
      <div className="fixed inset-0 bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold">
            Server is taking longer than expected
          </p>

          <p className="text-sm text-white/60 mt-2">
            Please refresh in a few moments.
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-5 py-2 rounded-lg bg-white text-black font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black text-white flex items-center justify-center overflow-hidden">

      {/* Animated bars */}
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

      <motion.div
        className="absolute bottom-16 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="tracking-widest text-sm text-white/80">
          CONNECTING TO SERVER
        </p>

        <motion.p
          className="mt-2 text-xs text-white/50"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          Waking up the backend...
        </motion.p>

        <p className="mt-2 text-xs text-white/40">
          Attempt {attempt} / {maxAttempts}
        </p>
      </motion.div>
    </div>
  );
};

export default BackendLoader;