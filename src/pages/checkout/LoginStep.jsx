import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Heart, Award, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useFirebasePhoneAuth } from "@/hooks/useFirebasePhoneAuth";
import { auth } from "@/config/firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { registerCustomer, sendOtp, verifyOtp } from "@/api/auth/auth";
import { useDispatch, useSelector } from "react-redux";
import { addCartItems } from "@/api/customer/cart";
import toast from "react-hot-toast";
import { clearGuestCart } from "@/redux/slices/cartSlice";

export default function LoginStep({
  onComplete,
  isLoggedIn = false,
  userEmail = "",
  selectedGuestItems = [],
  setSelectedCartItemIds,
  setIsCartSynced
}) {
  const [viewMode, setViewMode] = useState("initial"); // 'initial', 'otp', 'signup'
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [signupData, setSignupData] = useState({ firstName: "", lastName: "", email: "" });

  const { login, user: userDetails, refreshUser } = useAuth();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // --- 1. Effect: Auto-advance if already logged in ---
  useEffect(() => {
    if (userDetails?.username === "") {
      setViewMode("signup");
      return;
    } else if (userDetails) {
      onComplete();
    }
  }, [userDetails]);

  // --- 2. Mutation: Merge Guest Cart to DB ---
  // const addItemToCartMutation = useMutation({
  //   mutationFn: async (guestItemsToMerge) => {
  //     const items = guestItemsToMerge.map(item => ({
  //       plantVariantId: item.id,
  //       potVariantId: item.potVariantId,
  //       quantity: item.quantity,
  //     }));
  //     const payload = { items: [...items] };
  //     const addToCartResp = await addCartItems(payload);
  //     const cartItemIds = addToCartResp.data.map(item => item.cartItemId);
  //     setSelectedCartItemIds(cartItemIds)
  //     return { success: true };
  //   },
  //   onSuccess: async (data, variables) => {
  //     setIsCartSynced(true)
  //     queryClient.invalidateQueries({
  //       queryKey: ["cart-data", user?.id]
  //     });
  //   },
  //   onError: (error) => {
  //     console.error("Merge Failed:", error);
  //     toast.error("Failed to merge items. Please try again.");
  //   }
  // });

  // --- 3. Mutation: Send OTP ---
  const sendOtpMutation = useMutation({
    mutationFn: async (phone) => {
      if (!phone || phone.length !== 10) {
        throw new Error("Please enter a valid 10-digit mobile number");
      }
      const sendFlag = await sendOtp(phone);
      if (!sendFlag) throw new Error("Please try after some time");
      return { success: sendFlag };
    },
    onSuccess: () => {
      setViewMode("otp");
    },
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to send OTP. Please try again.";

      toast.error(errorMessage);
    },
  });

  // --- 4. Mutation: Verify OTP & Login ---
  const verifyOtpMutation = useMutation({
    mutationFn: async ({ emailOrPhone, otp }) => {
      if (!otp || otp.length !== 6) {
        throw new Error("Invalid OTP. Please enter a 6-digit code.");
      }
      const verifiedUser = await verifyOtp(emailOrPhone, otp);
      if (!verifiedUser || !verifiedUser?.data?.accessToken) {
        throw new Error("OTP Verification failed.");
      }

      const loginResponse = await login(verifiedUser);
      return loginResponse;
    },
    onSuccess: async (resp) => {
      const isNewUser = resp?.data?.isNewCustomer;

      if (resp.mergedCartItemIds && resp.mergedCartItemIds.length > 0) {
        setSelectedCartItemIds(resp.mergedCartItemIds);
        sessionStorage.setItem("guestCartIds", JSON.stringify(resp.mergedCartItemIds))
      }
      setIsCartSynced(true);

      if (isNewUser) {
        setViewMode("signup");
      } else {
        onComplete?.({ email: emailOrPhone });
      }
    },
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errorDetails?.message ||
        err.message ||
        "Login failed. Please try again.";

      toast.error(errorMessage);
    },
  });

  // --- 5. Mutation: Create Account ---
  const createAccountMutation = useMutation({
    mutationFn: async (data) => {
      if (!data.firstName || !data.lastName) throw new Error("First/Last name is required");
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!data.email || !emailRegex.test(data.email)) {
        throw new Error("Enter a valid email address");
      }
      await registerCustomer(data);
      refreshUser()
      return { created: true };
    },
    onSuccess: () => {
      onComplete?.({ email: signupData.email, name: `${signupData.firstName} ${signupData.lastName}` });
    },
    onError: (err) => {
      console.error("Signup Error:", err.response.data.message);
      toast.error(err.response.data.message);
    },
  });

  // --- Event Handlers ---
  const handleSendOTP = () => sendOtpMutation.mutate(emailOrPhone);
  const handleVerifyOTP = () => verifyOtpMutation.mutate({ emailOrPhone, otp });
  const handleCreateAccount = () => createAccountMutation.mutate(signupData);
  const handleBack = () => {
    setViewMode("initial");
    setOtp("");
  };

  // Triggers immediately once the 6th digit is entered
  useEffect(() => {
    if (viewMode === 'otp' && otp.length === 6 && !verifyOtpMutation.isPending) {
      handleVerifyOTP();
    }
  }, [otp, viewMode]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 pt-2">
      {/* Left Side: Form Area */}
      <div className="lg:col-span-3 space-y-6">

        {/* === VIEW 1: Enter Mobile === */}
        {viewMode === "initial" && (
          <div className="space-y-5 animate-in fade-in slide-in-from-left-2 duration-300">
            <div>
              <label htmlFor="mobile" className="text-sm font-semibold text-gray-700 mb-2 block">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  +91
                </span>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter 10-digit number"
                  value={emailOrPhone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setEmailOrPhone(val);
                  }}
                  className="h-12 pl-12 text-base border-gray-300 focus-visible:ring-[#00a83e] focus-visible:border-[#00a83e]"
                  data-testid="input-email-mobile"
                />
              </div>

              {sendOtpMutation.isError ? (
                <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1">
                  {sendOtpMutation?.error?.response?.data?.message}
                </p>
              ) : (
                <p className="text-xs text-gray-500 mt-2">
                  By continuing, you agree to our <span className="text-[#00a83e] hover:underline cursor-pointer">Terms of Use</span> and <span className="text-[#00a83e] hover:underline cursor-pointer">Privacy Policy</span>.
                </p>
              )}
            </div>

            <Button
              className="w-full bg-[#00a83e] hover:bg-[#008f35] text-white font-semibold tracking-wide shadow-md hover:shadow-lg transition-all"
              size="lg"
              onClick={handleSendOTP}
              disabled={emailOrPhone.length !== 10 || sendOtpMutation.isPending}
            >
              {sendOtpMutation.isPending ? "SENDING OTP..." : "CONTINUE"}
            </Button>
          </div>
        )}

        {/* === VIEW 2: Verify OTP === */}
        {viewMode === "otp" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
            <div className="flex items-start">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="p-2 h-auto -ml-2 mr-1 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h3 className="font-bold text-xl text-gray-800">Verify OTP</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Enter the 6-digit code sent to <span className="font-semibold text-gray-900">+91 {emailOrPhone}</span>
                </p>
              </div>
            </div>

            <div className="flex justify-center py-4">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup className="gap-2">
                  {[...Array(6)].map((_, i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="w-10 h-12 sm:w-12 sm:h-14 border-gray-300 text-lg font-semibold focus:border-[#00a83e] focus:ring-[#00a83e] rounded-md"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            {verifyOtpMutation.isError && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md text-center">
                {verifyOtpMutation.error.response.data.message}
              </div>
            )}

            <Button
              className="w-full bg-[#00a83e] hover:bg-[#008f35] text-white font-semibold tracking-wide shadow-md"
              size="lg"
              onClick={handleVerifyOTP}
              // Disabled if empty or verifying, but Auto-Call handles the click logic too
              disabled={otp.length !== 6 || verifyOtpMutation.isPending}
            >
              {verifyOtpMutation.isPending ? "VERIFYING..." : "VERIFY & CONTINUE"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Didn't receive code?{" "}
                <button
                  onClick={handleSendOTP}
                  className="text-[#00a83e] font-semibold hover:underline"
                  disabled={sendOtpMutation.isPending}
                >
                  Resend
                </button>
              </p>
            </div>
          </div>
        )}

        {/* === VIEW 3: Create Account (Signup) === */}
        {viewMode === "signup" && (
          <div className="space-y-5 animate-in zoom-in-95 duration-300">
            <div>
              <h3 className="font-bold text-xl text-gray-800">Almost There!</h3>
              <p className="text-sm text-gray-500 mt-1">
                Complete your profile to finish signing up.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600 uppercase">First Name</label>
                <Input
                  placeholder="John"
                  value={signupData.firstName}
                  onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                  className="h-11 border-gray-300 focus-visible:ring-[#00a83e]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600 uppercase">Last Name</label>
                <Input
                  placeholder="Doe"
                  value={signupData.lastName}
                  onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                  className="h-11 border-gray-300 focus-visible:ring-[#00a83e]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase">Email Address</label>
              <Input
                placeholder="john.doe@example.com"
                type="email"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                className="h-11 border-gray-300 focus-visible:ring-[#00a83e]"
              />
            </div>

            {createAccountMutation.isError && (
              <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{createAccountMutation.error.response.data.message}</p>
            )}

            <Button
              className="w-full bg-[#00a83e] hover:bg-[#008f35] text-white mt-2"
              size="lg"
              onClick={handleCreateAccount}
              disabled={
                !signupData.firstName ||
                !signupData.lastName ||
                !signupData.email ||
                createAccountMutation.isPending
              }
            >
              {createAccountMutation.isPending ? "CREATING PROFILE..." : "COMPLETE SIGNUP"}
            </Button>
          </div>
        )}
      </div>

      {/* Right Side: Benefits Panel */}
      <div className={`lg:col-span-2 ${viewMode !== "initial" ? "hidden lg:block" : ""}`}>
        <Card className="bg-gradient-to-br from-[#00a83e]/5 to-[#00a83e]/10 border-none shadow-inner h-full">
          <CardHeader>
            <CardTitle className="text-base text-[#00a83e] font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Maya Vriksh Benefits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex gap-3 group">
              <div className="w-8 h-8 rounded-full bg-white text-[#00a83e] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Track Orders Easily</p>
                <p className="text-xs text-gray-500 leading-relaxed">Real-time updates on your plants journey home.</p>
              </div>
            </div>
            <div className="flex gap-3 group">
              <div className="w-8 h-8 rounded-full bg-white text-[#00a83e] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Wishlist & Care</p>
                <p className="text-xs text-gray-500 leading-relaxed">Save favorites and get plant care tips.</p>
              </div>
            </div>
            <div className="flex gap-3 group">
              <div className="w-8 h-8 rounded-full bg-white text-[#00a83e] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Green Rewards</p>
                <p className="text-xs text-gray-500 leading-relaxed">Earn points on every sustainable choice.</p>
              </div>
            </div>
            <div className="flex gap-3 group">
              <div className="w-8 h-8 rounded-full bg-white text-[#00a83e] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Secure Payments</p>
                <p className="text-xs text-gray-500 leading-relaxed">100% secure transaction processing.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}