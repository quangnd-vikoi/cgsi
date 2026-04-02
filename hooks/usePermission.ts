import { useUserStore } from "@/stores/userStore";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import { BYPASS_ROLE_CHECK, ROUTE_ACCESS, type USER_TYPE } from "@/constants/accessControl";

interface PermissionResult {
	isLoading: boolean;
	isAllowed: boolean;
	userType: USER_TYPE | null;
}

/**
 * Check if the current user is allowed based on a list of allowed user types.
 * Returns isLoading=true until both profile and accounts are initialized.
 * Fails closed: isAllowed=false while loading.
 */
export function usePermission(allowedTypes: readonly USER_TYPE[] | null): PermissionResult {
	const profile = useUserStore((state) => state.profile);
	const getUserType = useUserStore((state) => state.getUserType);
	const isInitialized = useTradingAccountStore((state) => state.isInitialized);

	if (BYPASS_ROLE_CHECK) {
		return { isLoading: false, isAllowed: true, userType: null };
	}

	const isLoading = !profile || !isInitialized;

	if (isLoading) {
		return { isLoading: true, isAllowed: false, userType: null };
	}

	const userType = getUserType();

	// null = all authenticated users allowed
	if (allowedTypes === null) {
		return { isLoading: false, isAllowed: true, userType };
	}

	const isAllowed = userType !== null && allowedTypes.includes(userType);
	return { isLoading: false, isAllowed, userType };
}

/**
 * Check route-level permission based on pathname.
 * Routes not in ROUTE_ACCESS default to null (all authenticated allowed).
 */
export function useRoutePermission(pathname: string): PermissionResult {
	// Normalize: strip trailing slash for lookup (trailingSlash: true in next.config)
	const normalized = pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
	const allowedTypes = normalized in ROUTE_ACCESS ? ROUTE_ACCESS[normalized] : null;
	return usePermission(allowedTypes);
}

/**
 * Batch permission check for multiple features (Phase 2).
 * Returns a record of feature key → boolean.
 */
export function usePermissions<K extends string>(
	features: Record<K, readonly USER_TYPE[] | null>
): { isLoading: boolean; permissions: Record<K, boolean> } {
	const profile = useUserStore((state) => state.profile);
	const getUserType = useUserStore((state) => state.getUserType);
	const isInitialized = useTradingAccountStore((state) => state.isInitialized);

	if (BYPASS_ROLE_CHECK) {
		const all = {} as Record<K, boolean>;
		for (const key in features) all[key] = true;
		return { isLoading: false, permissions: all };
	}

	const isLoading = !profile || !isInitialized;
	const userType = isLoading ? null : getUserType();

	const permissions = {} as Record<K, boolean>;
	for (const key in features) {
		const allowedTypes = features[key];
		if (isLoading) {
			permissions[key] = false;
		} else if (allowedTypes === null) {
			permissions[key] = true;
		} else {
			permissions[key] = userType !== null && allowedTypes.includes(userType);
		}
	}

	return { isLoading, permissions };
}
