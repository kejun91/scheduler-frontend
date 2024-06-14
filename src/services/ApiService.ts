const baseUrl = window.location.origin;

export const sendRequest = async (endpoint: string, method:string, query_string:string | null, request_body:object | null) => {
    if (['GET','DELETE'].includes(method) && query_string){
        endpoint = endpoint + '?' + query_string;
    }

    const request: RequestInit = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    }

    if (['POST','PUT'].includes(method) && request_body){
        request.body = JSON.stringify(request_body)
    }

    try {
        const response = await fetch(baseUrl + endpoint, request);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
};

export const get = async (endpoint:string, query_string:string|null) => {
    return await sendRequest(endpoint, 'GET', query_string, null);
};

export const post = async (endpoint: string, request_body:object | null) => {
    return await sendRequest(endpoint, 'POST', null, request_body);
}

export const put = async (endpoint: string, request_body:object | null) => {
    return await sendRequest(endpoint, 'PUT', null, request_body);
}

export const delete_x = async (endpoint: string, query_string:string | null) => {
    return await sendRequest(endpoint, 'DELETE', query_string, null);
}