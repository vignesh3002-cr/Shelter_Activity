import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function SuccessPopup({ show }) {

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
          className="fixed inset-0 z-50 flex items-center justify-center  bg-black/30 backdrop-blur-sm"
        >

          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            className="flex flex-col items-center gap-4 p-10 bg-white border border-green-100 shadow-2xl  rounded-3xl"
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

    </AnimatePresence>

  );
}