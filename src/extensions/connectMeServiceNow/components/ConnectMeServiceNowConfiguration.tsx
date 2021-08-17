import * as React from 'react';
import { ConnectWidgetSize } from '@valo/extensibility/lib/models/connectWidget';

import { IConnectMeServiceNowConfig } from '../IConnectMeServiceNowConfig';
import styles from './ConnectMeServiceNowConfiguration.module.scss';

import { RendererContext, Provider, teamsTheme, Input, InputProps } from '@fluentui/react-northstar';
import { createEmotionRenderer } from '@fluentui/react-northstar-emotion-renderer';
import { SelectSizeDropDown } from '../../../components/SelectSizeDropDown';
import { Label } from '@fluentui/react-northstar/dist/es/components/Label/Label';

import * as strings from 'ConnectMeServiceNowApplicationCustomizerStrings';

export function ConnectMeServiceNowConfiguration(props: {
	config: IConnectMeServiceNowConfig;
	onConfigurationUpdated: (config: IConnectMeServiceNowConfig) => void;
}) {

	let initialConfig: IConnectMeServiceNowConfig = props.config || {
		size: ConnectWidgetSize.Double,
	} as IConnectMeServiceNowConfig;

    const [widgetSize, setWidgetSize] = React.useState(initialConfig.size);
    const [authenticationUrl, setAuthenticationUrl] = React.useState<string>(initialConfig.authenticationUrl);
    const [serviceNowClientId, setServiceNowClientId] = React.useState<string>(initialConfig.serviceNowClientId);
    const [serviceNowInstance, setServiceNowInstance] = React.useState<string>(initialConfig.serviceNowInstance);

    React.useEffect(() => {
        const newConfig = { 
            ...props.config,
            size: widgetSize,
            authenticationUrl: authenticationUrl,
            serviceNowClientId: serviceNowClientId,
            serviceNowInstance: serviceNowInstance
        };
        props.onConfigurationUpdated(newConfig);
    }, [ widgetSize, authenticationUrl, serviceNowClientId, serviceNowInstance ]);
    
    return (<div className={styles.serviceNowConfiguration}>

        <RendererContext.Provider value={createEmotionRenderer()}>

            <Provider theme={teamsTheme}>
        
                <SelectSizeDropDown 
                    initialSize={widgetSize} 
                    onSelectionChanged={size => setWidgetSize((size as ConnectWidgetSize))} />


                <Label className={styles.configPanelFieldLabel}>{strings.AuthenticationUrl}</Label>
                <Input 
                    className={styles.configPanelInputField}
                    value={authenticationUrl} 
                    onChange={(event: React.SyntheticEvent<HTMLElement, Event>, data?: InputProps & { value: string; }) => {
                        setAuthenticationUrl(data.value);
                    }} />


                <Label className={styles.configPanelFieldLabel}>{strings.ServiceNowInstance}</Label>
                <Input 
                    className={styles.configPanelInputField}
                    value={serviceNowInstance} 
                    onChange={(event: React.SyntheticEvent<HTMLElement, Event>, data?: InputProps & { value: string; }) => {
                        setServiceNowInstance(data.value);
                    }} />


                <Label className={styles.configPanelFieldLabel}>{strings.ServiceNowClientId}</Label>
                <Input 
                    className={styles.configPanelInputField}
                    value={serviceNowClientId} 
                    onChange={(event: React.SyntheticEvent<HTMLElement, Event>, data?: InputProps & { value: string; }) => {
                        setServiceNowClientId(data.value);
                    }} />


            </Provider>

        </RendererContext.Provider>

    </div>);


}
