import { useState } from "react";
import { X as Times } from "lucide-react";

export default function AuthPopup({
  show,
  onClose,
  onLoginSuccess,
  disableClose = false,
}) {
  const [phase, setPhase] = useState("phone"); // phone -> otp -> register
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [form, setForm] = useState({ name: "", email: "" });
  const [error, setError] = useState("");
  const [userExists, setUserExists] = useState(null);

  const handleClose = () => {
    if (disableClose) return;
    // Reset all states on close
    setPhone("");
    setOtp("");
    setForm({ name: "", email: "" });
    setPhase("phone");
    setError("");
    setUserExists(null);
    onClose();
  };

  const fakeSendOtp = () => {
    if (!phone) {
      setError("Enter phone number");
      return;
    }
    setError("");
    // Imagine OTP sent
    setPhase("otp");
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setError("Please fill in name and email");
      return;
    }
    setError("");
    // localStorage.setItem("authToken", "new-user-token");
    onLoginSuccess();
    handleClose();
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white w-full max-w-md p-6 rounded-xl shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className={`absolute top-3 right-3 text-gray-500 transition-colors ${
            disableClose ? "cursor-not-allowed opacity-50" : "hover:text-red-500"
          }`}
          disabled={disableClose}
        >
          <Times size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          {phase === "phone" && "Sign In / Sign Up"}
          {phase === "otp" && "Enter OTP"}
          {phase === "register" && "Complete Registration"}
        </h2>

        {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}

        {phase === "phone" && (
          <>
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500 mb-4"
            />
            <button
              onClick={fakeSendOtp}
              className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-semibold hover:bg-emerald-700"
            >
              Send OTP
            </button>
          </>
        )}

        {phase === "otp" && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500 mb-4"
            />
            <button
              onClick={fakeVerifyOtp}
              className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-semibold hover:bg-emerald-700"
            >
              Verify OTP
            </button>
          </>
        )}

        {phase === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500"
              required
            />

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-semibold hover:bg-emerald-700"
            >
              Create Account
            </button>

            <div className="text-center text-sm mt-2 text-gray-700">or</div>

            <button
              type="button"
              className="w-full border border-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-100"
              onClick={() => {
                alert("Dummy Google Auth Successful");
                onLoginSuccess();
                handleClose();
              }}
            >
              Continue with Google
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
