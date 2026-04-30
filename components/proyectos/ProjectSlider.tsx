// components/proyectos/ProjectSlider.tsx
"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PROJECTS } from "@/lib/constants/projects";

const STRIP_HEIGHT = 80;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) =>
  Math.abs(offset) * velocity;

type Props = {
  page: number;
  direction: number;
  onPaginate: (direction: number) => void;
};

export default function ProjectSlider({ page, direction, onPaginate }: Props) {
  const imageIndex = Math.abs(page % PROJECTS.length);
  const currentProject = PROJECTS[imageIndex];

  return (
    <>
      {/* Hero slider */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: `calc(100vh - ${STRIP_HEIGHT}px)` }}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(_, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) onPaginate(1);
              else if (swipe > swipeConfidenceThreshold) onPaginate(-1);
            }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={currentProject.image}
              alt={currentProject.title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center pointer-events-none"
            />
          </motion.div>
        </AnimatePresence>

        {/* Flechas */}
        <div className="absolute inset-y-0 left-4 md:left-12 flex items-center z-20">
          <button
            onClick={() => onPaginate(-1)}
            className="p-4 text-white hover:opacity-50 transition-opacity focus:outline-none"
          >
            <ArrowLeft size={48} strokeWidth={1} />
          </button>
        </div>
        <div className="absolute inset-y-0 right-4 md:right-12 flex items-center z-20">
          <button
            onClick={() => onPaginate(1)}
            className="p-4 text-white hover:opacity-50 transition-opacity focus:outline-none"
          >
            <ArrowRight size={48} strokeWidth={1} />
          </button>
        </div>
      </div>

      {/* Franja blanca con título */}
      <div
        className="w-full bg-white flex items-center justify-center flex-shrink-0"
        style={{ height: STRIP_HEIGHT }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProject.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col items-center gap-1"
          >
            <div className="flex items-baseline gap-3">
              <span className="text-xl font-bold tracking-tighter text-black leading-none">
                {currentProject.title}
              </span>
              <span className="text-md font-light text-black leading-none">
                {currentProject.year}
              </span>
            </div>
            <span className="text-xs tracking-wider uppercase text-gray-500 font-medium">
              {currentProject.category}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
