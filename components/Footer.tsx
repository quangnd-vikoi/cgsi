import { Instagram, Linkedin, Facebook, Youtube } from "lucide-react";
import Image from "next/image";

export default function Footer() {
	return (
		<footer className="w-full">
			{/* Main footer content */}
			<div className="bg-slate-700 px-8 py-12">
				<div className="flex items-start justify-between">
					{/* Left side - Logo and company info */}
					<div className="flex flex-col gap-4">
						{/* CGS Logo */}
						<Image src="/images/CGS.png" alt="CGS Logo" width={147} height={100} />
						{/* Company info */}
						<p className="text-xs text-gray-300 leading-relaxed">
							CGS International Securities Singapore Pte. Ltd | Company Reg No.: 197901004504
							(UEN703-W)
						</p>
					</div>

					{/* Right side - Social media */}
					<div className="flex flex-col items-end gap-4">
						<p className="text-sm text-gray-300 font-medium">Follow us on</p>
						<div className="flex gap-4">
							<a href="#" className="text-gray-300 hover:text-white transition-colors">
								<Instagram size={20} />
							</a>
							<a href="#" className="text-gray-300 hover:text-white transition-colors">
								<Linkedin size={20} />
							</a>
							<a href="#" className="text-gray-300 hover:text-white transition-colors">
								<Facebook size={20} />
							</a>
							<a href="#" className="text-gray-300 hover:text-white transition-colors">
								<Youtube size={20} />
							</a>
						</div>

						<div className="py-3 border-slate-500">
							<div className="flex justify-center gap-4 text-xs text-gray-300">
								<a href="#" className="hover:text-white transition-colors">
									CGS
								</a>
								<span className="text-gray-500">|</span>
								<a href="#" className="hover:text-white transition-colors">
									CDI
								</a>
								<span className="text-gray-500">|</span>
								<a href="#" className="hover:text-white transition-colors">
									Contact Us
								</a>
								<span className="text-gray-500">|</span>
								<a href="#" className="hover:text-white transition-colors">
									Terms of Use
								</a>
								<span className="text-gray-500">|</span>
								<a href="#" className="hover:text-white transition-colors">
									General Terms and Conditions
								</a>
								<span className="text-gray-500">|</span>
								<a href="#" className="hover:text-white transition-colors">
									Privacy Notice
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom navigation links */}
		</footer>
	);
}
