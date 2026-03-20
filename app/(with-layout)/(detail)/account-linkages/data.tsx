import { ReactNode } from "react";
import { handleCopy, handleEmail } from "@/lib/utils";
import { ArrowRightCircle, ChevronRight, Copy, Globe, Mail } from "lucide-react";

type LinkageItem = { title: ReactNode; description?: ReactNode };
type LinkageData = { mainTitle: ReactNode; items: LinkageItem[] };

// ─── Reusable description blocks ─────────────────────────────────────────────

const WebsiteLink = ({ label, url }: { label: string; url: string }) => (
	<div className="flex justify-between items-center">
		<div className="flex gap-2 items-center">
			<Globe size={20} className="text-icon-light" />
			<p className="text-sm font-normal">{label}</p>
		</div>
		<ChevronRight
			size={20}
			className="text-cgs-blue cursor-pointer"
			onClick={() => window.open(url, "_blank")}
		/>
	</div>
);

const EmailContact = () => (
	<div className="flex justify-between items-center">
		<div className="flex items-center gap-2  min-w-0 flex-1">
			<Mail className="w-5 h-5 text-icon-light shrink-0" />
			<span className="truncate text-typo-primary">sg.clientservices@cgsi.com</span>
		</div>
		<div className="flex gap-2 shrink-0">
			<Copy
				onClick={() => handleCopy("sg.clientservices@cgsi.com")}
				size={20}
				className="text-cgs-blue cursor-pointer"
			/>
			<ArrowRightCircle
				onClick={() => handleEmail("sg.clientservices@cgsi.com")}
				size={20}
				className="text-cgs-blue cursor-pointer"
			/>
		</div>
	</div>
);

const ITRADE_FORMS_URL = "https://www.cgsi.com.sg/info/itrade_application_forms?lang=EN";
const SGX_CDP_URL = "https://www.sgx.com/apply-services";

const iTradeFormsLink = <WebsiteLink label="iTrade Application Forms" url={ITRADE_FORMS_URL} />;
const sgxCdpLink = <WebsiteLink label="SGX CDP Forms Website" url={SGX_CDP_URL} />;
const emailContact = <EmailContact />;

const emailStep = (text?: string) => ({
	title: (
		<p>
			{text || "Email the completed form to our Client Services team. You will receive an email notification once your request has been processed."}
		</p>
	),
	description: emailContact,
});

// ─── Shared subtitle for EPS/GIRO ────────────────────────────────────────────

const paymentMethodNote = (
	<div className="text-sm font-normal mb-6">
		Each trading account can only be linked to one payment method, either EPS or GIRO, at any
		given time.
	</div>
);

// ─── Link variants ────────────────────────────────────────────────────────────

export const subcdp: LinkageData = {
	mainTitle: (
		<div className="text-base font-semibold my-6">
			Follow the instructions below for a Sub-CDP Account Linkage
		</div>
	),
	items: [
		{
			title: (
				<p>
					Visit the website below and download the{" "}
					<span className="font-bold">&quot;Apply/ Revoke Account Linkage&quot;</span>
					form under the CDP Services section
				</p>
			),
			description: sgxCdpLink,
		},
		{
			title: "Complete the form and indicate that you wish to revoke the existing CDP account linkage",
		},
		{
			...emailStep("Email the completed form to our Client Services team. You will receive an email notification once your request has been processed."),
			title: "Email the completed form to our Client Services team. You will receive an email notification once your request has been processed.",
		},
	],
};

export const cpf: LinkageData = {
	mainTitle: (
		<div className="text-base font-semibold my-6">
			Follow the instructions below to manage your CPF Linkage
		</div>
	),
	items: [
		{
			title: (
				<p>
					Before linking, please ensure you have an active CPF Investment Account (CPF-IA) with one
					of the local agent banks
				</p>
			),
		},
		{
			title: (
				<p>
					For both linkage and termination of CPF, please visit the website below and download the
					<span className="font-bold">&quot;Account Update/ Transfer/ Close&quot;</span> form
				</p>
			),
			description: iTradeFormsLink,
		},
		{
			title: "Complete the form and provide your CPF-IA details and intentions under Section 4",
		},
		emailStep(),
	],
};

export const srs: LinkageData = {
	mainTitle: (
		<div className="text-base font-semibold my-6">
			Follow the instructions below to manage your SRS linkage
		</div>
	),
	items: [
		{
			title: (
				<p>
					Before linking, please ensure you have an active SRS account with one of the approved SRS
					agent banks
				</p>
			),
		},
		{
			title: (
				<p>
					For both linkage and termination of SRS, please visit the website below and download the
					<span className="font-bold">&quot;Account Update/ Transfer/ Close&quot;</span> form
				</p>
			),
			description: iTradeFormsLink,
		},
		{
			title: "Complete the form and provide your SRS Account details and intentions under Section 4",
		},
		emailStep(),
	],
};

export const eps: LinkageData = {
	mainTitle: (
		<div>
			<div className="text-base font-semibold mt-6 mb-4">
				Follow the instructions below to manage your EPS linkage
			</div>
			{paymentMethodNote}
		</div>
	),
	items: [
		{
			title: (
				<div>
					<p>
						For Linkage of EPS, please visit the website below to download the
						<span className="font-bold">&quot;EPS Application Form&quot;.</span>
					</p>
					<p className="mt-3">
						For Termination of EPS Linkage, please visit the same website and download the form
						<span className="font-bold">&quot;Account Update/ Transfer/ Close&quot;</span>
						instead.
					</p>
				</div>
			),
			description: iTradeFormsLink,
		},
		{ title: "Complete the relevant form." },
		emailStep(),
	],
};

export const giro: LinkageData = {
	mainTitle: (
		<div>
			<div className="text-base font-semibold mt-6 mb-4">
				Follow the instructions below to manage your GIRO linkage
			</div>
			{paymentMethodNote}
		</div>
	),
	items: [
		{
			title: (
				<div>
					<p>
						For Linkage of GIRO, please visit the website below to download the
						<span className="font-bold">&quot;GIRO Application Form&quot;</span>
					</p>
					<p className="mt-3">
						Please note that GIRO termination can only be processed by your bank. Kindly contact
						them directly for assistance.
					</p>
				</div>
			),
			description: iTradeFormsLink,
		},
		{ title: "Complete the relevant form." },
		emailStep(),
	],
};

// ─── Unlink variants ──────────────────────────────────────────────────────────

export const subcdpUnlink: LinkageData = {
	mainTitle: (
		<div className="text-base font-semibold my-6">
			Follow the instructions below for a Sub-CDP Account Linkage
		</div>
	),
	items: [
		{
			title: (
				<p>
					Visit the website below and download the{" "}
					<span className="font-bold">&quot;Apply/ Revoke Account Linkage&quot;</span>
					form under the CDP Services section
				</p>
			),
			description: sgxCdpLink,
		},
		{
			title: "Complete the form and indicate that you wish to revoke the existing CDP account linkage",
		},
		{
			...emailStep("Email the completed form to our Client Services team. You will receive an email notification once your request has been processed."),
			title: "Email the completed form to our Client Services team. You will receive an email notification once your request has been processed.",
		},
	],
};

export const cpfUnlink: LinkageData = {
	mainTitle: (
		<div className="text-base font-semibold my-6">
			Follow the step by step instructions below to manage the linkage to your CPF Account
		</div>
	),
	items: [
		{
			title: (
				<p>
					Before linkage, please ensure you have an active CPF Investment Account (CPF-IA) with one
					of the local agent banks
				</p>
			),
		},
		{
			title: (
				<p>
					For both linkage and termination of CPF, please visit the website below and download the
					<span className="font-bold">&quot;Account Update/ Transfer/ Close&quot;</span> form
				</p>
			),
			description: iTradeFormsLink,
		},
		{
			title: "Complete the form and provide your CPF-IA details and intentions under Section 4",
		},
		emailStep(),
	],
};

export const srsUnlink: LinkageData = {
	mainTitle: (
		<div className="text-base font-semibold my-6">
			Follow the step by step instructions below to manage the linkage to your SRS Account
		</div>
	),
	items: [
		{
			title: (
				<p>
					Before linkage, please ensure you have an active SRS account with one of the approved SRS
					agent banks
				</p>
			),
		},
		{
			title: (
				<p>
					For both linkage and termination of SRS, please visit the website below and download the
					<span className="font-bold">&quot;Account Update/ Transfer/ Close&quot;</span> form
				</p>
			),
			description: iTradeFormsLink,
		},
		{
			title: "Complete the form and provide your SRS Account details and intentions under Section 4",
		},
		emailStep(),
	],
};

export const epsUnlink: LinkageData = {
	mainTitle: (
		<div>
			<div className="text-base font-semibold mt-6 mb-4">
				Follow the instructions below to manage your EPS linkage
			</div>
			{paymentMethodNote}
		</div>
	),
	items: [
		{
			title: (
				<div>
					<p>
						For Linkage of EPS, please visit the website below to download the
						<span className="font-bold">&quot;EPS Application Form&quot;</span>
					</p>
					<p className="mt-3">
						For Termination of EPS Linkage, please visit the same website and download the form
						<span className="font-bold">&quot;Account Update/ Transfer/ Close&quot;</span>
						instead.
					</p>
				</div>
			),
			description: iTradeFormsLink,
		},
		{ title: "Complete the relevant form." },
		emailStep(),
	],
};

export const giroUnlink: LinkageData = {
	mainTitle: (
		<div>
			<div className="text-base font-semibold mt-6 mb-4">
				Follow the instructions below to manage your GIRO linkage
			</div>
			{paymentMethodNote}
		</div>
	),
	items: [
		{
			title: (
				<div>
					<p>
						For Linkage of GIRO, please visit the website below to download the
						<span className="font-bold">&quot;GIRO Application Form&quot;</span>
					</p>
					<p className="mt-3">
						Please note that GIRO termination can only be processed by your bank. Kindly contact
						them directly for assistance.
					</p>
				</div>
			),
			description: iTradeFormsLink,
		},
		{ title: "Complete the relevant form." },
		emailStep(),
	],
};
