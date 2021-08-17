import { Button, Flex, Image, Input, Loader, Provider, RendererContext, teamsTheme } from "@fluentui/react-northstar";
import { createEmotionRenderer } from "@fluentui/react-northstar-emotion-renderer";
import * as strings from "ConnectMeServiceNowApplicationCustomizerStrings";
import * as React from "react";
import styles from "./ConnectMeServiceNow.module.scss";

import { IConnectMeServiceNowProps } from './IConnectMeServiceNowProps';
import { ServiceNowAuthenticator } from "../../../services/ServiceNowAuthenticator";
import { IServiceNowTask, ServiceNowService } from "../../../services/ServiceNowService";

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
        const accessToken = await authenticator.getAccessToken();
        setAccessToken(accessToken);
        checkAccessToken();
    }

    const viewSLATasks = async () => {
        await getSLATasks();
    }

    const getSLATasks = async () => {
        if (accessToken) {
            
            setServiceNowLoading(true);
            
            try {

                const serviceNowService = new ServiceNowService(props.httpClient, props.widgetConfig.serviceNowInstance, accessToken);

                const tasksSLA = await serviceNowService.getTaskSLAs(true, true);
                const obtainedTasks = tasksSLA.length > 0 ? await serviceNowService.getTasks(tasksSLA.map(taskSLA => { return taskSLA.task.value })) : [];

                setTasks(obtainedTasks);

            }
            catch (err) {

            }

            setServiceNowLoading(false);
            
        }
    }

    const checkAccessToken = async () => {

        if (authenticator) {

            const accessToken = authenticator.currentAccessToken();
            if (accessToken) {
                setShowSignInContainer(false);
                setAccessToken(accessToken.accessToken);
            }
            else {
                setShowSignInContainer(true);
            }

        }

    }

    React.useEffect(() => {
        checkAccessToken();
    }, [ authenticator ]);

    React.useEffect(() => {
        if (accessToken) {
            setShowRefreshServiceNowContainer(true);
        }
    }, [ accessToken ]);

    React.useEffect(() => {
        if (tasks.length > 0) {
            setShowRefreshServiceNowContainer(false);
        }
    }, [ tasks ]);

    const serviceNowLogo: string = require('./assets/snow-logo.png');

    return (<div className={`${styles.serviceNow}`} ref={containerRef}>

        <RendererContext.Provider value={createEmotionRenderer()}>

            {tasks.length > 0 && <div>{tasks.map(task => { return <div><a href={task.sys_id}>{task.number} -  {task.sys_updated_by}</a></div>} )}</div>}
            
            <Provider theme={teamsTheme}>

                {showSignInContainer && <Flex className={styles.signInContainer} hAlign='center' column>
                        <div className={styles.signInMessage}>{strings.SignInToViewYourPayslip}</div>
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

                {showRefreshServiceNowContainer && <Flex className={styles.refreshServiceNowContainer} hAlign='center' column>
                        <span className={styles.refreshButton}>
                            <Button content={strings.ViewYourPayslip} 
                                size='medium'
                                onClick={viewSLATasks} 
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
