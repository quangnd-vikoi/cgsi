"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useMemo, useRef, useCallback, memo } from "react";
import { getCountries, getCountryCallingCode, Country as CountryCode } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";
import { CircleFlag } from "react-circle-flags";
import { ChevronDown, CircleCheck, Search, X } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

interface Country {
	code: CountryCode;
	name: string;
	dialCode: string;
}

// Memo hóa CountryItem để tránh re-render không cần thiết
const CountryItem = memo(
	({ country, isSelected, onClick }: { country: Country; isSelected: boolean; onClick: () => void }) => {
		return (
			<div
				onClick={onClick}
				className={`w-full rounded-md border flex justify-between py-2 px-4 cursor-pointer ${isSelected
					? "border-cgs-blue bg-background-section"
					: "border-stroke-secondary hover:bg-gray-50"
					}`}
			>
				<div className="flex items-center">
					<CircleFlag countryCode={country.code.toLowerCase()} className="w-5 h-5" />
					<p className="mx-2 text-sm font-normal">
						{country.name} ({country.dialCode})
					</p>
				</div>
				{isSelected && <CircleCheck size={20} className="text-cgs-blue" />}
			</div>
		);
	}
);

CountryItem.displayName = "CountryItem";

interface MobileInputStepProps {
	phoneNumber: string;
	setPhoneNumber: (value: string) => void;
	error: string;
	setError: (value: string) => void;
	selectedCountry: Country;
	setSelectedCountry: (value: Country) => void;
}

export const MobileInputStep = ({ phoneNumber, setPhoneNumber, error, setError, selectedCountry, setSelectedCountry }: MobileInputStepProps) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [open, setOpen] = useState(false);
	const [tempSelected, setTempSelected] = useState<Country | null>(selectedCountry);

	const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

	console.log(selectedCountry)

	const countries = useMemo(() => {
		return getCountries().map((code) => ({
			code,
			name: en[code as keyof typeof en] || code,
			dialCode: `+${getCountryCallingCode(code)}`,
		}));
	}, []);

	const filteredCountries = useMemo(() => {
		if (!searchTerm) return countries;
		const term = searchTerm.toLowerCase();
		return countries.filter(
			(country) =>
				country.name.toLowerCase().includes(term) ||
				country.code.toLowerCase().includes(term) ||
				country.dialCode.includes(term)
		);
	}, [countries, searchTerm]);

	const popularCountries = useMemo(() => {
		const popularCodes = ["SG", "MY", "CN"];
		return filteredCountries.filter((c) => popularCodes.includes(c.code));
	}, [filteredCountries]);

	const remainingCountries = useMemo(() => {
		const popularCodes = ["SG", "MY", "CN"];
		return filteredCountries.filter((c) => !popularCodes.includes(c.code));
	}, [filteredCountries]);

	const groupedCountries = useMemo(() => {
		const groups: { [key: string]: (typeof countries)[number][] } = {};
		remainingCountries.forEach((country) => {
			const firstLetter = country.name[0].toUpperCase();
			if (!groups[firstLetter]) {
				groups[firstLetter] = [];
			}
			groups[firstLetter].push(country);
		});
		return groups;
	}, [remainingCountries]);

	const alphabet = useMemo(() => Object.keys(groupedCountries).sort(), [groupedCountries]);

	const handleSelectCountry = useCallback((country: Country) => {
		setTempSelected(country);
	}, []);

	const scrollToLetter = useCallback((letter: string) => {
		const element = sectionRefs.current[letter];
		if (element) {
			element.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	}, []);

	const handleApply = useCallback(() => {
		if (tempSelected) setSelectedCountry(tempSelected);
		setOpen(false);
	}, [tempSelected, setSelectedCountry]);

	const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	}, []);

	const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\D/g, ""); // Chỉ cho phép số
		setPhoneNumber(value);
		if (error) setError("");
	};

	return (
		<div className="pad-x">
			<p className="text-base font-bold mb-6">Enter your new mobile number</p>
			<div className="flex w-full relative">
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger className="absolute left-1 -top-0.5">
						<div className="flex gap-2 items-center px-1 shrink-0 text-sm font-semibold">
							<CircleFlag
								countryCode={selectedCountry.code.toLowerCase()}
								className="h-5 w-5"
							/>
							{selectedCountry?.dialCode}
							<ChevronDown className="text-icon-light -ml-1 h-10 shrink-0" size={16} />
						</div>
					</DialogTrigger>
					<DialogContent className="w-full max-w-[343px] h-[80%] md:h-[88%] md:max-w-[530px] mx-auto p-0 pt-6 gap-0 flex flex-col">
						<DialogHeader className="pad-x mb-6 shrink-0">
							<DialogTitle>Select Country Code</DialogTitle>
						</DialogHeader>

						{/* Fixed Search Input */}
						<div className="pad-x shrink-0 mb-6">
							<div className="relative">
								<Input
									placeholder="Search country name or code"
									className="rounded px-4 border leading-4 placeholder:font-normal !placeholder:text-theme-neutral-06 !border-stroke-primary text-sm"
									value={searchTerm}
									onChange={handleSearchChange}
								/>
								<Search
									role="button"
									size={16}
									className="absolute text-icon-light right-4 bottom-2.5"
								/>
							</div>
						</div>

						{/* Scrollable Content */}
						<div className="pad-x space-y-6 flex-1 overflow-y-auto sidebar-scroll relative">
							{selectedCountry && (
								<div>
									<p className="text-xs text-typo-secondary">Selected</p>
									<div className="mt-3 rounded bg-background-section p-4">
										<div className="border border-stroke-secondary rounded-md px-4 py-2 flex justify-between items-center">
											<div className="flex justify-center">
												<CircleFlag
													countryCode={selectedCountry.code.toLowerCase()}
													className="w-5 h-5"
												/>
												<p className="mx-2 text-sm font-normal">
													{selectedCountry.name} ({selectedCountry.dialCode})
												</p>
											</div>
											<X size={20} className="text-icon-light" />
										</div>
									</div>
								</div>
							)}
							{popularCountries.length > 0 && (
								<div>
									<p className="text-xs text-typo-secondary">Popular Region</p>
									<div className="space-y-3 mt-3">
										{popularCountries.map((country) => (
											<CountryItem
												key={country.code}
												country={country}
												isSelected={tempSelected?.code === country.code}
												onClick={() => handleSelectCountry(country)}
											/>
										))}
									</div>
								</div>
							)}
							{alphabet.length > 0 && (
								<div>
									<p className="text-xs text-typo-secondary mb-3">List of countries</p>
									{alphabet.map((letter) => (
										<div
											key={letter}
											ref={(el) => {
												sectionRefs.current[letter] = el;
											}}
											className="mb-4"
										>
											<p className="text-xs font-semibold text-typo-primary mb-2">
												{letter}
											</p>
											<div className="space-y-3">
												{groupedCountries[letter].map((country) => (
													<CountryItem
														key={country.code}
														country={country}
														isSelected={tempSelected?.code === country.code}
														onClick={() => handleSelectCountry(country)}
													/>
												))}
											</div>
										</div>
									))}
								</div>
							)}
							{alphabet.length > 0 && (
								<div className="w-8 pr-2 flex flex-col items-center justify-start pt-30 gap-[1px] fixed -right-3 md:-right-2 top-10 md:top-20">
									{alphabet.map((letter) => (
										<button
											key={letter}
											onClick={() => scrollToLetter(letter)}
											className="text-[10px] text-cgs-blue hover:text-xs hover:font-bold transition-all"
										>
											{letter}
										</button>
									))}
								</div>
							)}
						</div>

						{/* Fixed Footer */}
						<DialogFooter className="rounded-b-lg shrink-0">
							<Button onClick={handleApply} className="px-3 rounded-sm">
								Apply
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
				<Input
					className="flex-1 pl-24 text-sm"
					placeholder="Enter here"
					value={phoneNumber}
					onChange={handlePhoneChange}
					error={error}
				/>
			</div>
		</div>
	);
};
