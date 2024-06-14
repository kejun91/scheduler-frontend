import { Box, Button, Table } from "@cloudscape-design/components";
import { useEffect, useState } from "react";
import DeleteScheduledJobModel from "./DeleteScheduledJobModel";
import { getScheduledJobs } from "./api";
import { getTimeString } from "../../utils/Datetime";

export default function ScheduledJobList() {
    const [jobList, setJobList] = useState<[
        {
            up__id: string,
            name: string,
            scheduled_module_name: string,
            scheduled_class_name: string,
            executable: string,
            arguments: string,
            up__created_date: number,
            last_run_time: number,
            next_run_time: number,
            frequency: string,
            start_time: number,
            deleted_time: number
        }
    ]>([] as any)

    const [deletingJobId, setDeletingJobId] = useState<string | null>(null);

    const fetchJobs = async () => {
        const data = await getScheduledJobs();
        console.log(data);
        setJobList(data || []);
    };

    useEffect(() => {
        fetchJobs();

        const intervalId = setInterval(() => {
            if (!document.hidden) {
                fetchJobs();
            }
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            <Table
                variant="container"
                columnDefinitions={[
                    {
                        id: "name",
                        header: "Scheduled Job Name",
                        cell: item => item.name
                    },
                    {
                        id: "start-date",
                        header: "Start Time",
                        cell: item => getTimeString(item.start_time)
                    },
                    {
                        id: "python-class",
                        header: "Schedulable Python Class",
                        cell: item => item.scheduled_class_name
                    },
                    {
                        id: "frequency",
                        header: "Frequency",
                        cell: item => item.frequency
                    },
                    {
                        id: "last-run-time",
                        header: "Last Run Time",
                        cell: item => getTimeString(item.last_run_time)
                    },
                    {
                        id: "next-run-time",
                        header: "Next Run Time",
                        cell: item => getTimeString(item.next_run_time)
                    },
                    {
                        id: "created-date",
                        header: "Created Date",
                        cell: item => getTimeString(item['up__created_date'])
                    },
                    {
                        id: "action",
                        header: "Action",
                        cell: item => <Button onClick={
                            () => {
                                setDeletingJobId(item.up__id);
                            }
                        }>Delete</Button>,
                        minWidth: "150px"
                    }
                ]}
                items={jobList}
                loadingText="Loading resources"
                sortingDisabled
                empty={
                    <Box
                        margin={{ vertical: "xs" }}
                        textAlign="center"
                        color="inherit"
                    >
                        <b>No job found</b>
                    </Box>
                }
            />
            {deletingJobId 
            && 
            <DeleteScheduledJobModel 
                jobId={deletingJobId} 
                onDismiss={function (): void {
                    setDeletingJobId(null);
                } } 
                onComplete={function (): void {
                    setDeletingJobId(null);
                } } />}
        </>
    );
};