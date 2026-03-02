import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { useFirebasePhoneAuth } from '@/hooks/useFirebasePhoneAuth';
import { auth } from '@/config/firebase';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import logger from '@/lib/logger';
import { sendOtp, verifyOtp } from '@/api/auth/auth';

const Login = () => {
    const [mobile, setMobile] = useState('');
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);

    // State for client-side errors
    const [mobileError, setMobileError] = useState('');
    const [otpError, setOtpError] = useState('');

    // UI state
    const [step, setStep] = useState(1); // 1: Mobile input, 2: OTP verification
    // const [toast, setToast] = useState(null); // Toast notification state

    // Reference for OTP inputs
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        logger.info('Login page viewed');
        logger.track('page_view', { page: 'login' });
    }, []);

    const sendOtpMutation = useMutation({
        mutationFn: async (phone) => {
            if (!phone || phone.length !== 10) {
                throw new Error("Please enter a valid 10-digit mobile number");
            }
            logger.debug('Sending OTP', { phoneLength: phone.length });
            const sendFlag = await sendOtp(phone);
            setOtpDigits(['', '', '', '', '', '']);
            if (!sendFlag) {
                throw new Error("Please try after some time")
            }
            return { success: sendFlag };
        },
        onSuccess: () => {
            logger.info('OTP sent successfully');
            logger.track('otp_sent', { step: 'login' });
            setStep(2)
            toast.success("OTP send successfully.")
        },
        onError: (err) => {
            logger.error('Send OTP failed', err);
            toast.error("Something went wrong. Please try after some time...")
        },
    });

    const verifyOtpMutation = useMutation({
        mutationFn: async ({ mobile, otpCode }) => {
            if (!otpCode || otpCode.length !== 6) {
                throw new Error("Invalid OTP. Please enter a 6-digit code.");
            }

            logger.debug('Step 1: Verifying OTP with Firebase...');
            const verifiedUser = await verifyOtp(mobile, otpCode);

            if (!verifiedUser || !verifiedUser?.data?.accessToken) {
                throw new Error("OTP Verification failed.");
            }
            const backendResponse = await login(verifiedUser);
            return backendResponse;
        },
        onSuccess: (backendData) => {
            logger.info('Welcome Sir/Madam, Logged in successfully...... ');

            toast.success(backendData.message ?? "Welcome. Logged in successfully.");
            navigate("/");
        },
        onError: (err) => {
            const errorMessage =
                err.response?.data?.message ||
                err.response?.data?.errorDetails?.message ||
                err.message ||
                "Login failed. Please try again.";

            logger.error(err);
            logger.track('login_failed', { reason: errorMessage });

            toast.error(errorMessage);
        },
    });

    // Combine loading states from both mutations
    const isGlobalLoading = sendOtpMutation.isPending || verifyOtpMutation.isPending;


    const handleMobileChange = (e) => {
        // Enforce digit-only input and maximum length
        const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
        setMobile(value);

        // Client-side validation: only show error if number is partially entered but incomplete (more than 0, less than 10)
        if (value.length > 0 && value.length < 10) {
            setMobileError('Mobile number must be exactly 10 digits.');
        } else {
            setMobileError('');
        }
    };


    const handleGoogleSignIn = () => {
        // setToast({ message: "Google Sign-In initiated (Placeholder)", type: 'info' });
    };

    const triggerVerification = useCallback((enteredOtp) => {
        if (verifyOtpMutation.isPending) return;

        if (enteredOtp.length !== 6) {
            setOtpError("Please enter the complete 6-digit OTP.");
            return;
        }
        setOtpError("");
        verifyOtpMutation.mutate({ mobile, otpCode: enteredOtp });

    }, [mobile, verifyOtpMutation]);



    const handleOtpChange = (index, value) => {
        const digit = value.replace(/[^0-9]/g, '');

        if (digit.length > 1) {
            const newDigits = [...otpDigits];
            for (let i = 0; i < digit.length && index + i < 6; i++) {
                newDigits[index + i] = digit[i];
            }
            setOtpDigits(newDigits);


            const nextIndex = Math.min(index + digit.length - 1, 5);
            if (inputRefs.current[nextIndex]) {
                inputRefs.current[nextIndex].focus();
            }


            const enteredOtp = newDigits.join('');
            if (enteredOtp.length === 6) {
                triggerVerification(enteredOtp);
            }
            return;
        }

        // Handle single digit entry
        const newDigits = [...otpDigits];
        newDigits[index] = digit;
        setOtpDigits(newDigits);

        // Auto-advance cursor
        if (digit !== '' && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }

        // Auto-verify on last digit entry (index 5)
        if (index === 5 && digit !== '') {
            const enteredOtp = newDigits.join('');
            if (enteredOtp.length === 6) {
                triggerVerification(enteredOtp);
            }
        } else {
            if (otpError) setOtpError("");
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && otpDigits[index] === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSendOtp = (e) => {
        e.preventDefault();

        if (mobile.length !== 10) {
            setMobileError("Please enter a valid 10-digit mobile number before proceeding.");
            // setToast({ message: "Please check the mobile number format.", type: 'error' });
            return;
        }

        sendOtpMutation.mutate(mobile);
    };


    return (
        <div className="p-4 md:pt-10 font-sans   flex items-start justify-center">

            <div className="max-w-md w-full mx-auto p-4 md:p-8 bg-white rounded-3xl shadow-2xl transition-all duration-300">

                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-extrabold tracking-tight text-[#34a853] flex items-center justify-center">
                        <span className="text-4xl mr-2">🪴</span> Maya Vriksh
                    </h1>
                    <h2 className="text-xl font-bold text-gray-800 mt-4">Welcome Back!</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {step === 1 ? "Login to access your garden dashboard." : "Secure login via mobile verification."}
                    </p>
                </header>

                {/* Form Body */}
                {step === 1 ?
                    <LoginForm
                        handleSendOtp={handleSendOtp}
                        mobile={mobile}
                        handleMobileChange={handleMobileChange}
                        isLoading={sendOtpMutation.isPending}
                        handleGoogleSignIn={handleGoogleSignIn}
                        mobileError={mobileError} // Passing error state
                    />
                    :
                    <OtpVerification
                        mobile={mobile}
                        otpDigits={otpDigits}
                        isLoading={verifyOtpMutation.isPending}
                        inputRefs={inputRefs}
                        handleOtpChange={handleOtpChange}
                        handleKeyDown={handleKeyDown}
                        setStep={setStep}
                        otpError={otpError} // Passing error state
                        isSendOtpPending={sendOtpMutation.isPending}
                    />
                }

                {/* Footer Link */}
                <div className="mt-8 text-center text-sm">
                    <p className="text-gray-600">
                        Don't have an account?
                        <span onClick={() => navigate("../signup")} className="text-[#34a853] font-semibold hover:underline cursor-pointer ml-1">Sign up here.</span>
                    </p>
                </div>
            </div>


        </div>
    );
};



const LoginForm = ({ handleSendOtp, mobile, handleMobileChange, isLoading, handleGoogleSignIn, mobileError }) => (
    <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-700 text-center ">Login with Mobile OTP</h3>
        <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
                <Input
                    type="tel" // Use tel for better mobile input experience
                    inputMode="numeric"
                    name="mobile"
                    value={mobile}
                    onChange={e => handleMobileChange(e)}
                    onBlur={handleMobileChange} // Add validation on blur
                    placeholder="Mobile Number (10 digits)"
                    required
                    maxLength="10"
                    disabled={isLoading}
                    className={`text-black focus:text-black`}
                />
            </div>

            <button
                type="submit"
                disabled={isLoading || mobile.length !== 10}
                className="w-full py-3 font-semibold text-white bg-[#34a853] rounded-xl shadow-md shadow-[#34a853]/40 hover:bg-[#2e934a] transition-all duration-300 transform hover:scale-[1.01] disabled:bg-gray-400 disabled:shadow-none flex items-center justify-center"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending OTP...
                    </>
                ) : "Login with OTP"}
            </button>
        </form>

        {/* <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm font-medium">OR</span>
            <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3 font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.01] flex items-center justify-center space-x-3 disabled:opacity-70"
        >

            <span>Sign in with Google</span>
        </button> */}
    </div>
);

const OtpVerification = ({ mobile, otpDigits, isLoading, inputRefs, handleOtpChange, handleKeyDown, setStep, otpError, isSendOtpPending }) => {
    // Determine if all OTP fields are filled
    const isOtpComplete = otpDigits.every(digit => digit !== '');

    return (
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <p className="text-gray-600 text-sm mb-4 text-center">
                A 6-digit OTP has been sent to **{mobile}**. Please enter it below.
            </p>

            {/* OTP Input Boxes (6 separate inputs) */}
            <div className={`flex justify-center space-x-2 ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}>
                {otpDigits.map((digit, index) => (
                    <input
                        key={index}
                        ref={el => inputRefs.current[index] = el}
                        type="tel"
                        inputMode="numeric"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        maxLength="1"
                        className={`w-10 h-12 md:w-12 md:h-14 text-2xl font-mono text-center border-2 rounded-xl outline-none transition-all duration-200 
                            ${otpError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-[#34a853] focus:ring-[#34a853]/50'}
                        `}
                        required
                        autoFocus={index === 0 && !isOtpComplete}
                        disabled={isLoading}
                    />
                ))}
            </div>

            {/* OTP Error Message */}
            {otpError && (
                <p className="mt-2 text-sm text-red-500 font-medium text-center flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" x2="12" y1="9" y2="13" /><line x1="12" x2="12.01" y1="17" y2="17" /></svg>
                    {otpError}
                </p>
            )}

            {/* Verification Status/Message */}
            <div className="pt-2">
                {isLoading ? (
                    <div className="w-full py-3 font-semibold text-white bg-[#34a853] rounded-xl shadow-md shadow-[#34a853]/40 flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying OTP...
                    </div>
                ) : (
                    <p className="text-center text-sm text-gray-500 py-3">
                        Enter the 6-digit code above. Verification is automatic upon completion.
                    </p>
                )}
            </div>

            <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-2 text-[#34a853] hover:text-[#2e934a] transition-colors text-sm font-medium disabled:opacity-50"
                disabled={isLoading || isSendOtpPending}
            >
                Change Mobile Number
            </button>
        </form>
    );
}

export default Login;
