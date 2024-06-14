import { Modal, Box, SpaceBetween, Button } from "@cloudscape-design/components";
import { useState } from "react";
import { removeScheduledJob } from "./api";

interface DeleteScheduledJobModelProps {
    jobId:string
    onDismiss:() => void
    onComplete:() => void
}

export default function DeleteScheduledJobModel({jobId, onDismiss, onComplete}:DeleteScheduledJobModelProps){
    const [isDeleting, setIsDeleting] = useState(false);

    const remove = async () => {
        const data = await removeScheduledJob(jobId || '');
        console.log(data);
        setIsDeleting(false);
        onComplete();
    };
    
    return (
        <Modal visible={true}
            header="Delete the job"
            onDismiss={() => {
                if(!isDeleting){
                    onDismiss();
                }
            }}
            footer={
                <Box float="right">
                    <SpaceBetween direction="horizontal" size="xs">
                        <Button variant="link"
                            disabled={isDeleting}
                            onClick={
                                () => onDismiss()
                            }>Cancel</Button>
                        <Button variant="primary"
                            disabled={isDeleting}
                            onClick={
                                () => {
                                    setIsDeleting(true);
                                    remove();
                                }
                            }>Confirm</Button>
                    </SpaceBetween>
                </Box>
            }
        >
            Please confirm to delete the job.
        </Modal>
    )
};