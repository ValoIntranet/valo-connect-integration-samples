export interface ITokenResponse {
    token: {
        client_id: number;
        created_at: string | null;
        expires_at: string | null;
        id: number;
        refresh_token: null;
        scopes: string[];
        token: null;
        url: string;
        used_at: null;
        user_id: number;
    };
}