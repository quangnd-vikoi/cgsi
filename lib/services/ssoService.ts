import { fetchAPI } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { CorpActionSSOResponse } from "@/types";

/**
 * Submit a SAML POST form to an external SSO endpoint
 *
 * Creates a hidden form with the SAML response and submits it to the specified URL.
 * This will redirect the user to the external system.
 *
 * @param postUrl - The URL to POST the SAML response to
 * @param samlResponse - The base64-encoded SAML response from the backend
 */
export function submitSamlForm(postUrl: string, samlResponse: string): void {
    // Create form element
    const form = document.createElement("form");
    form.method = "POST";
    form.action = postUrl;

    // Create hidden input for SAML response
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "SAMLResponse";
    input.value = samlResponse;

    // Append input to form
    form.appendChild(input);

    // Append form to body and submit
    document.body.appendChild(form);
    form.submit();
}

export const getCorporateActionURL = async (): Promise<void> => {
    await fetchAPI<CorpActionSSOResponse>(
        ENDPOINTS.ssoCorporateAction(),
        { useAuth: true }
    );
}


export const ssoService = {
    getCorporateActionURL
}
