import type { UserType } from "./userTypes";

// null = all authenticated users allowed
// UserType[] = only listed types allowed
// Routes not in map = allowed (same as null)
export const ROUTE_ACCESS: Record<string, UserType[] | null> = {
	"/": null,
	"/discover": null,
	"/portfolio": null,
	"/portfolio/cash-transaction": null,
	"/portfolio/settle": null,
	"/portfolio/shares-transfer": null,
	"/account-linkages": null,
	"/donations": null,
	"/market-data": null,
	"/my-applications": null,
	"/update-signature": null,
	"/update-email": null,
	"/update-mobile": null,
	"/securities": null,
	"/alternatives": null,
	"/application-note": null,
	"/unauthorized": null,
};
