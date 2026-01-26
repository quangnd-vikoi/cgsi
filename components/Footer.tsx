import Image from "@/components/Image";
import * as Icons from "@/public/icons/footer";

export default function Footer() {
	return (
		<footer className="w-full bg-[#061527]">
			{/* Main footer content */}
			<div className="max-w-[1320px] px-4 xl:px-0 mx-auto py-8 md:py-12 text-white">
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
							<p className="font-normal md:font-medium text-md">Follow us on</p>
							<div className="flex gap-4">
								<a href="#" className=" ">
									<Icons.Instagram />
								</a>
								<a href="#" className=" ">
									<Icons.Linkedin />
								</a>
								<a href="#" className=" ">
									<Icons.Facebook />
								</a>
								<a href="#" className=" ">
									<Icons.Youtube />
								</a>
							</div>
						</div>
					</div>

					{/* Bottom side */}
					<div className="flex md:flex-row flex-col justify-between mt-4 md:mt-6">
						<p className="mb-4 text-xs leading-relaxed">
							CGS International Securities Singapore Pte. Ltd | Company Reg No.: 197901004504
							(UEN703-W)
						</p>
						<div className="flex flex-wrap justify-start md:justify-end gap-x-4 gap-y-2 md:mt-0 text-xs text-center">
							<a href="#">CGS</a>
							<span className="hidden md:inline-block">|</span>

							<a href="#">CDI</a>
							<span className="hidden md:inline-block">|</span>

							<a href="#">Contact Us</a>
							<span className="hidden md:inline-block">|</span>

							<a href="#">Terms of Use</a>

							{/* điểm xuống dòng */}
							<span className="md:hidden basis-full" />

							<a href="#">General Terms and Conditions</a>
							<span className="hidden md:inline-block">|</span>

							<a href="#">Privacy Notice</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
