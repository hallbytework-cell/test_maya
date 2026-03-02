import { useState, useEffect } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import logger from "@/lib/logger";

export const useFirebasePhoneAuth = (auth) => {
  const [error, setError] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            logger.debug("reCAPTCHA solved");
          },
          "expired-callback": () => {
            logger.warn("reCAPTCHA expired, resetting...");
            setError("reCAPTCHA expired. Please try sending the code again.");
            resetRecaptcha();
          },
        }
      );

      window.recaptchaVerifier.render().catch((err) => {
        logger.error("reCAPTCHA render error", err);
      });
    }
  }, [auth]);

  const resetRecaptcha = () => {
    try {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        delete window.recaptchaVerifier;
      }
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        { size: "invisible" },
        auth
      );
      logger.debug("reCAPTCHA re-initialized after reset");
    } catch (e) {
      logger.warn("Error resetting reCAPTCHA", e);
    }
  };

  const sendOtp = async (phoneNumber) => {
    setError("");

    const fullPhoneNumber = phoneNumber.startsWith("+")
      ? phoneNumber
      : "+91" + phoneNumber;

    try {
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, fullPhoneNumber, appVerifier);
      setConfirmationResult(result);
      return true;
    } catch (err) {
      logger.error("Error sending OTP", err);
      setError("Failed to send OTP: " + err.message);

      if (err.message.includes("reCAPTCHA")) {
        await resetRecaptcha();
      }
      return false;
    }
  };

  const verifyOtp = async (otp) => {
    setError("");
    if (!confirmationResult || !otp) {
      return false;
    }

    try {
      const result = await confirmationResult.confirm(otp);
      logger.debug("OTP verified successfully");
      setUser(result.user);
      return result.user;
    } catch (err) {
      logger.error("Error verifying OTP", err);
      setError("Invalid OTP. Please try again.");
      return false;
    }
  };

  return { sendOtp, verifyOtp, error, user };
};