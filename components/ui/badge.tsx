import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center justify-center rounded border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden cursor-default",
	{
		variants: {
			variant: {
				default: "border-tone-blue-02 bg-background-selected text-enhanced-blue [a&]:hover:bg-tone-blue-02/90",
				success:
					"border-tone-green-02 bg-tone-green-00 text-tone-green-04 [a&]:hover:bg-tone-green-00/90",
				inactive:
					"border-stroke-secondary bg-theme-neutral-09 text-status-disable-primary [a&]:hover:bg-theme-neutral-09/90",
				expiring:
					"border-tone-orange-01 bg-tone-orange-00 text-tone-orange-04 [a&]:hover:bg-tone-orange-00/90",
				secondary:
					"border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
				destructive:
					"border-tone-red-01 bg-tone-red-00/10 text-tone-red-05 [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
				outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	}
);

function Badge({
	className,
	variant,
	asChild = false,
	...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
	const Comp = asChild ? Slot : "span";

	return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
