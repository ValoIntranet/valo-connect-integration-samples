import { Button, Flex, Image, Input, Loader, Provider, RendererContext, Table, teamsTheme } from "@fluentui/react-northstar";
import { createEmotionRenderer } from "@fluentui/react-northstar-emotion-renderer";
import * as strings from "ConnectMeServiceNowApplicationCustomizerStrings";
import * as React from "react";
import styles from "./ConnectMeServiceNow.module.scss";

import { IConnectMeServiceNowProps } from './IConnectMeServiceNowProps';
import { ServiceNowAuthenticator } from "../../../services/ServiceNowAuthenticator";
import { IServiceNowTask, ServiceNowService } from "../../../services/ServiceNowService";
import { ServiceNowTableHelper } from "./ServiceNowTableHelper";

export function ConnectMeServiceNow(props: React.PropsWithChildren<IConnectMeServiceNowProps>) {

    const containerRef = React.useRef<HTMLDivElement>();
    const [ authenticator, setAuthenticator] = React.useState<ServiceNowAuthenticator>();
    const [ accessToken, setAccessToken ] = React.useState<string>();
    const [ showSignInContainer, setShowSignInContainer ] = React.useState<boolean>(false);
    const [ showRefreshServiceNowContainer, setShowRefreshServiceNowContainer ] = React.useState<boolean>(false);
    const [ tasks, setTasks ] = React.useState<IServiceNowTask[]>([]);
    const [ serviceNowLoading, setServiceNowLoading ] = React.useState<boolean>(false);

    React.useEffect(() => {

        if (containerRef.current) {
            setAuthenticator(new ServiceNowAuthenticator(
                props.widgetConfig && props.widgetConfig.authenticationUrl || "", 
                props.widgetConfig && props.widgetConfig.serviceNowInstance || "", 
                props.widgetConfig && props.widgetConfig.serviceNowClientId || "", 
                props.httpClient));
        }

    }, []);

    const authenticate = async () => {
        
        try {
            const accessToken = await authenticator.authenticatedAccessToken();
            if (accessToken) {
                setAccessToken(accessToken);
                await getSLATasks();
            }
        }
        catch {
            setShowSignInContainer(true);
        }
       
    }

    const refreshSLATasks = async () => {
        await getSLATasks();
    }

    const getSLATasks = async () => {

        if (!authenticator) {
            setShowSignInContainer(true);
            return;
        }

        let workingAccessToken = await authenticator.getAccessTokenSilently();

        if (!workingAccessToken) {
            setShowSignInContainer(true);
        }
        else {
            
            setAccessToken(workingAccessToken);
            setShowSignInContainer(false);
            setServiceNowLoading(true);
            
            try {

                const serviceNowService = new ServiceNowService(props.httpClient, props.widgetConfig.serviceNowInstance, workingAccessToken);

                const tasksSLA = await serviceNowService.getTaskSLAs(true, true);
                const obtainedTasks = tasksSLA.length > 0 ? await serviceNowService.getTasks(tasksSLA.map(taskSLA => { return taskSLA.task.value })) : [];

                setTasks(obtainedTasks);

            }
            catch (err) {
                setShowSignInContainer(true);

            }

            setServiceNowLoading(false);
            

        }
    }

    React.useEffect(() => {

        getSLATasks();

    }, [ authenticator ]);

    const serviceNowLogo: string = require('./assets/snow-logo.png');

    return (<div className={`${styles.serviceNow}`} ref={containerRef}>

        <RendererContext.Provider value={createEmotionRenderer()}>

            <Provider theme={teamsTheme}>

                {(tasks.length > 0) && 
                    <Table 
                        header={ServiceNowTableHelper.getHeaderColumns(props.widgetConfig.size)}
                        rows={tasks.map(task => ServiceNowTableHelper.getTaskRow(task, props.widgetConfig.size))} /> }
                
                {showSignInContainer && <Flex className={styles.signInContainer} hAlign='center' column>
                        <div className={styles.signInMessage}>{strings.SignInToServiceNow}</div>
                        <span className={styles.signInButton}>
                            <Button title={strings.SignInToServiceNow} 
                                size='medium'
                                onClick={authenticate} 
                                icon={serviceNowLoading ? 
                                    <Loader size='small'/>
                                    : <Image 
                                        src={serviceNowLogo} 
                                        width={'24'} height={'24'} />} />
                        </span>
                    </Flex>}

            </Provider>

        </RendererContext.Provider>

    </div>);

}
