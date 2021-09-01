import * as React from "react";
import styles from "./ServiceNowTableHelper.module.scss";
import { ConnectWidgetSize } from "@valo/extensibility/lib/models/connectWidget/ConnectWidgetInfo";
import { Button, ShorthandValue, BoxProps, MenuButton, MoreIcon, Image, ClipboardCopiedToIcon } from "@fluentui/react-northstar";
import * as moment from "moment";
import * as strings from "ConnectMeServiceNowApplicationCustomizerStrings";
import { IServiceNowTask } from "../../../services/ServiceNowService";

export class ServiceNowTableHelper {

    public static shouldAddDetailsColumns = (widgetSize: ConnectWidgetSize) => {
		return widgetSize === ConnectWidgetSize.Double || widgetSize === ConnectWidgetSize.Triple || widgetSize === ConnectWidgetSize.Box;
	}

    public static copyToClipboard(data: string): void {
        const textarea = document.createElement('textarea');
		textarea.style.position = 'fixed';
		textarea.style.top = '0';
		// textarea.style.visibility = 'hidden';
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
				content: strings.IncidentNumber,
				key: "IncidentNumber",
                className: `${styles.numberColumn}`,
			},
		];
		if (ServiceNowTableHelper.shouldAddDetailsColumns(widgetSize)) {
			result.push({
				key: `ShortDescription`,
				className: styles.shortDescriptionColumn,
				content: strings.IncidentSummary
			});
		}
        result.push({
            content: strings.LastUpdate,
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

	public static getTaskRow = (task: IServiceNowTask, teamsjs: any, serviceNowInstance: string, widgetSize: ConnectWidgetSize) => {
		let taskRow: {
            key: string,
            className: string,
            content: ShorthandValue<BoxProps>
        }[] = [
			{
				key: `${task.sys_id}-0`,
				content: task.number,
				className: `${styles.numberColumn}`,
			},
		];
		if (ServiceNowTableHelper.shouldAddDetailsColumns(widgetSize)) {
			taskRow.push({
				key: `${task.sys_id}-1`,
				className: styles.shortDescriptionColumn,
				content: task.short_description
			});
		}
        taskRow.push({
            key: `${task.sys_id}-2`,
            className: styles.lastUpdateColumn,
            content: moment(task.sys_updated_on).format("lll")
        });
        taskRow.push({
			key: `${task.sys_id}-3`,
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
						icon: <Image src={require('./assets/snow-logo.png')} width={24} height={24}/>,
						content: strings.OpenInServiceNow,
						onClick: () => { teamsjs.executeDeepLink(`https://${serviceNowInstance}.service-now.com/nav_to.do?uri=incident.do?sys_id=${task.sys_id}`); }
                	},
					{
						icon: <ClipboardCopiedToIcon outline />,
						content: strings.CopyIncidentNumberToClipboard,
						onClick: () => { ServiceNowTableHelper.copyToClipboard(task.number); }
                	},
				]}
                positionFixed={true}
                on="click"
            />),
		});
		return taskRow;
	}

}
