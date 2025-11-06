"use client";

import { CircleCheckIcon, InfoIcon, Loader2Icon, TriangleAlertIcon, XIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { toast as sonnerToast, Toaster as Sonner, type ExternalToast, type ToasterProps } from "sonner";
import { Inter } from "next/font/google";
import CustomCircleAlert from "../CircleAlertIcon";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

// Custom Toast Component với progress bar
interface CustomToastProps {
	title: string;
	description?: string;
	type?: "success" | "error" | "warning" | "info" | "loading";
	duration?: number;
	onCancel?: () => void;
	progressColor?: string;
	backgroundColor?: string;
}

const CustomToast = ({ title, description, type = "info", duration = 10, onCancel }: CustomToastProps) => {
	const [progress, setProgress] = useState(100);

	useEffect(() => {
		const startTime = Date.now();
		const interval = setInterval(() => {
			const elapsed = Date.now() - startTime;
			const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
			setProgress(remaining);

			if (remaining === 0) {
				clearInterval(interval);
			}
		}, 16); // ~60fps

		return () => clearInterval(interval);
	}, [duration]);

	const typeConfig = {
		success: {
			icon: <CircleCheckIcon className="size-5 text-white" fill="#11B47B" size={20} />,
			progressColor: "bg-status-success",
		},
		error: {
			icon: <CustomCircleAlert size={20} />,
			progressColor: "bg-red-500",
		},
		warning: {
			icon: <TriangleAlertIcon className="size-5" />,
			iconColor: "text-yellow-500",
			progressColor: "bg-yellow-500",
		},
		info: {
			icon: <InfoIcon className="size-5" />,
			iconColor: "text-blue-500",
			progressColor: "bg-blue-500",
		},
		loading: {
			icon: <Loader2Icon className="size-5 animate-spin" />,
			iconColor: "text-gray-500",
			progressColor: "bg-gray-500",
		},
	};

	const config = typeConfig[type];

	return (
		<div
			className={`${inter.className} relative w-full sm:w-[344px] bg-white border rounded-lg shadow-lg overflow-hidden`}
		>
			<div className="flex items-start gap-1 p-3">
				{/* Icon */}
				<div className={`flex-shrink-0 mt-0.5`}>{config.icon}</div>

				{/* Content */}
				<div className="flex-1 min-w-0">
					<div className="font-semibold text-base text-typo-primary">{title}</div>
					{description && <div className="text-sm text-typo-secondary mt-1">{description}</div>}
				</div>

				{/* Cancel Button */}
				{onCancel && (
					<button
						onClick={onCancel}
						className="flex-shrink-0 p-1 rounded-md hover:bg-accent transition-colors"
						aria-label="Close"
					>
						<XIcon className="size-4 text-muted-foreground" />
					</button>
				)}
			</div>

			{/* Progress Bar */}
			<div className="h-[3px] bg-white dark:bg-white/10">
				<div
					className={`h-full ${config.progressColor} transition-all duration-75 ease-linear`}
					style={{ width: `${progress}%` }}
				/>
			</div>
		</div>
	);
};

// Toaster Component
const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className={`toaster group`}
			style={
				{
					"--normal-bg": "var(--popover)",
					"--normal-text": "var(--popover-foreground)",
					"--normal-border": "var(--border)",
					"--border-radius": "var(--radius)",
				} as React.CSSProperties
			}
			{...props}
		/>
	);
};

// Custom toast wrapper
interface ToastOptions extends ExternalToast {
	progressColor?: string;
	backgroundColor?: string;
}

const toast = {
	success: (title: string, description?: string, options?: ToastOptions) => {
		const duration = options?.duration || 4000;
		return sonnerToast.custom(
			(t) => (
				<CustomToast
					title={title}
					description={description}
					type="success"
					duration={duration}
					progressColor={options?.progressColor}
					backgroundColor={options?.backgroundColor}
					onCancel={() => sonnerToast.dismiss(t)}
				/>
			),
			{ duration, ...options }
		);
	},

	error: (title: string, description?: string, options?: ToastOptions) => {
		const duration = options?.duration || 4000;
		return sonnerToast.custom(
			(t) => (
				<CustomToast
					title={title}
					description={description}
					type="error"
					duration={duration}
					progressColor={options?.progressColor}
					backgroundColor={options?.backgroundColor}
					onCancel={() => sonnerToast.dismiss(t)}
				/>
			),
			{ duration, ...options }
		);
	},

	warning: (title: string, description?: string, options?: ToastOptions) => {
		const duration = options?.duration || 4000;
		return sonnerToast.custom(
			(t) => (
				<CustomToast
					title={title}
					description={description}
					type="warning"
					duration={duration}
					progressColor={options?.progressColor}
					backgroundColor={options?.backgroundColor}
					onCancel={() => sonnerToast.dismiss(t)}
				/>
			),
			{ duration, ...options }
		);
	},

	info: (title: string, description?: string, options?: ToastOptions) => {
		const duration = options?.duration || 4000;
		return sonnerToast.custom(
			(t) => (
				<CustomToast
					title={title}
					description={description}
					type="info"
					duration={duration}
					progressColor={options?.progressColor}
					backgroundColor={options?.backgroundColor}
					onCancel={() => sonnerToast.dismiss(t)}
				/>
			),
			{ duration, ...options }
		);
	},

	loading: (title: string, description?: string, options?: ToastOptions) => {
		const duration = options?.duration || 4000;
		return sonnerToast.custom(
			(t) => (
				<CustomToast
					title={title}
					description={description}
					type="loading"
					duration={duration}
					progressColor={options?.progressColor}
					backgroundColor={options?.backgroundColor}
					onCancel={() => sonnerToast.dismiss(t)}
				/>
			),
			{ duration, ...options }
		);
	},

	dismiss: sonnerToast.dismiss,
};

export { Toaster, toast };
