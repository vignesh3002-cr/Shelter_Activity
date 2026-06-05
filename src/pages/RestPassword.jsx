import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, X } from "lucide-react";
import { useState } from "react";

export default function ResetPasswordModal({
  isOpen,
  onClose,
  onSubmit,
}) {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const[error,setError] = useState('');
  const oldPassword = localStorage.getItem("password");
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }else if (formData.newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
    }else{
         
        onSubmit(formData);
        return(console.log("form data:", formData));
    }
    
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 30,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 30,
            }}
            transition={{
              duration: 0.25,
            }}
            className="absolute z-50 w-full max-w-md p-6 bg-white border border-gray-200 shadow-2xl top rounded-3xl left-[1%] md:left-[30%] top-[12%] "
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-black">
                  Reset Password
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update your account password securely
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 transition rounded-lg hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Old Password */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Current Password
              </label>

              <div className="relative">
                <Lock
                  size={16}
                  className="absolute text-gray-400 left-3 top-3"
                />

                <input
                  type={showOld ? "text" : "password"}
                  name="oldPassword"
                  value={oldPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  className="w-full py-3 pl-10 pr-10 transition border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                />

                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute text-gray-500 right-3 top-3"
                >
                  {showOld ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                New Password
              </label>

              <div className="relative">
                <Lock
                  size={16}
                  className="absolute text-gray-400 left-3 top-3"
                />

                <input
                  type="text"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="w-full py-3 pl-10 pr-10 transition border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                />

                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute text-gray-500 right-3 top-3"
                >
                  {showNew ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Confirm Password
              </label>

              <div className="relative">
                <Lock
                  size={16}
                  className="absolute text-gray-400 left-3 top-3"
                />

                <input
                  type="text"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className="w-full py-3 pl-10 pr-10 transition border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirm(!showConfirm)
                  }
                  className="absolute text-gray-500 right-3 top-3"
                >
                  {showConfirm ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Password Strength */}
                <p>{error}</p>
            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 font-medium text-black transition border border-gray-300 rounded-xl hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="flex-1 py-3 font-medium text-white transition bg-black rounded-xl hover:bg-gray-800"
              >
                Update Password
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}