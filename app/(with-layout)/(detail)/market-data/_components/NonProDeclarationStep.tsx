import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { IMarketSubscriptionExtendedData } from "@/types";

interface NonProDeclarationStepProps {
    onConfirm: (data: Partial<IMarketSubscriptionExtendedData>) => void;
}

const QUESTIONS = [
    {
        id: "q1",
        key: "value_01" as const,
        text: "Do you use Market Data solely for your personal, non-business use?",
    },
    {
        id: "q2",
        key: "value_02" as const,
        text: "Do you receive Market Data for your business or any other entity?",
    },
    {
        id: "q3",
        key: "value_03" as const,
        text: "Are you currently registered or qualified with the SEC or the CFTC?",
    },
    {
        id: "q4",
        key: "value_04" as const,
        text: "Are you currently registered or qualified with any securities agency, any securities exchange, association or regulatory body, or any commodities or futures contract market, association or regulatory body, in the United States or abroad?",
    },
    {
        id: "q5",
        key: "value_05" as const,
        text: "Whether you are located within or outside of the United States, do you perform any functions that are similar to those that require an individual to register or qualify with the SEC, the CFTC, any other securities agency or regulatory body, or any securities exchange or association or any commodities or futures contract market or association in any location?",
    },
    {
        id: "q6",
        key: "value_06" as const,
        text: "Are you engaged to provide investment advice to any individual or entity?"
    },
    {
        id: "q7",
        key: "value_07" as const,
        text: "Are you engaged as an asset manager?"
    },
    {
        id: "q8",
        key: "value_08" as const,
        text: "Do you use the capital of any other individual or entity in the conduct of your trading?"
    },
    {
        id: "q9",
        key: "value_09" as const,
        text: "Do you conduct trading for the benefit of a corporation, partnership, or other entity?"
    },
    {
        id: "q10",
        key: "value_10" as const,
        text: "Have you entered into any agreement to share the profit of your trading activities or receive compensation for your trading activities?"
    },
    {
        id: "q11",
        key: "value_11" as const,
        text: "Are you receiving office space, and equipment or other benefits in exchange for your trading or work as a financial consultant to any person, firm or business entity?"
    },
] as const;

const NonProDeclarationStep = ({ onConfirm }: NonProDeclarationStepProps) => {
    const [answers, setAnswers] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        QUESTIONS.forEach(q => { initial[q.key] = false; });
        return initial;
    });

    const handleContinue = () => {
        onConfirm({
            value_01: answers.value_01,
            value_02: answers.value_02,
            value_03: answers.value_03,
            value_04: answers.value_04,
            value_05: answers.value_05,
            value_06: answers.value_06,
            value_07: answers.value_07,
            value_08: answers.value_08,
            value_09: answers.value_09,
            value_10: answers.value_10,
            value_11: answers.value_11,
        });
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
                        <div key={question.id} className="space-y-1.5">
                            <p className="text-sm">
                                <span className="font-medium">{index + 1}. </span>
                                {question.text}
                            </p>

                            <RadioGroup
                                value={answers[question.key] ? "yes" : "no"}
                                onValueChange={(val) =>
                                    setAnswers(prev => ({ ...prev, [question.key]: val === "yes" }))
                                }
                                className="flex justify-start py-2.5"
                            >
                                <div className="flex-1 flex items-center space-x-2">
                                    <RadioGroupItem value="yes" id={`${question.id}-yes`} />
                                    <Label
                                        htmlFor={`${question.id}-yes`}
                                        className="font-normal cursor-pointer"
                                    >
                                        Yes
                                    </Label>
                                </div>
                                <div className="flex-1 flex items-center space-x-2">
                                    <RadioGroupItem value="no" id={`${question.id}-no`} />
                                    <Label
                                        htmlFor={`${question.id}-no`}
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

            <div className="border-t px-6 py-4">
                <Button onClick={handleContinue} className="w-full rounded">
                    Continue
                </Button>
            </div>
        </div>
    );
};

export default NonProDeclarationStep;
