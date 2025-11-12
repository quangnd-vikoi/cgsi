import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import Link from "next/link";
import React from "react";

const UpdateMobile = () => {
	return (
		<div className="w-[480px] mx-auto flex-1 flex flex-col">
			<div className="shrink-0">
				<Title
					title="Update Mobile Number"
					rightContent={
						<Link href={"/"}>
							<X />
						</Link>
					}
				/>
			</div>

			<div className="bg-white rounded-xl flex-1 flex flex-col justify-between p-4">
				<div className="">
					<p>Enter your new mobile number</p>
					<Input className="w-full" />
				</div>

				<Button>Continue</Button>
			</div>
		</div>
	);
};

export default UpdateMobile;
