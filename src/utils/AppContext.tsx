import { Mode, applyMode } from "@cloudscape-design/global-styles";
import { FC, ReactNode, createContext, useContext, useState } from "react";
import { fetchInitialization, setPreferences } from "../services/api";

interface AppContextProps {
    loadStatus: string;
    updateIsSessioned: (session_info:any) => void;

    region: string;
    visualMode: string;
    timezone: string;

    updateRegion: (selectedRegion:string) => void;
    updateVisualMode: (mode:string) => void;

    updatePreferences: (preferences:any) => void;

    supportedTenantConfigs: TenantConfig[];
    supportedRegions: string[];
    supportedSolutionTypes: string[];

    getTenantFromVin: (vin: string) => string | null;

    flashbarItems: any[];
    showToast: (message:any) => void;
    removeMessage: (messageId:string) => void;
}

interface TenantConfig {
    region: string;
    accountGroup: string;
    market: string;
    environment: string;
    brand: BrandConfig;
    tenant: string;
}

interface BrandConfig {
    name: string;
    vinRegExp: string;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if(!context) {
        throw new Error('useAppContext must be used within a AppProvider');
    }
    return context;
};

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: FC<AppProviderProps> = ({children}) => {
    const [loadStatus, setLoadStatus] = useState(document.cookie.includes('session_id')?'initializing':'no-session');

    const [region, setRegion] = useState('eu');
    const [visualMode, setVisualMode] = useState('light');
    const [timezone, setTimezone] = useState('');

    const [supportedTenantConfigs, setSupportedTenantConfigs] = useState<TenantConfig[]>([]);
    const [supportedRegions, setSupportedRegions] = useState([]);
    const [supportedSolutionTypes, setSupportedSolutionTypes] = useState([]);

    const [flashbarItems, setFlashbarItems] = useState<any[]>([]);

    const updateRegion = (selectedRegion: string) => {
        setRegion(selectedRegion);
        setPreferences({'region':selectedRegion});
    };

    const updateVisualMode = (mode:string) => {
        applyMode(mode === 'dark' ? Mode.Dark : Mode.Light)
    };

    const updatePreferences = (preferences:any) => {
        for (let key in preferences){
            const v = preferences[key];
            if (key === 'visualMode'){
                setVisualMode(v);
                applyMode(v === 'dark' ? Mode.Dark : Mode.Light);
                setPreferences(preferences);
            }
        }
    };

    const initFunc = async () => {
        const data = await fetchInitialization();

        if (data) {
            const configurations = data['configurations'];
            setSupportedTenantConfigs(configurations['tenants']);
            setSupportedRegions(configurations['regions']);
            setSupportedSolutionTypes(configurations['solutionTypes']);
            
            const preferences = data['preferences'];
            setRegion(preferences['region']);
            const visualMode = preferences['visualMode'];
            setVisualMode(visualMode);
            updateVisualMode(visualMode);
        }
        setLoadStatus('loaded');
    };

    if (loadStatus === 'initializing') {
        initFunc();
    }

    const updateIsSessioned = (sessionInfo:any) => {
        const preferences = sessionInfo['preferences'];
        setRegion(preferences['region']);
        setVisualMode(preferences['visualMode']);
        setTimezone(preferences['timezone']);

        setLoadStatus('initializing');
        initFunc();
    };

    const getTenantFromVin = (vin: string) => {
        for (const tc of supportedTenantConfigs.filter(tc => tc.region === region)){
            if(tc.brand.vinRegExp){
                if(new RegExp(tc.brand.vinRegExp).test(vin)){
                    return tc.tenant;
                }
            }
        }
        return null;
    };

    const showToast = (message:any) => {
        const id = new Date().getTime().toString() + Math.random().toString();

        const flashbarItem = {
            type: message.type,
            header: message.header,
            content: message.content,
            id: id
        };

        setFlashbarItems([...flashbarItems, ...[flashbarItem]]);

        if (message.mode !== 'sticky') {
            setTimeout(() => {
                setFlashbarItems(flashbarItems.filter(item => item.id !== id));
            }, 3000);
        }
    };

    const removeMessage = (messageId: string) => {
        setFlashbarItems(flashbarItems.filter(item => item.id !== messageId));
    };
    
    return (
        <AppContext.Provider value={{region, visualMode, updateRegion, updatePreferences, loadStatus, supportedTenantConfigs, supportedRegions, supportedSolutionTypes, getTenantFromVin, updateIsSessioned, timezone, updateVisualMode, flashbarItems, showToast, removeMessage}}>
            {children}
        </AppContext.Provider>
    );
};