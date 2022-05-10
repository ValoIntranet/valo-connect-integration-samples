import * as React from 'react';
import * as teamsjs from "@microsoft/teams-js";
import { Button, Flex, Loader, Provider, RendererContext, teamsTheme, Image, Table } from '@fluentui/react-northstar';
import { createEmotionRenderer } from '@fluentui/react-northstar-emotion-renderer';
import { IConnectMeZendeskProps } from './IConnectMeZendeskProps';
import { ITicket } from './IZendeskTicketsResponse';

import * as strings from "ConnectMeZendeskApplicationCustomizerStrings";
import styles from "./ConnectMeZendesk.module.scss";
import { ZendeskTableHelper } from './ZendeskTableHelper';

export const ConnectMeZendesk = React.forwardRef((props: React.PropsWithChildren<IConnectMeZendeskProps>, ref) => {
    const [ zendeskLoading, setZendeskLoading ] = React.useState<boolean>(false);
    const [ showSignInContainer, setShowSignInContainer ] = React.useState<boolean>(true);
    const [ tickets, setTickets ] = React.useState<ITicket[]>([]);

    const getMyTickets = async () => {
        setZendeskLoading(true);
        try {
            const zendeskTickets = await props.zendeskService.getTickets();
            setTickets(zendeskTickets.tickets);
        }
        catch (err) {
            setShowSignInContainer(true);
        }

        setZendeskLoading(false);
    };

    const authenticate = async () => {
        try {
            await props.authenticator.authenticate();
            setShowSignInContainer(false);
            await getMyTickets();
        }
        catch {
            setShowSignInContainer(true);
        }
    };

    React.useEffect(() => {
        teamsjs.initialize();
    }, []);

    React.useEffect(() => {
        if(props.authenticator.isAuthenticated()) {
            setShowSignInContainer(false);
            getMyTickets();
        } else {
            setShowSignInContainer(true);
        }
    }, [ props.authenticator ]);

    React.useEffect(() => {
        if(showSignInContainer) {
            document.documentElement.style.setProperty("--ZendeskActionsDisplay", "none");
        } else {
            document.documentElement.style.setProperty("--ZendeskActionsDisplay", "block");
        }
    }, [ showSignInContainer ]);

    React.useImperativeHandle(ref, () => ({
        refresh() {
            getMyTickets();
        },
        async signOut() {
            try {
                await props.authenticator.revokeAccessToken();
            } catch (error) {}
            setShowSignInContainer(true);
        }
    }));

    function renderAuthentication() {
        return (
            <Flex className={styles.signInContainer} hAlign='center' column>
                <span className={styles.signInButton}>
                    <Button title={strings.SignInToZendesk} 
                        content={strings.SignInToZendesk}
                        size='medium'
                        onClick={authenticate}
                        disabled={!props.widgetConfig.authenticationUrl || !props.widgetConfig.zendeskInstance || !props.widgetConfig.zendeskClientId}
                        icon={zendeskLoading ? 
                            <Loader size='small'/>
                            : <Image 
                                src={require('./assets/zendesk.svg')} 
                                width={'70'} height={'24'} />} />
                </span>
            </Flex>
        );
    }

    function renderTickets() {
        return (
            <>
                <Image 
                src={require('./assets/zendesk.svg')} 
                width={'70'} height={'24'} />
                {zendeskLoading && <Loader size="medium" />}
                {(tickets.length > 0) && 
                    <Table 
                        header={ZendeskTableHelper.getHeaderColumns(props.widgetConfig.size)}
                        rows={tickets.map(ticket => ZendeskTableHelper.getTicketRow(ticket, teamsjs, props.widgetConfig.zendeskInstance, props.widgetConfig.size))} /> }
            </>
        );
        
    }

    return (
        <div className={`${styles.zendesk}`}>
            <RendererContext.Provider value={createEmotionRenderer()}>
                <Provider theme={teamsTheme}>
                    {showSignInContainer && (renderAuthentication())}
                    {!showSignInContainer && (renderTickets())}
                </Provider>
            </RendererContext.Provider>
        </div>
    );
});