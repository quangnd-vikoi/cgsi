"use client";
import Title from "@/components/Title";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/stores/userStore";
import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { useOTPCountdown } from "@/hooks/auth/useOTPCountdown";
import Alert from "@/components/Alert";
import { INTERNAL_ROUTES } from "@/constants/routes";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/components/ui/toaster";
import { ErrorState } from "@/components/ErrorState";
import CustomCircleAlert from "@/components/CircleAlertIcon";
import { sendEmailOtp, submitEmailUpdate } from "@/lib/services/profileService";

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
			<h2 className="text-base font-semibold mb-6">Enter Your New Email Here</h2>

			<Input
				placeholder="Enter here"
				value={newEmail}
				onChange={handleEmailChange}
				onKeyPress={handleKeyPress}
				className="focus-visible:!border-b-cgs-blue focus-visible:!border-b focus:bg-background-selected"
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
	setStep,
	onResend,
	isSubmitting,
}: {
	email: string;
	otp: string;
	error: string;
	setOtp: (value: string) => void;
	setStep: Dispatch<SetStateAction<1 | 2 | 3>>;
	onResend: () => void;
	isSubmitting: boolean;
}) => {
	const { formattedTime, isActive, reset } = useOTPCountdown({
		initialSeconds: 120,
	});

	const handleChange = (value: string) => {
		const numeric = value.replace(/\D/g, "");
		setOtp(numeric);
	};

	const handleResendCode = () => {
		reset();
		onResend();
	};

	return (
		<div className="pad-x">
			<h2 className="text-base font-semibold mb-2">Input OTP Code</h2>
			<p className="text-sm text-typo-secondary mt-6">
				You will receive a 6 digit code at
				<span className="ml-1">{email}</span>
			</p>

			<p
				className="mb-6 text-cgs-blue cursor-pointer text-sm font-normal mt-1"
				onClick={() => setStep(1)}
			>
				Change Email?
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

			<div className="text-center w-full text-sm text-status-disable-primary font-semibold mt-6">
				{isActive ? (
					<>Resend in : {formattedTime}</>
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
			description="You have successfully updated your email address"
		/>
	);
};

const UpdateEmail = () => {
	const router = useRouter();
	const { email: currentEmail } = useUserStore();
	const [step, setStep] = useState<1 | 2 | 3>(1);
	const [newEmail, setNewEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [error, setError] = useState("");
	const [transactionId, setTransactionId] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Validate email format
	const isValidEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	// Handle form submission for step 1
	const handleStep1Continue = async () => {
		// Check if empty
		if (!newEmail.trim()) {
			setError("Email cannot be empty");
			return;
		}

		// Check if same as old email
		if (newEmail.toLowerCase() === currentEmail.toLowerCase()) {
			setError("Please enter a different email");
			return;
		}

		// Check if valid email format
		if (!isValidEmail(newEmail)) {
			setError("Please enter a valid email address");
			return;
		}

		setIsSubmitting(true);
		setError("");

		const response = await sendEmailOtp(newEmail);

		setIsSubmitting(false);

		if (response.success && response.data) {
			setTransactionId(response.data.transactionId);
			setStep(2);
		} else {
			toast.error("Failed to send OTP", response.error || "Please try again later.");
		}
	};

	// Handle resend OTP
	const handleResendOtp = async () => {
		const response = await sendEmailOtp(newEmail);

		if (response.success && response.data) {
			setTransactionId(response.data.transactionId);
			toast.success("OTP Resent", "A new OTP code has been sent to your email.");
		} else {
			toast.error("Failed to resend OTP", response.error || "Please try again later.");
		}
	};

	// Handle continue for step 2
	const handleStep2Continue = async () => {
		if (otp.length !== 6) {
			setError("Please enter the 6-digit OTP code");
			return;
		}

		setIsSubmitting(true);
		setError("");

		const response = await submitEmailUpdate(transactionId, otp);

		setIsSubmitting(false);

		if (response.success && response.data?.isSuccess) {
			setStep(3);
		} else {
			setError(response.error || "Invalid OTP. Please try again.");
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
					rightContent={
						<Alert
							trigger={<X />}
							title="Exit Update Email Address?"
							description={<p>Any information previously entered will be discarded.</p>}
							actionText="Back To Form"
							cancelText="Exit without Saving"
							onCancel={() => router.push(INTERNAL_ROUTES.HOME)}
						/>
					}
				/>
			</div>

			<div className="bg-white rounded-lg flex-1 flex flex-col justify-between pt-6 overflow-hidden min-h-0">
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
						setStep={setStep}
						error={error}
						onResend={handleResendOtp}
						isSubmitting={isSubmitting}
					/>
				)}

				{step === 3 && <ConfirmStep />}
				<div className="">
					{step === 2 && (
						<div className="rounded-full bg-theme-blue-085 text-xs w-fit mx-auto mb-4 px-4 py-2 shadow-[0px_2px_16.299999237060547px_-1px_rgba(33,64,154,0.10)] text-theme-blue-03">
							{`OTP has been sent to ${newEmail}`}
						</div>
					)}
					<div className="pad-x py-4 border-t w-full relative">
						<Button
							className="w-full text-base font-normal"
							onClick={handleContinue}
							disabled={isSubmitting}
						>
							{isSubmitting ? "Processing..." : step === 3 ? "Back to Home" : "Continue"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UpdateEmail;
