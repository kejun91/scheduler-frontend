import SpaceBetween from "@cloudscape-design/components/space-between";
import Form from "@cloudscape-design/components/form";
import Button from "@cloudscape-design/components/button";
import Select, { SelectProps } from "@cloudscape-design/components/select";
import { useEffect, useState } from "react";
import { FormField, Input, Grid, RadioGroup } from "@cloudscape-design/components";
import TimeInput from "../../lib/TimeInput/TimeInput";
import { addScheduledJob, getSchedulablePythonClasses } from "./api";

interface NewScheduledJobModalProps {
    onSubmit: () => void;
    onCancel: () => void;
}

export default function ScheduleNewJobModal({ onSubmit, onCancel }: NewScheduledJobModalProps) {
    const [jobName, setJobName] = useState("");
    const [schedulablePythonClasses, setSchedulablePythonClasses] = useState<SelectProps.Option[]>([]);
    const [selectedPythonClass, setSelectedPythonClass] = useState<SelectProps.Option | null>(null);

    const [submitting, setSubmitting] = useState(false);

    const [frequencyType, setFrequencyType] = useState('');
    const [startAt, setStartAt] = useState('');

    const fetchSchedulablePythonClasses = async () => {
        const data = await getSchedulablePythonClasses();
        console.log(data);
        setSchedulablePythonClasses(data.map((e: any) => { return { label: e.name, value: `${e.module}#${e.name}` } }));
    };

    const newSchedulableJob = async (moduleName:any, className:any) => {
        const data = await addScheduledJob(jobName, moduleName, className, frequencyType, startAt);
        console.log(data);
        setSubmitting(false);
        onSubmit();
    };

    useEffect(() => {
        fetchSchedulablePythonClasses();
    }, []);

    return (
        <form onSubmit={e => e.preventDefault()}>
            <Form
                actions={
                    <SpaceBetween direction="horizontal" size="xs">
                        <Button disabled={submitting} formAction="none" variant="link" onClick={() => {
                            onCancel();
                        }}>
                            Cancel
                        </Button>
                        <Button
                            disabled={submitting || !(selectedPythonClass !== null && (jobName !== "") && frequencyType !== '' && startAt !== '')}
                            variant="primary"
                            onClick={() => {
                                setSubmitting(true);
                                const classParts = selectedPythonClass?.value?.split('#');

                                if (classParts !== undefined) {
                                    newSchedulableJob(classParts[0], classParts[1]);
                                } else {
                                    console.error("class is not defined");
                                    setSubmitting(false);
                                }
                            }}>Submit</Button>
                    </SpaceBetween>
                }
            >
                <SpaceBetween direction="vertical" size="xxl">

                    <FormField label="Scheduled Job Name">
                        <Input value={jobName} onChange={(event) => setJobName(event.detail.value)} />
                    </FormField>
                    <FormField label="Schedulable Python Classes">
                        <Select
                            selectedOption={selectedPythonClass}
                            filteringType="auto"
                            onChange={({ detail }) =>
                                setSelectedPythonClass(detail.selectedOption)
                            }
                            options={schedulablePythonClasses}
                        />
                    </FormField>
                    <FormField
                        label="Execution Condition"
                    >
                        <Grid gridDefinition={[{ colspan: 3 }, { colspan: 9 }]}>
                            <div>
                                <RadioGroup
                                    onChange={({ detail }) => setFrequencyType(detail.value)}
                                    value={frequencyType}
                                    items={[
                                        { value: "hourly", label: "Hourly" },
                                        { value: "daily", label: "Daily" }
                                    ]}
                                />
                            </div>
                            <div>
                                Starting at <TimeInput value={startAt} onChange={(event) => setStartAt(event.detail.value)} />
                            </div>
                        </Grid>
                    </FormField>
                </SpaceBetween>
            </Form>
        </form>
    );
}