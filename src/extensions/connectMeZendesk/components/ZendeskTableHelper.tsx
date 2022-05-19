import * as React from "react";
import styles from "./ZendeskTableHelper.module.scss";
import { ConnectWidgetSize } from "@valo/extensibility/lib/models/connectWidget/ConnectWidgetInfo";
import { Button, ShorthandValue, BoxProps, MenuButton, MoreIcon, Image, ClipboardCopiedToIcon } from "@fluentui/react-northstar";
import * as moment from "moment";
import * as strings from "ConnectMeZendeskApplicationCustomizerStrings";
import { ITicket } from "./IZendeskTicketsResponse";

export class ZendeskTableHelper {

    public static shouldAddDetailsColumns = (widgetSize: ConnectWidgetSize) => {
		return widgetSize === ConnectWidgetSize.Double || widgetSize === ConnectWidgetSize.Triple || widgetSize === ConnectWidgetSize.Box;
	}

    public static copyToClipboard(data: string): void {
        const textarea = document.createElement('textarea');
		textarea.style.position = 'fixed';
		textarea.style.top = '0';
        textarea.textContent = `${data}`;
        document.body.appendChild(textarea);

        textarea.focus();
        textarea.select();

        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
	
	public static getHeaderColumns = (widgetSize: ConnectWidgetSize) => {
		let result: {
			className?: string;
			content: any;
			key: string;
			"aria-label"?: string;
		}[] = [
			{
				content: strings.TicketNumber,
				key: "TicketNumber",
                className: `${styles.numberColumn}`,
			},
		];
		if (ZendeskTableHelper.shouldAddDetailsColumns(widgetSize)) {
			result.push({
				key: `ShortDescription`,
				className: styles.shortDescriptionColumn,
				content: strings.TicketSubject
			});
		}
        result.push({
            content: strings.LastUpdated,
            className: styles.lastUpdateColumn,
            key: "LastUpdate",
        });
        result.push({
			className: `${styles.optionsColumn}`,
			content: "",
			key: "options",
			"aria-label": strings.Options,
		});
		return result;
	}

	public static getTicketRow = (ticket: ITicket, teamsjs: any, instance: string, widgetSize: ConnectWidgetSize) => {
		let taskRow: {
            key: string,
            className: string,
            content: ShorthandValue<BoxProps>
        }[] = [
			{
				key: `${ticket.id}-0`,
				content: `#${ticket.id}`,
				className: `${styles.numberColumn}`,
			},
		];
		if (ZendeskTableHelper.shouldAddDetailsColumns(widgetSize)) {
			taskRow.push({
				key: `${ticket.id}-1`,
				className: styles.shortDescriptionColumn,
				content: ticket.subject
			});
		}
        taskRow.push({
            key: `${ticket.id}-2`,
            className: styles.lastUpdateColumn,
            content: moment(ticket.updated_at).format("lll")
        });
        taskRow.push({
			key: `${ticket.id}-3`,
			className: `${styles.optionsColumn}`,
			content: (<MenuButton
                trigger={
                    <Button
                        className={styles.uiButton}
                        icon={<MoreIcon size="medium" />}
                        circular
                        text
                        iconOnly
                        title={strings.Options}
                    />
                }
                menu={[
					{
						icon: <Image src={require('./assets/zendeskLogo.svg')} width={24} height={24}/>,
						content: strings.OpenTicket,
						onClick: () => { teamsjs.executeDeepLink(`https://${instance}.zendesk.com/agent/tickets/${ticket.id}`); }
                	},
					{
						icon: <ClipboardCopiedToIcon outline />,
						content: strings.CopyTicketNumberToClipboard,
						onClick: () => ZendeskTableHelper.copyToClipboard(`${ticket.id}`)
                	},
				]}
                positionFixed={true}
                on="click"
            />),
		});
		return taskRow;
	}

}
