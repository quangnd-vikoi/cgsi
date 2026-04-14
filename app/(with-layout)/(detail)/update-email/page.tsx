"use client";
import Title from "@/components/Title";
import { Loader2, X } from "lucide-react";
import Alert from "@/components/Alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/stores/userStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOTPCountdown } from "@/hooks/auth/useOTPCountdown";
import { INTERNAL_ROUTES } from "@/constants/routes";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/components/ui/toaster";
import { ErrorState } from "@/components/ErrorState";
import CustomCircleAlert from "@/components/CircleAlertIcon";
import { sendEmailOtp, submitEmailUpdate, refreshUserProfile } from "@/lib/services/profileService";

const InputStep = ({
	newEmail,
	setNewEmail,
	error,
	setError,
	onContinue,
	isSubmitting,
}: {
	newEmail: string;
	setNewEmail: (value: string) => void;
	error: string;
	setError: (value: string) => void;
	onContinue: () => void;
	isSubmitting: boolean;
}) => {
	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && !isSubmitting) {
			onContinue();
		}
	};

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setNewEmail(value);
		if (error) setError("");
	};

	return (
		<div className="pad-x">
			<h2 className="text-base md:text-lg font-semibold mb-6">Enter new email address</h2>

			<Input
				placeholder="E.g. user@gmail.com"
				value={newEmail}
				onChange={handleEmailChange}
				onKeyPress={handleKeyPress}
				className="text-sm md:text-base font-normal text-typo-primary focus-visible:!border-b-cgs-blue focus-visible:!border-b focus:bg-background-selected"
				type="email"
				error={error}
				disabled={isSubmitting}
			/>
		</div>
	);
};

const OTPStep = ({
	email,
	otp,
	error,
	setOtp,
	onResend,
	isSubmitting,
	setError,
	countdown,
	resetCountdown,
}: {
	email: string;
	otp: string;
	error: string;
	setOtp: (value: string) => void;
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

	const handleResendCode = () => {
		resetCountdown();
		onResend();
	};

	return (
		<div className="pad-x">
			<h2 className="text-base md:text-lg font-semibold mb-2">Input OTP Code</h2>
			<p className="text-base text-typo-secondary mt-6">
				You will receive a 6 digit code at
				<span className="ml-1">{email}</span>
			</p>

			<InputOTP maxLength={6} value={otp} onChange={handleChange} disabled={isSubmitting} containerClassName="overflow-hidden mt-4">
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
				<p className="text-status-error text-xs md:text-sm font-medium mt-1 flex items-center gap-1">
					<CustomCircleAlert size={15} />
					{error}
				</p>
			)}

			<div className="text-center w-full text-sm md:text-base text-status-disable-primary font-semibold mt-6">
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
			title="Email Address Updated"
			description="You have successfully updated your Email Address tagged to your profile."
		/>
	);
};

const UpdateEmail = () => {
	const router = useRouter();
	const profile = useUserStore((state) => state.profile);
	// Fallback to empty string if no email in profile
	const currentEmail = profile?.email || "";
	const [step, setStep] = useState<1 | 2 | 3>(1);
	const [newEmail, setNewEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [error, setError] = useState("");
	const [transactionId, setTransactionId] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showOtpBanner, setShowOtpBanner] = useState(false);

	useEffect(() => {
		if (!showOtpBanner) return;
		const timer = setTimeout(() => setShowOtpBanner(false), 5000);
		return () => clearTimeout(timer);
	}, [showOtpBanner]);

	// OTP countdown tracker to determine if OTP is expired or just wrong
	const { countdown, reset: resetCountdown } = useOTPCountdown({
		initialSeconds: 60,
	});

	// Validate email format
	const isValidEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	// Handle form submission for step 1
	const handleStep1Continue = async () => {
		// Check if empty
		if (!newEmail.trim()) {
			setError("Kindly provide a new email address to continue");
			return;
		}

		// Check if valid email format
		if (!isValidEmail(newEmail)) {
			setError("Invalid email address");
			return;
		}

		// Check if same as old email
		if (newEmail.toLowerCase() === currentEmail.toLowerCase()) {
			setError("Kindly provide a new email address to continue");
			return;
		}

		setIsSubmitting(true);
		setError("");

		const response = await sendEmailOtp(newEmail);

		setIsSubmitting(false);

		if (response.success && response.data) {
			setTransactionId(response.data.transactionId);
			// Reset countdown when OTP is sent
			resetCountdown();
			setStep(2);
			setShowOtpBanner(true);
		} else {
			toast.error("Unable to Send OTP", response.error || "Please try again later.");
		}
	};

	// Handle resend OTP
	const handleResendOtp = async () => {
		const response = await sendEmailOtp(newEmail);

		if (response.success && response.data) {
			setTransactionId(response.data.transactionId);
			// Reset countdown when OTP is resent (will be called by OTPStep component)
			setShowOtpBanner(true);
			toast.success("OTP Resent", "A new OTP code has been sent to your email.");
		} else {
			toast.error("Unable to Resend OTP", response.error || "Please try again later.");
		}
	};

	// Handle continue for step 2
	const handleStep2Continue = async () => {
		if (otp.length !== 6) {
			setError("Please enter the 6 digit numbers that sent to your email");
			return;
		}

		setIsSubmitting(true);
		setError("");

		const response = await submitEmailUpdate(transactionId, otp);

		setIsSubmitting(false);

		if (response.success && response.data?.success !== false) {
			setStep(3);
			refreshUserProfile().catch(() => { }); // non-critical, fire-and-forget
		} else {
			// Handle OTP validation failure
			// When API returns success=true but data.success=false, it means OTP validation failed
			if (response.success && response.data?.success === false) {
				// Check if OTP is expired (countdown reached 0) or just wrong (countdown > 0)
				if (countdown <= 0) {
					// OTP has expired after 2 minutes
					setError("OTP has expired after 1 minute, please request for a new one");
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
		<div className="max-w-[480px] w-full mx-auto flex-1 flex flex-col h-full">
			<div className="shrink-0">
				<Title
					title="Update Email"
					showBackButton={step === 2}
					onBack={() => setStep(1)}
					rightContent={
						step !== 3 ? (
							<Alert
								trigger={<X />}
								title="Exit Update Email?"
								description={<p>Any information previously entered will be discarded.</p>}
								actionText="Back To Form"
								cancelText="Exit without Saving"
								onCancel={() => router.push(INTERNAL_ROUTES.HOME)}
							/>
						) : null
					}
				/>
			</div>

			<div className="bg-white rounded-xl flex-1 flex flex-col overflow-hidden min-h-0">
				<div className="flex-1 overflow-y-auto pt-6">
					{step === 1 && (
						<InputStep
							newEmail={newEmail}
							setNewEmail={setNewEmail}
							error={error}
							setError={setError}
							onContinue={handleStep1Continue}
							isSubmitting={isSubmitting}
						/>
					)}

					{step === 2 && (
						<OTPStep
							email={newEmail}
							otp={otp}
							setOtp={setOtp}
							error={error}
							setError={setError}
							onResend={handleResendOtp}
							isSubmitting={isSubmitting}
							countdown={countdown}
							resetCountdown={resetCountdown}
						/>
					)}

					{step === 3 && <ConfirmStep />}
				</div>
				<div className="shrink-0">
					{showOtpBanner && (
						<div className="rounded-full bg-theme-blue-085 text-xs w-fit mx-auto mb-4 px-4 py-2 shadow-[0px_2px_16.299999237060547px_-1px_rgba(33,64,154,0.10)] text-theme-blue-03">
							{`OTP has been sent to ${newEmail}`}
						</div>
					)}
					<div className="pad-x py-4 border-t w-full relative">
						<Button
							className="w-full text-base font-medium"
							onClick={handleContinue}
							disabled={isSubmitting || (step === 2 && otp.length < 6)}
						>
							{isSubmitting ? (
								<Loader2 className="animate-spin" />
							) : step === 3 ? (
								"Back to Home"
							) : (
								"Continue"
							)}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UpdateEmail;
