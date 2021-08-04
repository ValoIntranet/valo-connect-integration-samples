import * as React from 'react';
import { ConnectWidgetSize } from '@valo/extensibility/lib/models/connectWidget';

import { IConnectMeXeroConfig } from '../IConnectMeXeroConfig';
import styles from './ConnectMeXeroConfiguration.module.scss';

import { RendererContext, Provider, teamsTheme, Input, InputProps } from '@fluentui/react-northstar';
import { createEmotionRenderer } from '@fluentui/react-northstar-emotion-renderer';
import { SelectSizeDropDown } from './SelectSizeDropDown';
import { Label } from '@fluentui/react-northstar/dist/es/components/Label/Label';

import * as strings from 'ConnectMeXeroApplicationCustomizerStrings';

export function ConnectMeXeroConfiguration(props: {
	config: IConnectMeXeroConfig;
	onConfigurationUpdated: (config: IConnectMeXeroConfig) => void;
}) {

	let initialConfig: IConnectMeXeroConfig = props.config || {
		size: ConnectWidgetSize.Double,
	} as IConnectMeXeroConfig;

    const [widgetSize, setWidgetSize] = React.useState(initialConfig.size);
    const [authenticationUrl, setAuthenticationUrl] = React.useState<string>(initialConfig.authenticationUrl);
    const [xeroClientId, setXeroClientId] = React.useState<string>(initialConfig.xeroClientId);

    React.useEffect(() => {
        const newConfig = { 
            ...props.config,
            size: widgetSize,
            authenticationUrl: authenticationUrl,
            xeroClientId: xeroClientId
        };
        props.onConfigurationUpdated(newConfig);
    }, [ widgetSize, authenticationUrl, xeroClientId ]);
    
    return (<div className={styles.xeroConfiguration}>

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


                <Label className={styles.configPanelFieldLabel}>{strings.XeroClientId}</Label>
                <Input 
                    className={styles.configPanelInputField}
                    value={xeroClientId} 
                    onChange={(event: React.SyntheticEvent<HTMLElement, Event>, data?: InputProps & { value: string; }) => {
                        setXeroClientId(data.value);
                    }} />


            </Provider>

        </RendererContext.Provider>

    </div>);


}
