"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import CustomCircleAlert from "@/components/CircleAlertIcon";

interface InputProps extends React.ComponentProps<"input"> {
	error?: boolean | string;
}

function Input({ className, type, error = false, ...props }: InputProps) {
	const hasError = Boolean(error);
	const errorMessage = typeof error === "string" && error.trim() !== "" ? error : "Field cannot be empty";

	return (
		<div className="flex flex-col">
			<input
				type={type}
				data-slot="input"
				className={cn(
					"file:text-foreground placeholder:text-theme-neutral-07 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-1.5 py-2.5 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
					"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
					"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive focus-visible:ring-0 focus-visible:ring-offset-0 text-typo-primary shadow-none border-0 border-b rounded-none",
					hasError && "border-status-error bg-background-error",
					className
				)}
				aria-invalid={hasError}
				{...props}
			/>

			{hasError && (
				<p className="text-status-error text-xs mt-1 flex items-center gap-1">
					<CustomCircleAlert size={15} />
					{errorMessage}
				</p>
			)}
		</div>
	);
}

export { Input };
