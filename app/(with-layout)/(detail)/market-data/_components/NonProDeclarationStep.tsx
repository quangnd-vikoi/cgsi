import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { IMarketSubscriptionExtendedData } from "@/types";

interface NonProDeclarationStepProps {
    extendedData: IMarketSubscriptionExtendedData;
    setExtendedData: Dispatch<SetStateAction<IMarketSubscriptionExtendedData>>;
    onConfirm: () => void;
}

const QUESTIONS = [
    { key: "value_01" as const, text: "Do you use Market Data solely for your personal, non-business use?" },
    { key: "value_02" as const, text: "Do you receive Market Data for your business or any other entity?" },
    { key: "value_03" as const, text: "Are you currently registered or qualified with the SEC or the CFTC?" },
    { key: "value_04" as const, text: "Are you currently registered or qualified with any securities agency, any securities exchange, association or regulatory body, or any commodities or futures contract market, association or regulatory body, in the United States or abroad?" },
    { key: "value_05" as const, text: "Whether you are located within or outside of the United States, do you perform any functions that are similar to those that require an individual to register or qualify with the SEC, the CFTC, any other securities agency or regulatory body, or any securities exchange or association or any commodities or futures contract market or association in any location?" },
    { key: "value_06" as const, text: "Are you engaged to provide investment advice to any individual or entity?" },
    { key: "value_07" as const, text: "Are you engaged as an asset manager?" },
    { key: "value_08" as const, text: "Do you use the capital of any other individual or entity in the conduct of your trading?" },
    { key: "value_09" as const, text: "Do you conduct trading for the benefit of a corporation, partnership, or other entity?" },
    { key: "value_10" as const, text: "Have you entered into any agreement to share the profit of your trading activities or receive compensation for your trading activities?" },
    { key: "value_11" as const, text: "Are you receiving office space, and equipment or other benefits in exchange for your trading or work as a financial consultant to any person, firm or business entity?" },
] as const;

const NonProDeclarationStep = ({ extendedData, setExtendedData, onConfirm }: NonProDeclarationStepProps) => {
    const handleChange = (key: (typeof QUESTIONS)[number]["key"], value: boolean) => {
        setExtendedData((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="bg-white rounded flex-1 flex flex-col overflow-hidden min-h-0">
            <div className="flex-1 overflow-y-auto sidebar-scroll sidebar-offset-2">
                <div className="py-6 pad-x space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold mb-2">
                            Non-Professional Subscriber Qualifications
                        </h2>
                        <p className="mt-2 text-typo-secondary text-sm">
                            As a prerequisite to qualify as a &quot;Non-Professional
                            Subscriber&quot;, kindly provide the following information:
                        </p>
                    </div>

                    {QUESTIONS.map((question, index) => (
                        <div key={question.key} className="space-y-1.5">
                            <p className="text-sm">
                                <span className="font-medium">{index + 1}. </span>
                                {question.text}
                            </p>

                            <RadioGroup
                                value={extendedData[question.key] === true ? "yes" : extendedData[question.key] === false ? "no" : ""}
                                onValueChange={(v) => handleChange(question.key, v === "yes")}
                                className="flex justify-start py-2.5"
                            >
                                <div className="flex-1 flex items-center space-x-2">
                                    <RadioGroupItem value="yes" id={`${question.key}-yes`} />
                                    <Label
                                        htmlFor={`${question.key}-yes`}
                                        className="font-normal cursor-pointer"
                                    >
                                        Yes
                                    </Label>
                                </div>
                                <div className="flex-1 flex items-center space-x-2">
                                    <RadioGroupItem value="no" id={`${question.key}-no`} />
                                    <Label
                                        htmlFor={`${question.key}-no`}
                                        className="font-normal cursor-pointer"
                                    >
                                        No
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t pad-x py-4">
                <Button onClick={onConfirm} className="w-full rounded text-sm md:text-base">
                    Continue
                </Button>
            </div>
        </div>
    );
};

export default NonProDeclarationStep;
