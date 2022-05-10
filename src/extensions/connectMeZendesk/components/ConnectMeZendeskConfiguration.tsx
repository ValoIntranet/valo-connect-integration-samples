import * as React from 'react';
import { IConnectMeZendeskConfig } from "../IConnectMeZendeskConfig";
import { ConnectWidgetSize } from '@valo/extensibility/lib/models/connectWidget';
import { Input, InputProps, Label, Provider, RendererContext, teamsTheme } from '@fluentui/react-northstar';
import { createEmotionRenderer } from '@fluentui/react-northstar-emotion-renderer';
import { SelectSizeDropDown } from '../../../components/SelectSizeDropDown';

import * as strings from 'ConnectMeZendeskApplicationCustomizerStrings';
import styles from './ConnectMeZendeskConfiguration.module.scss';

interface IConnectMeZendeskConfigurationProps {
    config: IConnectMeZendeskConfig;
	onConfigurationUpdated: (config: IConnectMeZendeskConfig) => void;
}

export function ConnectMeZendeskConfiguration(props: React.PropsWithChildren<IConnectMeZendeskConfigurationProps>) {
    let initialConfig: IConnectMeZendeskConfig = props.config || {
		size: ConnectWidgetSize.Double,
	} as IConnectMeZendeskConfig;

    const [widgetSize, setWidgetSize] = React.useState(initialConfig.size);
    const [authenticationUrl, setAuthenticationUrl] = React.useState<string>(initialConfig.authenticationUrl);
    const [clientId, setClientId] = React.useState<string>(initialConfig.zendeskClientId);
    const [instance, setInstance] = React.useState<string>(initialConfig.zendeskInstance);

    React.useEffect(() => {
        const newConfig = { 
            ...props.config,
            size: widgetSize,
            authenticationUrl: authenticationUrl,
            zendeskClientId: clientId,
            zendeskInstance: instance
        };
        
        props.onConfigurationUpdated(newConfig);
    }, [ widgetSize, authenticationUrl, clientId, instance ]);
    
    return (
        <div className={styles.zendeskConfiguration}>
            <RendererContext.Provider value={createEmotionRenderer()}>
                <Provider theme={teamsTheme}>
                    <Label className={styles.configPanelFieldLabel}>{strings.AuthenticationUrl}</Label>
                    <Input 
                        className={styles.configPanelInputField}
                        value={authenticationUrl}
                        fluid
                        onChange={(event: React.SyntheticEvent<HTMLElement, Event>, data?: InputProps & { value: string; }) => {
                            setAuthenticationUrl(data.value);
                        }} />

                    <Label className={styles.configPanelFieldLabel}>{strings.ZendeskInstance}</Label>
                    <Input 
                        className={styles.configPanelInputField}
                        value={instance}
                        fluid
                        onChange={(event: React.SyntheticEvent<HTMLElement, Event>, data?: InputProps & { value: string; }) => {
                            setInstance(data.value);
                        }} />

                    <Label className={styles.configPanelFieldLabel}>{strings.ZendeskClientId}</Label>
                    <Input 
                        className={styles.configPanelInputField}
                        value={clientId}
                        fluid
                        onChange={(event: React.SyntheticEvent<HTMLElement, Event>, data?: InputProps & { value: string; }) => {
                            setClientId(data.value);
                        }} />
                </Provider>
            </RendererContext.Provider>
        </div>
    );
}