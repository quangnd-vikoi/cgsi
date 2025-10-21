import { Instagram, Linkedin, Facebook, Youtube } from "lucide-react";
import Image from "next/image";

export default function Footer() {
	return (
		<footer className="w-full">
			{/* Main footer content */}
			<div className="bg-slate-700 px-8 py-12 text-white">
				<div className="">
					<div className="flex justify-between">
						{/* CGS Logo */}
						<Image
							className="w-[110px] md:w-[147px]"
							src="/images/CGS.png"
							alt="CGS Logo"
							width={147}
							height={100}
						/>
						<div className="flex flex-col items-end gap-2">
							<p className="text-md font-medium">Follow us on</p>
							<div className="flex gap-4">
								<a href="#" className=" ">
									<Instagram size={20} />
								</a>
								<a href="#" className=" ">
									<Linkedin size={20} />
								</a>
								<a href="#" className=" ">
									<Facebook size={20} />
								</a>
								<a href="#" className=" ">
									<Youtube size={20} />
								</a>
							</div>
						</div>
					</div>

					{/* Bottom side */}
					<div className="flex justify-between mt-6">
						<p className="text-xs leading-relaxed">
							CGS International Securities Singapore Pte. Ltd | Company Reg No.: 197901004504
							(UEN703-W)
						</p>
						<div className="hidden md:flex justify-center gap-4 text-xs ">
							<a href="#" className="">
								CGS
							</a>
							<span className="">|</span>
							<a href="#" className="">
								CDI
							</a>
							<span className="">|</span>
							<a href="#" className="">
								Contact Us
							</a>
							<span className="">|</span>
							<a href="#" className="">
								Terms of Use
							</a>
							<span className="">|</span>
							<a href="#" className="">
								General Terms and Conditions
							</a>
							<span className="">|</span>
							<a href="#" className="">
								Privacy Notice
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
