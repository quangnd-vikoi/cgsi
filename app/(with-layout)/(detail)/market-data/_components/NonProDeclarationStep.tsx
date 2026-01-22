import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface NonProDeclarationStepProps {
    onConfirm: () => void;
}

const QUESTIONS = [
    {
        id: "q1",
        text: "Do you use Market Data solely for your personal, non-business use?",
    },
    {
        id: "q2",
        text: "Do you receive Market Data for your business or any other entity?",
    },
    {
        id: "q3",
        text: "Are you currently registered or qualified with the SEC or the CFTC?",
    },
    {
        id: "q4",
        text: "Are you currently registered or qualified with any securities agency, any securities exchange, association or regulatory body, or any commodities or futures contract market, association or regulatory body, in the United States or abroad?",
    },
    {
        id: "q5",
        text: "Whether you are located within or outside of the United States, do you perform any functions that are similar to those that require an individual to register or qualify with the SEC, the CFTC, any other securities agency or regulatory body, or any securities exchange or association or any commodities or futures contract market or association in any location?",
    },
    {
        id: "q6",
        text: "Are you engaged to provide investment advice to any individual or entity?"
    },
    {
        id: "q7",
        text: "Are you engaged as an asset manager?"
    },
    {
        id: "q8",
        text: "Do you use the capital of any other individual or entity in the conduct of your trading?"
    },
    {
        id: "q9",
        text: "Do you conduct trading for the benefit of a corporation, partnership, or other entity?"
    },
    {
        id: "q10",
        text: "Have you entered into any agreement to share the profit of your trading activities or receive compensation for your trading activities?"
    },
    {
        id: "q11",
        text: "Are you receiving office space, and equipment or other benefits in exchange for your trading or work as a financial consultant to any person, firm or business entity?"
    },
] as const;

const NonProDeclarationStep = ({ onConfirm }: NonProDeclarationStepProps) => {
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

                            <RadioGroup defaultValue="no" className="flex justify-start py-2.5">
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
                <Button onClick={onConfirm} className="w-full rounded">
                    Continue
                </Button>
            </div>
        </div>
    );
};

export default NonProDeclarationStep;