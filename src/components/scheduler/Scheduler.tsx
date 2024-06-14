import Button from "@cloudscape-design/components/button";
import { useState } from "react";
import { Header, Modal, SpaceBetween } from "@cloudscape-design/components";
import "./Scheduler.css";
import ScheduleNewJobModal from "./ScheduleNewJobModal";
import ScheduledJobList from "./ScheduledJobList";
import ExecutionHistory from "./ExecutionHistory";

export default function Scheduler() {
    const [showNewScheduledJobModal, setShowNewScheduledJobModal] = useState(false);

    return (
        <>
            <SpaceBetween direction="vertical" size="l">
                <div className="Scheduled-Job-Header">
                    <Header
                        actions={
                            <Button variant="primary"
                                onClick={() => setShowNewScheduledJobModal(true)}>
                                Schedule New Job
                            </Button>
                        }
                    >
                        Scheduled Jobs
                    </Header>

                </div>
                <ScheduledJobList />
                <ExecutionHistory />
            </SpaceBetween>
            {showNewScheduledJobModal && <Modal
                size="medium"
                onDismiss={() => setShowNewScheduledJobModal(false)}
                visible={true}
                header="Schedule New Task"
            >
                <ScheduleNewJobModal
                    onCancel={
                        () => {
                            setShowNewScheduledJobModal(false);
                        }
                    }
                    onSubmit={
                        () => {
                            setShowNewScheduledJobModal(false);
                        }
                    } />
            </Modal>}
        </>
    );
};