import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DeclarationStepProps {
    onConfirm: () => void;
}

const FORM_FIELDS = [
    { id: "name", label: "Name" },
    { id: "address", label: "Address" },
    { id: "occupation", label: "Occupation" },
    { id: "employerName", label: "Employer Name" },
    { id: "title", label: "Title or Position" },
    { id: "functions", label: "Employment Functions" },
] as const;

const DeclarationStep = ({ onConfirm }: DeclarationStepProps) => {
    return (
        <div className="bg-white rounded-lg flex-1 flex flex-col overflow-hidden min-h-0">
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
                            <Label htmlFor={field.id}>{field.label}</Label>
                            <Textarea
                                id={field.id}
                                name={field.id}
                                className="mt-2 h-auto min-h-9 resize-none"
                                rows={1}
                                placeholder="Type Here"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t px-6 py-4">
                <Button onClick={onConfirm} className="w-full rounded">
                    Continue
                </Button>
            </div>
        </div>
    );
};

export default DeclarationStep;