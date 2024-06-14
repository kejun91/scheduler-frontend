import { get, post } from "./ApiService";

export const openFolder = async (folder_path: string) => {
    return await post('/api/open-folder',{folder_path:folder_path});
};

export const fetchInitialization = async () => {
    return await get('/api/config/initialization',null);
};

export const setPreferences = async (preferences:any) => {
    return await post('/api/config/preferences', preferences);
};