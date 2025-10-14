"use client";
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export default function Reveal({ children, className, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { margin: "-10% 0px -10% 0px" });
  const controls = useAnimation();
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    if (inView) {
      setHasBeenVisible(true);
      controls.start("visible");
    } else if (hasBeenVisible) {
      controls.start("hidden");
    }
  }, [inView, controls, hasBeenVisible]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { 
          opacity: 0, 
          y: 40, 
          filter: "blur(6px)",
          transition: { duration: 0.4, ease: "easeIn" }
        },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.6, ease: "easeOut", delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}


