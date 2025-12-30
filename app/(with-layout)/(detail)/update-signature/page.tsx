"use client";
import Alert from "@/components/Alert";
import Title from "@/components/Title";
import { INTERNAL_ROUTES } from "@/constants/routes";
import { FileUp, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CustomCircleAlert from "@/components/CircleAlertIcon";
import useToggle from "@/hooks/useToggle";
import Image from "@/components/Image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorState } from "@/components/ErrorState";

const UpdateSignature = () => {
	const router = useRouter();
	const [error, setError] = useState<string>("");
	const [showToast, setShowToast] = useState<string>("");
	const sigCanvas = useRef<SignatureCanvas>(null);
	const [tab, setTab] = useState<"draw" | "upload">("draw");
	const { value, setTrue, toggle } = useToggle();
	const [status, setStatus] = useState<"update" | "success" | "failed">("update");

	useEffect(() => {
		if (showToast != "") {
			const timer = setTimeout(() => {
				setShowToast("");
			}, 2000);
			return () => clearTimeout(timer);
		}
	}, [showToast]);

	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [uploadProgress, setUploadProgress] = useState<number>(0);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	useEffect(() => {
		setError("");
	}, [selectedFile]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Kiểm tra size
			if (file.size > 5 * 1024 * 1024) {
				setError("File size exceed 5MB");
				return;
			}
			setSelectedFile(file);

			// Tạo preview nếu là image
			if (file.type.startsWith("image/")) {
				const reader = new FileReader();
				reader.onloadend = () => {
					setPreviewUrl(reader.result as string);
				};
				reader.readAsDataURL(file);
			} else {
				setPreviewUrl(null);
			}

			// Simulate upload progress
			simulateUpload();
		}
	};

	const simulateUpload = () => {
		setUploadProgress(0);
		const interval = setInterval(() => {
			setUploadProgress((prev) => {
				if (prev >= 100) {
					clearInterval(interval);
					return 100;
				}
				return prev + 10;
			});
		}, 100);
	};

	const removeFile = () => {
		setSelectedFile(null);
		setUploadProgress(0);
	};

	const formatFileSize = (bytes: number) => {
		return `${(bytes / 1024).toFixed(0)} KB`;
	};

	const handleLabelClick = () => {
		if (selectedFile != null) {
			setShowToast("Only 1 file can be uploaded at any point in time");
		}
	};

	const handleClear = () => {
		setError("");
		if (tab == "draw") {
			if (sigCanvas.current) {
				sigCanvas.current.clear();
				setError("");
				setShowToast("Drawn signature has been cleared");
			}
		} else {
			setSelectedFile(null);
			setShowToast("Uploaded file has been cleared");
		}
	};

	const handleSubmit = () => {
		setError("");
		if (tab == "draw") {
			if (!sigCanvas.current) return;

			if (sigCanvas.current.isEmpty()) {
				setError("Field cannot be empty");
			} else {
				setError("");
				sigCanvas.current.toDataURL();
				setStatus("success");
			}
		} else {
			if (!selectedFile) {
				setError("File cannot be empty");
			}

			setStatus("success");
		}
	};

	return (
		<div className="w-full max-w-[480px] mx-auto flex-1 flex flex-col h-full">
			<div className="shrink-0">
				<Title
					title="Update Signature"
					rightContent={
						<Alert
							trigger={<X />}
							title="Exit Update Signature?"
							description={<p>Any information previously entered will be discarded.</p>}
							actionText="Back To Form"
							cancelText="Exit without Saving"
							onCancel={() => router.push(INTERNAL_ROUTES.HOME)}
						/>
					}
				/>
			</div>

			<div className="bg-white rounded-xl flex-1 flex flex-col justify-between pt-6 overflow-hidden min-h-0">
				{status != "success" ? (
					<Tabs defaultValue={tab} className="pad-x gap-0">
						<TabsList className="">
							<TabsTrigger className="pb-2.5" value="draw" onClick={() => setTab("draw")}>
								Draw Signature
							</TabsTrigger>
							<TabsTrigger className="pb-2.5" value="upload" onClick={() => setTab("upload")}>
								Upload File
							</TabsTrigger>
						</TabsList>
						<TabsContent value="draw">
							<div className="w-full mt-6">
								<div
									className={cn(
										"border-2 border-dashed rounded-lg overflow-hidden bg-white",
										error ? "border-status-error" : "border-enhanced-blue"
									)}
									style={{ width: "100%", height: "312px" }}
								>
									<SignatureCanvas
										ref={sigCanvas}
										canvasProps={{
											style: { width: "100%", height: "100%" },
										}}
										backgroundColor="white"
										penColor="black"
									/>
								</div>
								{error && (
									<p className="text-status-error text-xs mt-1 flex items-center gap-1">
										<CustomCircleAlert size={15} />
										{error}
									</p>
								)}
							</div>
						</TabsContent>
						<TabsContent value="upload">
							<div className="w-full mt-6">
								<div className="text-typo-secondary text-normal text-sm">
									<p>Before uploading your signature image, please ensure the following:</p>
									<ul className="list-disc list-outside mt-2 pl-4 md:pl-6 space-y-1">
										<li>
											The signature is signed on a blank white sheet of paper using a
											black or blue pen
										</li>
										<li>The signature is fully visible and unobstructed</li>
										<li>The image is clear and in high resolution</li>
									</ul>

									<div className="mt-6">
										For reference, please review this{" "}
										<span
											className="text-enhanced-blue font-semibold cursor-pointer"
											onClick={() => setTrue()}
										>
											Sample Signature
										</span>{" "}
										to ensure your upload meets the required standards.
									</div>

									<Label
										htmlFor="signature-upload"
										className="cursor-pointer w-full block"
										onClick={() => handleLabelClick()}
									>
										<div
											className={cn(
												"border border-dashed bg-background-section rounded-lg w-full py-4 flex flex-col items-center justify-center gap-1.5  mt-6",
												error
													? "border-status-error bg-background-error text-status-error"
													: selectedFile != null
														? "border-stroke-secondary text-status-disable-primary bg-theme-neutral-095 cursor-not-allowed"
														: "border-enhanced-blue text-enhanced-blue bg-background-section shadow-[0px_3px_16px_0px_rgba(0,108,235,0.20)] cursor-pointer "
											)}
										>
											<FileUp className="" size={24} strokeWidth={1.25} />
											<p className="text-sm font-normal">Upload Signature</p>
										</div>
										{error && (
											<p className="text-status-error text-xs mt-1 flex items-center gap-1">
												<CustomCircleAlert size={15} />
												{error}
											</p>
										)}
										<Input
											disabled={selectedFile !== null}
											id="signature-upload"
											type="file"
											accept="image/jpeg,image/jpg,image/png,application/pdf"
											className="hidden"
											onChange={handleFileChange}
										/>
									</Label>

									<p className="w-full text-center text-typo-tertiary mt-2 font-normal">
										Max File Size: 5 MB
										<br />
										Accepted File format: JPEG, JPG, PNG, PDF
									</p>

									{selectedFile && (
										<div className="mt-4 border border-gray-200 rounded-lg overflow-hidden bg-background-section">
											<div className="p-3">
												<div className="flex items-stretch gap-3">
													{/* File Icon/Image Preview */}
													<div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
														{previewUrl ? (
															<Image
																src={previewUrl}
																alt="Preview"
																className="w-full h-full object-cover"
																width={40}
																height={40}
															/>
														) : (
															<FileUp className="text-gray-400" size={24} />
														)}
													</div>

													{/* File Info */}
													<div className="flex flex-1 items-center justify-between gap-2">
														<div className="flex-1">
															<p className="text-xs font-medium text-typo-primary truncate">
																{selectedFile.name}
															</p>
															<div className="flex items-center gap-2 mt-1 text-[10px] text-typo-tertiary">
																{formatFileSize(
																	(selectedFile.size * uploadProgress) / 100
																)}{" "}
																of {formatFileSize(selectedFile.size)}
																<span>•</span>
																{uploadProgress != 100 ? (
																	<span>Uploading {uploadProgress}%</span>
																) : (
																	<span className="text-enhanced-blue">
																		Completed
																	</span>
																)}
															</div>
														</div>

														{/* Remove Button */}
														<button
															onClick={removeFile}
															className="flex-shrink-0 text-gray-400 hover:text-typo-teritary transition-colors"
														>
															<X size={20} />
														</button>
													</div>
												</div>
											</div>

											{/* Progress Bar at Bottom */}
											<div className="w-full bg-gray-200 h-0.5">
												<div
													className="bg-enhanced-blue h-1.5 transition-all duration-300"
													style={{ width: `${uploadProgress}%` }}
												/>
											</div>
										</div>
									)}

									{/* file selected */}

									<Alert
										cancelText=""
										actionText="Cancel"
										open={value}
										onOpenChange={toggle}
										title="Signature Sample"
										description={
											<Image
												src={"/icons/signature_sample.svg"}
												alt="signature sample"
												width={346}
												height={120}
												className="mx-auto pt-8 pb-4"
											/>
										}
									/>
								</div>
							</div>
						</TabsContent>
					</Tabs>
				) : (
					<ErrorState
						type="success"
						title="Signature Updated"
						description="Your signature will be stored securely but won’t be visible after upload."
						className="m-auto px-4"
					/>
				)}

				{status != "success" ? (
					<div className="">
						{/* Toast */}
						{showToast != "" && (
							<div className="rounded-full bg-theme-blue-085 text-xs w-fit mx-auto mb-4 px-4 py-2 shadow-[0px_2px_16.299999237060547px_-1px_rgba(33,64,154,0.10)] text-theme-blue-03">
								{showToast}
							</div>
						)}
						<div className="pad-x py-4 border-t w-full relative flex gap-2">
							<Button
								className="w-1/2 text-base font-normal bg-transparent border-none text-enhanced-blue hover:border-enhanced-blue/75 hover:bg-transparent hover:text-enhanced-blue/75"
								onClick={() => handleClear()}
							>
								Clear
							</Button>
							<Button className="w-1/2 text-base font-normal" onClick={() => handleSubmit()}>
								Submit
							</Button>
						</div>
					</div>
				) : (
					<div className="px-6 py-4 border-t w-full relative flex gap-2">
						<Button
							className="w-full text-base font-normal"
							onClick={() => router.push(INTERNAL_ROUTES.HOME)}
						>
							Back to Home
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default UpdateSignature;
