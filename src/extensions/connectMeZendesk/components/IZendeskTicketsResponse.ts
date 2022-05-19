export interface IZendeskTicketsResponse {
    tickets: ITicket[];
}

export interface ITicket {
    "assignee_id": number;
    "collaborator_ids": number[];
    "created_at": string;
    "custom_fields": {id: string; value: string}[];
    "description": string;
    "due_at": string | null;
    "external_id": string;
    "follower_ids": number[];
    "group_id": number;
    "has_incidents": boolean;
    "id": number;
    "organization_id": number;
    "priority": string;
    "problem_id": number;
    "raw_subject": string;
    "recipient": string;
    "requester_id": number;
    "satisfaction_rating": {
      "comment": string;
      "id": number;
      "score": string;
    };
    "sharing_agreement_ids": number[];
    "status": string;
    "subject": string;
    "submitter_id": number;
    "tags": string[];
    "type": string;
    "updated_at": string;
    "url": string;
    "via": {
      "channel": string;
    };
}