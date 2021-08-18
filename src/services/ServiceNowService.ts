export interface IServiceNowTask {

    parent: string;
    made_sla: boolean;
    watch_list: string;
    upon_reject: string;
    sys_updated_on: string;
    task_effective_number: string;
    approval_history: string;
    number: string;
    sys_updated_by: string;
    opened_by: {
        link: string;
        value: string;
    },
    user_input: string;
    sys_created_on: string;
    sys_domain: {
        link: string;
        value: string;
    },
    state: number;
    route_reason: string;
    sys_created_by: string;
    knowledge: boolean;
    order: string;
    closed_at: string;
    cmdb_ci: {
        link: string;
        value: string;
    },
    delivery_plan: string;
    contract: string;
    impact: number;
    active: boolean;
    work_notes_list: string;
    business_service: string;
    priority: number;
    sys_domain_path: string;
    time_worked: string;
    expected_start: string;
    opened_at: string;
    business_duration: string;
    group_list: string;
    work_end: string;
    approval_set: string;
    work_notes: string;
    universal_request: string;
    short_description: string;
    correlation_display: string;
    delivery_task: string;
    work_start: string;
    assignment_group: string;
    additional_assignee_list: string;
    description: string;
    calendar_duration: string;
    close_notes: string;
    service_offering: string;
    sys_class_name: string;
    closed_by: string;
    follow_up: string;
    sys_id: string;
    contact_type: string;
    urgency: string;
    company: string;
    reassignment_count: number;
    activity_due: string;
    assigned_to: {
        link: string;
        value: string;
    },
    comments: string;
    approval: string;
    sla_due: string;
    comments_and_work_notes: string;
    due_date: string;
    sys_mod_count: number;
    sys_tags: string;
    escalation: number;
    upon_approval: string;
    correlation_id: string;
    location: string;
}

export interface IServiceNowTaskSLA {
    pause_duration: string;
    pause_time: string;
    timezone: string;
    sys_updated_on: string;
    business_time_left: string;
    duration: string;
    sys_id: string;
    time_left: string;
    sys_updated_by: string;
    sys_created_on: string;
    percentage: number;
    original_breach_time: string;
    sys_created_by: string;
    business_percentage: number;
    end_time: string;
    sys_mod_count: number;
    active: boolean;
    business_pause_duration: string;
    sla: {
        link: string;
        value: string;
    },
    sys_tags: string;
    schedule: string;
    start_time: string;
    business_duration: string;
    task: {
        link: string;
        value: string;
    },
    stage: string;
    planned_end_time: string;
    has_breached: string;
}

import { HttpClient, HttpClientResponse } from '@microsoft/sp-http';

const API_HOSTNAME: string = "https://{serviceNowInstanceId}.service-now.com/api";

export class ServiceNowService {

    private apiHostname = API_HOSTNAME;
    
    constructor(protected httpClient: HttpClient, protected serviceNowInstanceId: string, protected accessToken: string) {
        this.apiHostname = API_HOSTNAME.replace('{serviceNowInstanceId}', serviceNowInstanceId);
    }

    public async getTaskSLAs(onlyBreached: boolean, onlyActive: boolean): Promise<IServiceNowTaskSLA[]> {
        
        let query = `${onlyBreached && `has_breached=true`}`;
        onlyActive && (query += `${(query.length > 0) && '^'}active=true`);
        query += `${(query.length > 0) && '^'}ORDRERBYDESCstart_time`
        

        const tasks = await this.get(`${this.apiHostname}/now/table/task_sla${query.length > 0 && `?sysparm_query=${query}`}${query.length > 0 ? '&' : '?'}sysparm_fields=task,start_time`);
        return tasks.result ? tasks.result : [];

    }

    public async getTasks(tasks: string[] = []) {

        const queryClauses = tasks.map(task => { return `sys_id=${task}`});
        const tasksToReturn = await this.get(`${this.apiHostname}/now/table/task${queryClauses.length > 0 && `?sysparm_query=${queryClauses.join('^OR')}`}${queryClauses.length > 0 ? '&' : '?'}sysparm_fields=sys_id,sys_updated_on,number,sys_updated_by,short_description`);
        return tasksToReturn.result ? tasksToReturn.result : []

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
        const headers = {}
        if (this.accessToken) headers["Authorization"] = `Bearer ${this.accessToken}`; 
        headers["Accept"] = `application/json`;
        return headers;
    }
}