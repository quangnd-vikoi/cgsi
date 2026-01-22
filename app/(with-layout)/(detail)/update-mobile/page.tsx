"use client";
import Title from "@/components/Title";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/userStore";
import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { useOTPCountdown } from "@/hooks/auth/useOTPCountdown";
import Alert from "@/components/Alert";
import { INTERNAL_ROUTES } from "@/constants/routes";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/components/ui/toaster";
import { ErrorState } from "@/components/ErrorState";
import { MobileInputStep } from "./MobileInputStep";
import CustomCircleAlert from "@/components/CircleAlertIcon";
import { sendMobileOtp, submitMobileUpdate, refreshUserProfile } from "@/lib/services/profileService";
import { parsePhoneNumber, createCountry, formatPhoneForApi, type Country } from "@/lib/utils/phoneHelper";

const OTPStep = ({
	phoneNumber,
	otp,
	error,
	setOtp,
	setStep,
	dialCode,
	onResend,
	isSubmitting,
	setError,
	countdown,
	resetCountdown,
}: {
	phoneNumber: string;
	otp: string;
	error: string;
	setOtp: (value: string) => void;
	setStep: Dispatch<SetStateAction<1 | 2 | 3>>;
	dialCode: string;
	onResend: () => void;
	isSubmitting: boolean;
	setError: (value: string) => void;
	countdown: number;
	resetCountdown: () => void;
}) => {
	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	const handleChange = (value: string) => {
		const numeric = value.replace(/\D/g, "");
		setOtp(numeric);
		// Clear error when user types
		if (error) setError("");
	};

	const handleResendCode = async () => {
		resetCountdown();
		onResend();
	};

	return (
		<div className="pad-x">
			<h2 className="text-base font-semibold mb-2">Input OTP Code</h2>
			<p className="text-base text-typo-secondary mt-6">
				You will receive a 6 digit code at
				<span className="ml-1">{dialCode + phoneNumber}</span>
			</p>

			<p
				className="mb-6 text-cgs-blue cursor-pointer text-base font-medium mt-1 underline underline-offset-2"
				onClick={() => setStep(1)}
			>
				Change Number?
			</p>

			<InputOTP maxLength={6} value={otp} onChange={handleChange} disabled={isSubmitting}>
				<InputOTPGroup className="justify-between w-full">
					<InputOTPSlot index={0} error={error} />
					<InputOTPSlot index={1} error={error} />
					<InputOTPSlot index={2} error={error} />
					<InputOTPSlot index={3} error={error} />
					<InputOTPSlot index={4} error={error} />
					<InputOTPSlot index={5} error={error} />
				</InputOTPGroup>
			</InputOTP>

			{error && (
				<p className="text-status-error text-xs mt-1 flex items-center gap-1">
					<CustomCircleAlert size={15} />
					{error}
				</p>
			)}

			<div className="text-center w-full text-sm text-status-disable-primary font-medium mt-6">
				{countdown > 0 ? (
					<>Resend in : {formatTime(countdown)}</>
				) : (
					<span className="text-cgs-blue cursor-pointer" onClick={handleResendCode}>
						Resend Code
					</span>
				)}
			</div>
		</div>
	);
};

const ConfirmStep = () => {
	return (
		<ErrorState
			className="w-[322px] mx-auto my-auto"
			type="success"
			title="Mobile Number Updated"
			description="You have successfully updated your mobile phone number"
		/>
	);
};

const UpdateMobile = () => {
	const router = useRouter();
	const profile = useUserStore((state) => state.profile);

	// Parse current mobile number to pre-fill form
	const parsedCurrentMobile = parsePhoneNumber(profile?.mobileNo);
	const currentMobileFormatted = profile?.mobileNo || ""; // Keep original format for comparison

	const [step, setStep] = useState<1 | 2 | 3>(1);
	const [phoneNumber, setPhoneNumber] = useState("");
	const [otp, setOtp] = useState("");
	const [error, setError] = useState("");
	const [transactionId, setTransactionId] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [selectedCountry, setSelectedCountry] = useState<Country>(
		createCountry(parsedCurrentMobile.countryCode)
	);

	// OTP countdown tracker to determine if OTP is expired or just wrong
	const { countdown, reset: resetCountdown } = useOTPCountdown({
		initialSeconds: 120,
	});

	// Validate phone number
	const isValidPhone = (phone: string) => {
		// Basic validation: at least 8 digits
		return phone.length >= 8;
	};

	// Format mobile number for API (dialCode-phoneNumber)
	const formatMobileForApi = () => {
		return formatPhoneForApi(selectedCountry.code, phoneNumber);
	};

	// Handle continue for step 1
	const handleStep1Continue = async () => {
		// Check if empty
		if (!phoneNumber.trim()) {
			setError("Please fill in your mobile no. and country code");
			return;
		}

		// Check if valid phone format (minimum criteria)
		if (!isValidPhone(phoneNumber)) {
			setError("Mobile Number do not meet the minimum criteria");
			return;
		}

		// Check if same as old phone (compare full formatted number)
		const newFormattedNumber = formatMobileForApi();
		if (newFormattedNumber === currentMobileFormatted) {
			setError("Kindly provide a new mobile number to continue");
			return;
		}

		setIsSubmitting(true);
		setError("");

		const response = await sendMobileOtp(formatMobileForApi());

		setIsSubmitting(false);

		if (response.success && response.data) {
			setTransactionId(response.data.transactionId);
			// Reset countdown when OTP is sent
			resetCountdown();
			setStep(2);
		} else {
			toast.error("Failed to send OTP", response.error || "Please try again later.");
		}
	};

	// Handle resend OTP
	const handleResendOtp = async () => {
		const response = await sendMobileOtp(formatMobileForApi());

		if (response.success && response.data) {
			setTransactionId(response.data.transactionId);
			// Reset countdown when OTP is resent (will be called by OTPStep component)
			toast.success("OTP Resent", "A new OTP code has been sent to your mobile number.");
		} else {
			toast.error("Failed to resend OTP", response.error || "Please try again later.");
		}
	};

	// Handle continue for step 2
	const handleStep2Continue = async () => {
		if (otp.length !== 6) {
			setError("Please enter the 6 digit numbers that sent to your mobile number");
			return;
		}

		setIsSubmitting(true);
		setError("");

		const response = await submitMobileUpdate(transactionId, otp);

		setIsSubmitting(false);

		if (response.success && response.data?.isSuccess) {
			// Refresh user profile to update store with new mobile number
			await refreshUserProfile();
			setStep(3);
		} else {
			// Handle OTP validation failure
			// When API returns success=true but isSuccess=false, it means OTP validation failed
			if (response.success && response.data?.isSuccess === false) {
				// Check if OTP is expired (countdown reached 0) or just wrong (countdown > 0)
				if (countdown <= 0) {
					// OTP has expired after 2 minutes
					setError("OTP has expired after 2 minutes, please request for a new one");
				} else {
					// OTP is still valid but user entered wrong code
					setError("OTP Code Authentication Failed");
				}
			} else {
				// Other errors (network, API error, etc.)
				setError(response.error || "Sorry, your entries do not match. Please try again.");
			}
		}
	};

	// Handle continue button click
	const handleContinue = () => {
		if (step === 1) {
			handleStep1Continue();
		} else if (step === 2) {
			handleStep2Continue();
		} else {
			router.push(INTERNAL_ROUTES.HOME);
		}
	};

	return (
		<div className="w-full max-w-[480px] mx-auto flex-1 flex flex-col h-full">
			<div className="shrink-0">
				<Title
					title="Update Mobile Number"
					rightContent={
						<Alert
							trigger={<X />}
							title="Exit Update Mobile Number?"
							description={<p>Any information previously entered will be discarded.</p>}
							actionText="Back To Form"
							cancelText="Exit without Saving"
							onCancel={() => router.push(INTERNAL_ROUTES.HOME)}
						/>
					}
				/>
			</div>

			<div className="bg-white rounded-xl flex-1 flex flex-col justify-between pt-6 overflow-hidden min-h-0">
				{step === 1 && (
					<MobileInputStep
						phoneNumber={phoneNumber}
						setPhoneNumber={setPhoneNumber}
						error={error}
						setError={setError}
						selectedCountry={selectedCountry}
						setSelectedCountry={setSelectedCountry}
					/>
				)}

				{step === 2 && (
					<OTPStep
						dialCode={selectedCountry.dialCode}
						phoneNumber={phoneNumber}
						otp={otp}
						setOtp={setOtp}
						setStep={setStep}
						error={error}
						setError={setError}
						onResend={handleResendOtp}
						isSubmitting={isSubmitting}
						countdown={countdown}
						resetCountdown={resetCountdown}
					/>
				)}

				{step === 3 && <ConfirmStep />}

				<div className="">
					{step === 2 && (
						<div className="rounded-full bg-theme-blue-085 text-xs w-fit mx-auto mb-4 px-4 py-2 shadow-[0px_2px_16.299999237060547px_-1px_rgba(33,64,154,0.10)] text-theme-blue-03">
							{`SMS OTP has been sent to ${selectedCountry.dialCode + phoneNumber}`}
						</div>
					)}
					<div className="pad-x py-4 border-t w-full relative">
						<Button
							className="w-full text-base font-normal"
							onClick={handleContinue}
							disabled={isSubmitting || (step === 2 && otp.length < 6)}
						>
							{isSubmitting ? "Processing..." : step === 3 ? "Back to Home" : "Continue"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UpdateMobile;
