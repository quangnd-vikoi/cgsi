import type { IMarketSubscriptionExtendedData } from "@/types";

const TEXT_FIELD_MAP: Record<string, keyof IMarketSubscriptionExtendedData> = {
    SUBSCRIBER_NAME: "name",
    SUBSCRIBER_ADDRESS: "address",
    SUBSCRIBER_OCCUPATION: "occupation",
    EMPLOYER_NAME: "employer",
    EMPLOYER_ADDRESS: "employerAddress",
    EMPLOYMENT_TITLE: "employmentTitle",
    EMPLOYMENT_FUNCTION: "employmentFunction",
};

/**
 * Inject extendedData values into agreement HTML form fields:
 * - Text inputs (SUBSCRIBER_NAME, SUBSCRIBER_ADDRESS, etc.)
 * - Radio buttons (ANSWER_VALUE_01 through ANSWER_VALUE_11)
 * - Checkboxes (SECTION_CHECK_01, SECTION_CHECK_02)
 */
export function injectAgreementFormValues(html: string, data: IMarketSubscriptionExtendedData): string {
    let result = html;

    // Inject text input values
    for (const [inputName, dataKey] of Object.entries(TEXT_FIELD_MAP)) {
        const value = (data[dataKey] as string) ?? "";
        const regex = new RegExp(
            `(<INPUT\\b[^>]*\\bname=["']?${inputName}["']?[^>]*?)(/?>)`,
            "gi"
        );
        result = result.replace(regex, (_match, before, close) => {
            const cleaned = before.replace(/\s+value=["'][^"']*["']/gi, "");
            return `${cleaned} value="${value.replace(/"/g, "&quot;")}"${close}`;
        });
    }

    // Inject radio button selections (ANSWER_VALUE_01 through ANSWER_VALUE_11)
    for (let i = 1; i <= 11; i++) {
        const num = String(i).padStart(2, "0");
        const key = `value_${num}` as keyof IMarketSubscriptionExtendedData;
        const selected = data[key] as boolean | undefined;

        const radioRegex = new RegExp(
            `(<INPUT\\b[^>]*\\bname=["']?ANSWER_VALUE_${num}["']?[^>]*?)(/?>)`,
            "gi"
        );
        result = result.replace(radioRegex, (_match, before, close) => {
            let cleaned = before.replace(/\s+CHECKED\b/gi, "");
            const valueMatch = before.match(/\bvalue=["']?(true|false)["']?/i);
            if (valueMatch) {
                const radioValue = valueMatch[1].toLowerCase() === "true";
                if (radioValue === selected) {
                    cleaned += " CHECKED";
                }
            }
            return `${cleaned}${close}`;
        });
    }

    // Check the section checkboxes (SECTION_CHECK_01, SECTION_CHECK_02)
    const checkboxRegex = /(<INPUT\b[^>]*\bname=["']?SECTION_CHECK_\d+["']?[^>]*?)(\/?>)/gi;
    result = result.replace(checkboxRegex, (_match, before, close) => {
        const cleaned = before.replace(/\s+checked\b/gi, "");
        return `${cleaned} checked${close}`;
    });

    return result;
}
