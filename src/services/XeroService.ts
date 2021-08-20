import { HttpClient, HttpClientResponse } from '@microsoft/sp-http';

const API_HOSTNAME: string = "https://valo-xero-dev01.azurewebsites.net/xero-api";

export class XeroService {

    constructor(protected httpClient: HttpClient, protected accessToken?: string, protected xeroTenantId?: string) {

    }

    public setAccessToken(accessToken: string) {
        this.accessToken = accessToken;
    }

    public setXeroTenantId(tenantId: string) {
        this.xeroTenantId = tenantId;
    }

    public async getTenants() {
        return this.get(`${API_HOSTNAME}/connections`);
    }

    public async getPayruns() {
        const payrunsData = await this.get(`${API_HOSTNAME}/payroll.xro/1.0/Payruns`);
        return payrunsData.PayRuns ? payrunsData.PayRuns : [];
    }

    public async getPayrun(id: string) {
        const payrunData = await this.get(`${API_HOSTNAME}/payroll.xro/1.0/Payruns/${id}`);
        return (payrunData.PayRuns && payrunData.PayRuns.length > 0) ? payrunData.PayRuns[0] : null;
    }

    public async getPayslip(id: string) {
        return this.get(`${API_HOSTNAME}/payroll.xro/1.0/Payslip/${id}`);
    }

    public async get(query: string) {
        try {
            const response = await this.httpClient.get(
                query,
                HttpClient.configurations.v1,
                {
                    headers: this.getCurrentHeaders()
                }
            );
            if (!response.ok) {
                return;
            }
            const me = await response.json();
            return me;
        } catch (error) {
            return;
        }
    }

    public async post(query: string, body: string) {
        try {
            const response = await this.httpClient.get(
                query,
                HttpClient.configurations.v1,
                {
                    headers: this.getCurrentHeaders(),
                    body: body
                }
            );
            if (!response.ok) {
                return;
            }
            const me = await response.json();
            return me;
        } catch (error) {
            return;
        }
    }

    public async patch(query: string, body: string) {
        try {
            const response = await this.httpClient.get(
                query,
                HttpClient.configurations.v1,
                {
                    headers: this.getCurrentHeaders(),
                    body: body
                }
            );
            if (!response.ok) {
                return;
            }
            const me = await response.json();
            return me;
        } catch (error) {
            return;
        }
    }

    protected getCurrentHeaders() {
        const headers = {};
        if (this.accessToken) headers["Authorization"] = `Bearer ${this.accessToken}`; 
        if (this.xeroTenantId) headers["Xero-tenant-id"] = `${this.xeroTenantId}`;
        headers["Accept"] = `application/json`;
        return headers;
    }
}