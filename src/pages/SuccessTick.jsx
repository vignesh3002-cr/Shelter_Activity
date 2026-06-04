import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import {
  CalendarClock,
  FileText,
  Database,
  UserCheck,
} from "lucide-react";
export default function SuccessPopup({ show,time }) {

  return (

    <AnimatePresence>

      {show && (

        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 80 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 80 }}
          transition={{
            duration: 0.4,
            type: "spring",
            stiffness: 200
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        >

          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            className="flex flex-col items-center gap-4 p-10 bg-white border border-green-100 shadow-2xl rounded-3xl"
          >

            {/* GREEN TICK */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 300
              }}
              className="flex items-center justify-center w-24 h-24 bg-green-100 rounded-full "
            >

              <CheckCircle2
                className="text-green-600"
                size={60}
                strokeWidth={2.5}
              />

            </motion.div>

            {/* TEXT */}
            <div className="text-center">

              <h1 className="text-2xl font-bold text-gray-800">
                Successfully Added
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Your records have been uploaded successfully.
              </p>

            </div>

          </motion.div>

        </motion.div>

      )}
      {time && (  <div className="relative z-50 flex items-center justify-center min-h-screen px-4 overflow-hidden bg-black insert-0">

      {/* Background Grid Dots */}
      <div className="absolute grid grid-cols-4 gap-4 left-20 top-32 opacity-20">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="w-1 h-1 bg-white rounded-full"
          />
        ))}
      </div>

      <div className="absolute grid grid-cols-4 gap-4 right-20 bottom-32 opacity-20">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="w-1 h-1 bg-white rounded-full"
          />
        ))}
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-zinc-900/40 to-transparent blur-2xl" />

      {/* Main Card */}
      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
        className="
          w-full
          max-w-3xl
          rounded-[32px]
          border
          border-zinc-800
          bg-white/[0.03]
          backdrop-blur-xl
          shadow-[0_0_80px_rgba(255,255,255,0.04)]
          overflow-hidden
        "
      >
        <div className="p-10">

          {/* Loader */}
          <div className="flex justify-center mb-10">
            <div className="relative">

              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "linear",
                }}
                className="
                  h-36
                  w-36
                  rounded-full
                  border-[5px]
                  border-zinc-700
                  border-t-white
                "
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <CalendarClock
                  size={42}
                  className="text-white"
                />
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white">
              Updating Your Time Slot
            </h1>

            <p className="max-w-xl mx-auto mt-5 text-lg text-zinc-400">
              Your updated time slot has been received and
              is currently being processed.
            </p>
          </div>

          {/* Timeline */}
          <div className="max-w-md mx-auto mt-16">

            {/* Step 1 */}
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center border rounded-full h-14 w-14 bg-zinc-800 border-zinc-700">
                  <FileText
                    size={22}
                    className="text-white"
                  />
                </div>
                <div className="w-px h-16 bg-zinc-700" />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white">
                  Validating Changes
                </h3>

                <p className="mt-1 text-zinc-400">
                  Checking availability and rules.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center border rounded-full h-14 w-14 bg-zinc-800 border-zinc-700">
                  <Database
                    size={22}
                    className="text-white"
                  />
                </div>
                <div className="w-px h-16 bg-zinc-700" />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white">
                  Updating Records
                </h3>

                <p className="mt-1 text-zinc-400">
                  Applying changes to the system.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6">
              <div className="flex items-center justify-center border rounded-full h-14 w-14 bg-zinc-800 border-zinc-700">
                <UserCheck
                  size={22}
                  className="text-white"
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white">
                  Awaiting Approval
                </h3>

                <p className="mt-1 text-zinc-400">
                  Request is currently under review.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Status */}
        <div className="flex justify-center py-8 border-t border-zinc-800">

          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="flex items-center gap-3 px-8 py-3 text-white border rounded-full border-zinc-700 bg-zinc-900"
          >
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "linear",
              }}
              className="w-4 h-4 border-2 rounded-full border-zinc-500 border-t-white"
            />

            Request Under Process
          </motion.div>
        </div>
      </motion.div>
    </div> )}

    </AnimatePresence>

  );
}