import { get, post } from "../../services/ApiService";

export const getSchedulablePythonClasses = async () => {
    return await get('/api/scheduler/schedulable-classes',null);
};

export const getScheduledJobs = async () => {
    return await get('/api/scheduler/jobs',null);
};


export const removeScheduledJob = async (jobId:string) => {
    return await post(`/api/scheduler/delete-job`,{jobId});
};

export const addScheduledJob = async (taskName:string, moduleName: string, className: string, executionFrequency: string, executionStartTime:string) => {
    return await post('/api/scheduler/job',{taskName, moduleName, className, executionFrequency, executionStartTime});
};

export const getExecutionHistory = async () => {
    return await get('/api/scheduler/execution-history',null);
}