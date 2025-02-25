export interface MCPToolDescription {
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            [key: string]: {
                type: string;
                description: string;
            };
        };
    };
}

export interface MCPResponse {
    success: boolean;
    data?: any;
    error?: string;
}
