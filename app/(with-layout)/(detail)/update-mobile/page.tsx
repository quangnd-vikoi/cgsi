"use client";
import Title from "@/components/Title";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/userStore";
import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { useOTPCountdown } from "@/hooks/auth/useOTPCountdown";
import Alert from "@/components/Alert";
import { getCountryCallingCode, Country as CountryCode } from "react-phone-number-input";
import { INTERNAL_ROUTES } from "@/constants/routes";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/components/ui/toaster";
import { ErrorState } from "@/components/ErrorState";
import { MobileInputStep } from "./MobileInputStep";
import CustomCircleAlert from "@/components/CircleAlertIcon";
import en from "react-phone-number-input/locale/en.json";

interface Country {
	code: CountryCode;
	name: string;
	dialCode: string;
}

const OTPStep = ({
	phoneNumber,
	otp,
	error,
	setOtp,
	setStep,
	dialCode,
}: {
	phoneNumber: string;
	otp: string;
	error: string;
	setOtp: (value: string) => void;
	setStep: Dispatch<SetStateAction<1 | 2 | 3>>;
	dialCode: string;
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
		// TODO: Implement actual resend OTP API call
		toast.success("OTP Resent", "A new OTP code has been sent to your mobile number.");
	};

	return (
		<div className="pad-x">
			<h2 className="text-base font-semibold mb-2">Input OTP Code</h2>
			<p className="text-sm text-typo-secondary mt-6">
				You will receive a 6 digit code at
				<span className="ml-1">{dialCode + phoneNumber}</span>
			</p>

			<p
				className="mb-6 text-enhanced-blue cursor-pointer text-sm font-normal mt-1"
				onClick={() => setStep(1)}
			>
				Change Number?
			</p>

			<InputOTP maxLength={6} value={otp} onChange={handleChange}>
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
					<span className="text-enhanced-blue cursor-pointer" onClick={handleResendCode}>
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
	const { mobile: currentMobile } = useUserStore();
	const [step, setStep] = useState<1 | 2 | 3>(1);
	const [phoneNumber, setPhoneNumber] = useState("");
	const [otp, setOtp] = useState("");
	const [error, setError] = useState("");
	const [selectedCountry, setSelectedCountry] = useState<Country>({
		code: "SG",
		name: en["SG"],
		dialCode: `+${getCountryCallingCode("SG")}`,
	});

	// Validate phone number
	const isValidPhone = (phone: string) => {
		// Basic validation: at least 8 digits
		return phone.length >= 8;
	};

	// Handle continue for step 1
	const handleStep1Continue = () => {
		// Check if empty
		if (!phoneNumber.trim()) {
			setError("Phone number cannot be empty");
			return;
		}

		// Check if same as old phone
		if (phoneNumber === currentMobile) {
			setError("Please enter a different phone number");
			return;
		}

		// Check if valid phone format
		if (!isValidPhone(phoneNumber)) {
			setError("Please enter a valid phone number");
			return;
		}

		// Move to OTP step
		setStep(2);
	};

	// Handle continue for step 2
	const handleStep2Continue = () => {
		if (otp.length === 6) {
			// TODO: Verify OTP with backend
			// Simulate API call failure
			toast.error("Failed to send Mobile OTP", "Please check your internet connection and try again.");

			// Move to error step
			setStep(3);
		}
		setError("Field cannot be empty");
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
						<Button className="w-full text-base font-normal" onClick={handleContinue}>
							{step === 3 ? "Back to Home" : "Continue"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UpdateMobile;
