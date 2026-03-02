import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';



const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        mobile: '',
        email: '',
    });
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const [step, setStep] = useState(1); // 1: Registration form, 2: OTP verification
    const [isLoading, setIsLoading] = useState(false);
     const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const navigate = useNavigate();

    const inputRefs = useRef([]);

    // const sendOtpApi=()=>{
    //     return {result:true}
    // }

     // 1. Send OTP Mutation
    // const sendOtpMutation = useMutation(sendOtpApi, {
    //     onSuccess: (data, variables) => {
    //         setMessage('OTP sent successfully. Please check your mobile.');
    //         setMessageType('success');
    //         // Move to step 2 on successful 'send'
    //         setOtpDigits(['', '', '', '', '', '']); // Clear old digits
    //         setStep(2);
    //     },
    //     onError: (error) => {
    //         // Display API error message in the custom modal
    //         setMessage(error.message || 'Failed to send OTP. Please try again.');
    //         setMessageType('error');
    //     }
    // });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Core verification logic separated to be called by auto-trigger
    const runVerification = useCallback((enteredOtp) => {
        if (isLoading) return;

        setIsLoading(true);

        // Final check if all 6 digits are entered (should only be called if length is 6, but good for safety)
        if (enteredOtp.length !== 6) {
            setIsLoading(false);
            // NOTE: Use a custom modal in production instead of alert
            console.error("Please enter the complete 6-digit OTP.");
            alert("Please enter the complete 6-digit OTP.");
            return;
        }

        setTimeout(() => {
            setIsLoading(false);
            if (enteredOtp === '123456') { // Mock OTP
                // NOTE: Use a custom modal in production instead of alert
                alert("Registration successful! Welcome to Maya Vriksh!");
                // Clear form and OTP digits
                setFormData({ firstName: '', lastName: '', mobile: '', email: '' });
                setOtpDigits(['', '', '', '', '', '']);
                setStep(1);
            } else {
                alert("Invalid OTP. Please try again.");
                // If invalid, clear OTP fields for re-entry and focus the first box
                setOtpDigits(['', '', '', '', '', '']);
                if (inputRefs.current[0]) inputRefs.current[0].focus();
            }
        }, 1500);
    }, [isLoading]);


    // Handler for the 6 individual OTP inputs
    const handleOtpChange = (index, value) => {
        // 1. Enforce digit-only input and ensure only a single digit is processed
        const digit = value.replace(/[^0-9]/g, '');

        if (digit.length > 1) {
            // Handle paste: fill subsequent inputs with pasted digits
            const newDigits = [...otpDigits];
            for (let i = 0; i < digit.length && index + i < 6; i++) {
                newDigits[index + i] = digit[i];
            }
            setOtpDigits(newDigits);

            // Move focus to the next empty box or the last box
            const nextIndex = Math.min(index + digit.length, 6) - 1;
            if (inputRefs.current[nextIndex]) {
                inputRefs.current[nextIndex].focus();
            }

            // After pasting, check for completion
            const enteredOtp = newDigits.join('');
            if (enteredOtp.length === 6) {
                runVerification(enteredOtp);
            }
            return;
        }

        const newDigits = [...otpDigits];
        newDigits[index] = digit;
        setOtpDigits(newDigits);

        // 2. Auto-advance cursor
        if (digit !== '' && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }

        // 3. Auto-verify on last digit entry (index 5)
        if (index === 5 && digit !== '') {
            const enteredOtp = newDigits.join('');
            runVerification(enteredOtp);
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && otpDigits[index] === '' && index > 0) {
            // On backspace in an empty field, move focus to the previous input
            inputRefs.current[index - 1].focus();
        }
    };

    // Simulated function for sending OTP (Step 1)
    const handleSendOtp = (e) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            if (formData.mobile.length >= 10) {
                // Clear any old OTP digits and move to step 2
                setOtpDigits(['', '', '', '', '', '']);
                setStep(2);
            } else {
                console.error("Please enter a valid 10-digit mobile number.");
                alert("Please enter a valid 10-digit mobile number.");
            }
        }, 1500);
    };


    return (
        <div className="p-4 md:pt-10">

            <div className="max-w-md w-full mx-auto p-4 md:p-6 bg-white rounded-3xl shadow-2xl fade-in-animation">

                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-extrabold tracking-tight text-[#34a853] flex items-center justify-center">
                        <span className="text-4xl mr-2">🪴</span> Maya Vriksh
                    </h1>
                    <h2 className="text-xl font-bold text-gray-800 mt-4">Create Your Account</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {step === 1 ? "Start your journey to better gardening." : "Secure your account with mobile verification."}
                    </p>
                </header>

                {step === 1 ? <SignupForm formData={formData} isLoading={isLoading} handleChange={handleChange} handleSendOtp={handleSendOtp} /> :
                    <OtpVerification formData={formData} isLoading={isLoading} otpDigits={otpDigits} inputRefs={inputRefs} handleOtpChange={handleOtpChange} handleKeyDown={handleKeyDown} setStep={setStep} />}

                <div className="mt-8 text-center text-sm">
                    <p className="text-gray-600">
                        Already have an account?
                        <span onClick={() => navigate("../login")} className="text-[#34a853] font-semibold hover:underline ml-1 underline">Log in here.</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

const SignupForm = ({ formData, isLoading, handleChange, handleSendOtp }) => (
    <form onSubmit={handleSendOtp} className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
            <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                required
                className="w-full p-3 border border-gray-300 rounded-lg outline-none transition-all duration-200 input-focus"
            />
            <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                required
                className="w-full p-3 border border-gray-300 rounded-lg outline-none transition-all duration-200 input-focus"
            />
        </div>

        <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
            className="w-full p-3 border border-gray-300 rounded-lg outline-none transition-all duration-200 input-focus"
        />

        <Input
            type="tel" // Use tel for better mobile input experience
            inputMode="numeric"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Mobile Number (e.g., 9876543210)"
            required
            maxLength="10"
            className="w-full p-3 border border-gray-300 rounded-lg outline-none transition-all duration-200 input-focus"
        />

        <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 font-semibold text-white bg-[#34a853] rounded-full shadow-md shadow-[#34a853]/40 hover:bg-[#2e934a] transition-all duration-300 transform hover:scale-[1.01] disabled:bg-gray-400 disabled:shadow-none"
        >
            {isLoading ? (
                <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending OTP...
                </span>
            ) : "Sign Up & Send OTP"}
        </button>
    </form>
);

const OtpVerification = ({ formData, isLoading, otpDigits, inputRefs, handleOtpChange, handleKeyDown, setStep }) => (
    // Prevent form default submission since verification is handled by input change
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <p className="text-gray-600 text-sm mb-4">
            A 6-digit OTP has been sent to **{formData.mobile}**. Please enter it below.
        </p>

        {/* OTP Input Boxes (6 separate inputs) */}
        <div className={`flex justify-center space-x-2 ${isLoading ? 'opacity-50' : ''}`}>
            {otpDigits.map((digit, index) => (
                <Input
                    key={index}
                    // Set the ref for this specific input box
                    ref={el => inputRefs.current[index] = el}
                    // Use type="tel" for better mobile keyboard experience, but enforce digits via onChange
                    type="tel"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    maxLength="1"
                    className="w-10 h-12 md:w-12 md:h-14 text-2xl font-mono text-center border-2 border-gray-300 rounded-lg outline-none transition-all duration-200 input-focus focus:ring-2 focus:ring-[#34a853]/50"
                    required
                    // Auto-focus the first box when the step changes
                    autoFocus={index === 0}
                    // Disable input while verification is running
                    disabled={isLoading}
                />
            ))}
        </div>

        {/* Display verification status message (replacing the button) */}
        <div className="pt-2">
            {isLoading ? (
                <div className="w-full py-3 font-semibold text-white bg-[#34a853] rounded-full shadow-md shadow-[#34a853]/40 flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying OTP...
                </div>
            ) : (
                <p className="text-center text-sm text-gray-500 py-3">
                    Enter the 6-digit code above. Verification is automatic.
                </p>
            )}
        </div>

        <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full py-2 text-[#34a853] hover:text-[#2e934a] transition-colors text-sm"
            disabled={isLoading}
        >
            Change Mobile Number
        </button>
    </form>
);

export default Signup;
