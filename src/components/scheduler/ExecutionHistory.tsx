import { Box, Header, Table } from "@cloudscape-design/components";
import { useEffect, useState } from "react";
import { getExecutionHistory } from "./api";
import { getTimeString } from "../../utils/Datetime";

export default function ExecutionHistory() {
    const [histories, setHistories] = useState<[{run_start_time: number, run_end_time: number, message: string, scheduled_job_name: string, status: string}]>([] as any);

    const fetchHistory = async () => {
        const data = await getExecutionHistory();
        console.log(data);
        setHistories(data || []);
    };

    useEffect(() => {
        fetchHistory();
        const intervalId = setInterval(() => {
            if (!document.hidden) {
                fetchHistory();
            }
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <Table
            header={<Header>Execution History</Header>}
            variant="container"
            columnDefinitions={[
                {
                    id: "scheduled-job-name",
                    header: "Scheduled Job Name",
                    cell: item => item.scheduled_job_name
                },
                {
                    id: "execution-start-time",
                    header: "Execution Start Time",
                    cell: item => getTimeString(item.run_start_time)
                },
                {
                    id: "execution-end-time",
                    header: "Execution End Time",
                    cell: item => getTimeString(item.run_end_time)
                },
                {
                    id: "status",
                    header: "Status",
                    cell: item => item.status,
                    minWidth: "150px"
                },
                {
                    id: "message",
                    header: "Message",
                    cell: item => item.message
                }
            ]}
            items={histories}
            sortingDisabled
            wrapLines
            empty={
                <Box
                    margin={{ vertical: "xs" }}
                    textAlign="center"
                    color="inherit"
                >
                    <b>No history</b>
                </Box>
            }
        />
    );
}