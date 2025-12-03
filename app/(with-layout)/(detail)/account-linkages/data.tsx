import { handleCopy } from "@/lib/utils";
import { ArrowRightCircle, ChevronRight, Copy, Globe, Mail } from "lucide-react";

export const subcdp = {
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
					<span className="font-bold">“Apply/ Revoke Account Linkage”</span>
					form under the CDP Services section
				</p>
			),
			description: (
				<div className="flex justify-between items-center">
					<div className="flex gap-2 items-center">
						<Globe size={20} className="text-icon-light" />
						<p className="text-sm font-normal">SGX CDP Forms Website</p>
					</div>
					<ChevronRight size={20} className="text-enhanced-blue cursor-pointer" />
				</div>
			),
		},
		{
			title: "Complete the form and indicate that you wish to revoke the existing CDP account linkage",
		},
		{
			title: "Email the completed form to our Client Services team. You will receive an email notification once your request has been processed.",
			description: (
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-2  min-w-0 flex-1">
						<Mail className="w-5 h-5 text-icon-light shrink-0" />
						<span className="truncate text-typo-primary">sg.clientservices@cgsi.com</span>
					</div>
					<div className="flex gap-2 shrink-0">
						<Copy
							onClick={() => handleCopy("sg.clientservices@cgsi.com")}
							size={20}
							className="text-enhanced-blue cursor-pointer"
						/>
						<ArrowRightCircle size={20} className="text-enhanced-blue cursor-pointer" />
					</div>
				</div>
			),
		},
	],
};

export const cpf = {
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
					<span className="font-bold"> “Account Update/ Transfer/ Close”</span> form
				</p>
			),
			description: (
				<div className="flex justify-between items-center">
					<div className="flex gap-2 items-center">
						<Globe size={20} className="text-icon-light" />
						<p className="text-sm font-normal">iTrade Application Forms</p>
					</div>
					<ChevronRight size={20} className="text-enhanced-blue cursor-pointer" />
				</div>
			),
		},
		{
			title: "Complete the form and provide your CPF-IA details and intentions under Section 4",
		},
		{
			title: (
				<p>
					Email the completed form to our Client Services team. You will receive an email
					notification once your request has been processed.
				</p>
			),
			description: (
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-2  min-w-0 flex-1">
						<Mail className="w-5 h-5 text-icon-light shrink-0" />
						<span className="truncate text-typo-primary">sg.clientservices@cgsi.com</span>
					</div>
					<div className="flex gap-2 shrink-0">
						<Copy
							onClick={() => handleCopy("sg.clientservices@cgsi.com")}
							size={20}
							className="text-enhanced-blue cursor-pointer"
						/>
						<ArrowRightCircle size={20} className="text-enhanced-blue cursor-pointer" />
					</div>
				</div>
			),
		},
	],
};

export const srs = {
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
					<span className="font-bold"> “Account Update/ Transfer/ Close”</span> form
				</p>
			),
			description: (
				<div className="flex justify-between items-center">
					<div className="flex gap-2 items-center">
						<Globe size={20} className="text-icon-light" />
						<p className="text-sm font-normal">iTrade Application Forms</p>
					</div>
					<ChevronRight size={20} className="text-enhanced-blue cursor-pointer" />
				</div>
			),
		},
		{
			title: "Complete the form and provide your SRS Account details and intentions under Section 4",
		},
		{
			title: (
				<p>
					Email the completed form to our Client Services team. You will receive an email
					notification once your request has been processed.
				</p>
			),
			description: (
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-2  min-w-0 flex-1">
						<Mail className="w-5 h-5 text-icon-light shrink-0" />
						<span className="truncate text-typo-primary">sg.clientservices@cgsi.com</span>
					</div>
					<div className="flex gap-2 shrink-0">
						<Copy
							onClick={() => handleCopy("sg.clientservices@cgsi.com")}
							size={20}
							className="text-enhanced-blue cursor-pointer"
						/>
						<ArrowRightCircle size={20} className="text-enhanced-blue cursor-pointer" />
					</div>
				</div>
			),
		},
	],
};

export const eps = {
	mainTitle: (
		<div>
			<div className="text-base font-semibold mt-6 mb-4">
				Follow the instructions below to manage your EPS linkage
			</div>
			<div className="text-sm font-normal mb-6">
				Each trading account can only be linked to one payment method, either EPS or GIRO, at any
				given time.
			</div>
		</div>
	),
	items: [
		{
			title: (
				<div>
					<p>
						For Linkage of EPS, please visit the website below to download the
						<span className="font-bold">“EPS Application Form”.</span>
					</p>
					<p className="mt-3">
						For Termination of EPS Linkage, please visit the same website and download the form
						<span className="font-bold">“Account Update/ Transfer/ Close”</span>
						instead.
					</p>
				</div>
			),
			description: (
				<div className="flex justify-between items-center">
					<div className="flex gap-2 items-center">
						<Globe size={20} className="text-icon-light" />
						<p className="text-sm font-normal">iTrade Application Forms</p>
					</div>
					<ChevronRight size={20} className="text-enhanced-blue cursor-pointer" />
				</div>
			),
		},
		{
			title: "Complete the relevant form.",
		},
		{
			title: (
				<p>
					Email the completed form to our Client Services team. You will receive an email
					notification once your request has been processed.
				</p>
			),
			description: (
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-2  min-w-0 flex-1">
						<Mail className="w-5 h-5 text-icon-light shrink-0" />
						<span className="truncate text-typo-primary">sg.clientservices@cgsi.com</span>
					</div>
					<div className="flex gap-2 shrink-0">
						<Copy
							onClick={() => handleCopy("sg.clientservices@cgsi.com")}
							size={20}
							className="text-enhanced-blue cursor-pointer"
						/>
						<ArrowRightCircle size={20} className="text-enhanced-blue cursor-pointer" />
					</div>
				</div>
			),
		},
	],
};

export const giro = {
	mainTitle: (
		<div>
			<div className="text-base font-semibold mt-6 mb-4">
				Follow the instructions below to manage your GIRO linkage
			</div>
			<div className="text-sm font-normal mb-6">
				Each trading account can only be linked to one payment method, either EPS or GIRO, at any
				given time.
			</div>
		</div>
	),
	items: [
		{
			title: (
				<div>
					<p>
						For Linkage of GIRO, please visit the website below to download the
						<span className="font-bold">“GIRO Application Form”.</span>
					</p>
					<p className="mt-3">
						Please note that GIRO termination can only be processed by your bank. Kindly contact
						them directly for assistance.
					</p>
				</div>
			),
			description: (
				<div className="flex justify-between items-center">
					<div className="flex gap-2 items-center">
						<Globe size={20} className="text-icon-light" />
						<p className="text-sm font-normal">iTrade Application Forms</p>
					</div>
					<ChevronRight size={20} className="text-enhanced-blue cursor-pointer" />
				</div>
			),
		},
		{
			title: "Complete the relevant form.",
		},
		{
			title: (
				<p>
					Email the completed form to our Client Services team. You will receive an email
					notification once your request has been processed.
				</p>
			),
			description: (
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-2  min-w-0 flex-1">
						<Mail className="w-5 h-5 text-icon-light shrink-0" />
						<span className="truncate text-typo-primary">sg.clientservices@cgsi.com</span>
					</div>
					<div className="flex gap-2 shrink-0">
						<Copy
							onClick={() => handleCopy("sg.clientservices@cgsi.com")}
							size={20}
							className="text-enhanced-blue cursor-pointer"
						/>
						<ArrowRightCircle size={20} className="text-enhanced-blue cursor-pointer" />
					</div>
				</div>
			),
		},
	],
};
