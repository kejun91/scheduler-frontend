export function getTimeString(timestamp:number) {
    if(timestamp){
        return new Date(timestamp).toISOString();
    } else {
        return "-"
    }
}