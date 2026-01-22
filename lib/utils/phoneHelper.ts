import { Country as CountryCode, getCountries, getCountryCallingCode } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";

export interface ParsedPhoneNumber {
	countryCode: CountryCode;
	dialCode: string;
	phoneNumber: string;
}

/**
 * Parse phone number in format "+{dialCode}-{phoneNumber}"
 * Examples:
 *   "+65-12345678" → { countryCode: "SG", dialCode: "+65", phoneNumber: "12345678" }
 *   "+1-5551234567" → { countryCode: "US", dialCode: "+1", phoneNumber: "5551234567" }
 *   "+44-7911123456" → { countryCode: "GB", dialCode: "+44", phoneNumber: "7911123456" }
 *
 * @param phoneNumber - Phone number in format "+{dialCode}-{phoneNumber}"
 * @returns Parsed phone number object or default SG values if parsing fails
 */
export function parsePhoneNumber(phoneNumber: string | undefined | null): ParsedPhoneNumber {
	// Default fallback to Singapore
	const defaultResult: ParsedPhoneNumber = {
		countryCode: "SG",
		dialCode: "+65",
		phoneNumber: "",
	};

	if (!phoneNumber) {
		return defaultResult;
	}

	// Try to parse format: "+{dialCode}-{phoneNumber}"
	const match = phoneNumber.match(/^\+(\d{1,4})-(.+)$/);

	if (!match) {
		// If no match, try without dash: "+{dialCode}{phoneNumber}"
		const matchNoDash = phoneNumber.match(/^\+(\d{1,4})(.+)$/);
		if (!matchNoDash) {
			return defaultResult;
		}
		const [, extractedDialCode, phone] = matchNoDash;
		const country = findCountryByDialCode(extractedDialCode);
		return {
			countryCode: country || "SG",
			dialCode: `+${extractedDialCode}`,
			phoneNumber: phone,
		};
	}

	const [, extractedDialCode, phone] = match;

	// Find country code from dial code
	const country = findCountryByDialCode(extractedDialCode);

	return {
		countryCode: country || "SG",
		dialCode: `+${extractedDialCode}`,
		phoneNumber: phone,
	};
}

/**
 * Find country code by dial code
 * Examples:
 *   "65" → "SG"
 *   "1" → "US"
 *   "44" → "GB"
 *
 * @param dialCode - Dial code without "+" prefix
 * @returns Country code or undefined if not found
 */
function findCountryByDialCode(dialCode: string): CountryCode | undefined {
	const countries = getCountries();

	for (const country of countries) {
		try {
			const countryDialCode = getCountryCallingCode(country);
			if (countryDialCode === dialCode) {
				return country;
			}
		} catch {
			// Skip invalid countries
			continue;
		}
	}

	return undefined;
}

/**
 * Format phone number for API submission
 * Combines country dial code and phone number
 *
 * @param countryCode - Country code (e.g., "SG", "US")
 * @param phoneNumber - Phone number without dial code
 * @returns Formatted phone number "+{dialCode}-{phoneNumber}"
 */
export function formatPhoneForApi(countryCode: CountryCode, phoneNumber: string): string {
	const dialCode = getCountryCallingCode(countryCode);
	return `+${dialCode}-${phoneNumber}`;
}

/**
 * Get country name from country code
 *
 * @param countryCode - Country code (e.g., "SG", "US")
 * @returns Country name
 */
export function getCountryName(countryCode: CountryCode): string {
	return en[countryCode] || countryCode;
}

export interface Country {
	code: CountryCode;
	name: string;
	dialCode: string;
}

/**
 * Create Country object from country code
 *
 * @param countryCode - Country code (e.g., "SG", "US")
 * @returns Country object with code, name, and dialCode
 */
export function createCountry(countryCode: CountryCode): Country {
	return {
		code: countryCode,
		name: getCountryName(countryCode),
		dialCode: `+${getCountryCallingCode(countryCode)}`,
	};
}
