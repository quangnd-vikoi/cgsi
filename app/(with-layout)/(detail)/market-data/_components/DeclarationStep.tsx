import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { IMarketSubscriptionExtendedData } from "@/types";

interface DeclarationStepProps {
    extendedData: IMarketSubscriptionExtendedData;
    setExtendedData: Dispatch<SetStateAction<IMarketSubscriptionExtendedData>>;
    onConfirm: () => void;
}

const FORM_FIELDS = [
    { id: "name" as const, label: "Name", required: true, readOnly: true },
    { id: "address" as const, label: "Address", required: true },
    { id: "occupation" as const, label: "Occupation", required: true },
    { id: "employer" as const, label: "Employer Name", required: true },
    { id: "employerAddress" as const, label: "Employer Address", required: true },
    { id: "employmentTitle" as const, label: "Title or Position" },
    { id: "employmentFunction" as const, label: "Employment Functions" },
] as const;

const DeclarationStep = ({ extendedData, setExtendedData, onConfirm }: DeclarationStepProps) => {
    const handleChange = (field: (typeof FORM_FIELDS)[number]["id"], value: string) => {
        setExtendedData((prev) => ({ ...prev, [field]: value }));
    };

    const isValid = extendedData.name.trim() !== "" &&
        extendedData.address.trim() !== "" &&
        extendedData.occupation.trim() !== "" &&
        (extendedData.employer?.trim() ?? "") !== "" &&
        (extendedData.employerAddress?.trim() ?? "") !== "";

    return (
        <div className="bg-white rounded flex-1 flex flex-col overflow-hidden min-h-0">
            <div className="flex-1 overflow-y-auto sidebar-scroll sidebar-offset-2">
                <div className="py-6 pad-x space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold mb-2">
                            Personal and Employment Data
                        </h2>
                        <p className="mt-2 text-typo-secondary text-sm">
                            As a prerequisite to qualify as a &quot;Non-Professional
                            Subscriber&quot;, kindly provide the following information:
                        </p>
                    </div>

                    {FORM_FIELDS.map((field) => (
                        <div key={field.id}>
                            <Label htmlFor={field.id}>
                                {field.label}
                                {"required" in field && field.required && (
                                    <span className="text-status-error ml-0.5">*</span>
                                )}
                            </Label>
                            <Textarea
                                id={field.id}
                                name={field.id}
                                className="mt-2 h-auto min-h-9 resize-none"
                                rows={1}
                                placeholder="Type Here"
                                value={(extendedData[field.id] as string) ?? ""}
                                onChange={(e) => handleChange(field.id, e.target.value)}
                                readOnly={"readOnly" in field && field.readOnly}
                                disabled={"readOnly" in field && field.readOnly}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t px-6 py-4">
                <Button onClick={onConfirm} className="w-full rounded" disabled={!isValid}>
                    Checkout
                </Button>
            </div>
        </div>
    );
};

export default DeclarationStep;
