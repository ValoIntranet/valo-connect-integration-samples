import { Button, Flex, Image, Input, Loader, Provider, RendererContext, teamsTheme } from "@fluentui/react-northstar";
import { createEmotionRenderer } from "@fluentui/react-northstar-emotion-renderer";
import * as strings from "ConnectMeXeroApplicationCustomizerStrings";
import * as React from "react";
import styles from "./ConnectMeXero.module.scss";
import { ConnectMeXeroPayslip } from "./ConnectMeXeroPayslip";
import dummyPayslip from "./DummyPayslip";

import { IConnectMeXeroProps } from './IConnectMeXeroProps';
import { XeroAuthenticator } from "../../../services/XeroAuthenticator";
import { XeroService } from "../../../services/XeroService";

export function ConnectMeXero(props: React.PropsWithChildren<IConnectMeXeroProps>) {

    const containerRef = React.useRef<HTMLDivElement>();
    const [ authenticator, setAuthenticator] = React.useState<XeroAuthenticator>();
    const [ accessToken, setAccessToken ] = React.useState<string>();
    const [ showSignInContainer, setShowSignInContainer ] = React.useState<boolean>(false);
    const [ showRefreshXeroContainer, setShowRefreshXeroContainer ] = React.useState<boolean>(false);
    const [ tenantId, setTenantId ] = React.useState<string>();
    const [ payrunId, setPayrunId ] = React.useState<string>();
    const [ payslipId, setPayslipId ] = React.useState<string>();
    const [ payslip, setPayslip ] = React.useState<any>();
    const [ blurPayslip, setBlurPayslip ] = React.useState<boolean>(true);
    const [ xeroLoading, setXeroLoading ] = React.useState<boolean>(false);

    React.useEffect(() => {

        if (containerRef.current) {
            setAuthenticator(new XeroAuthenticator(
                props.widgetConfig && props.widgetConfig.authenticationUrl, 
                props.widgetConfig && props.widgetConfig.xeroClientId, 
                props.httpClient));
        }

    }, []);

    const authenticate = async () => {
        const accessToken = await authenticator.getAccessToken();
        setAccessToken(accessToken);
        checkAccessToken();
    }

    const viewPayslip = async () => {
        await getLatestPayslip();
    }

    const getLatestPayslip = async () => {
        if (accessToken) {
            
            setXeroLoading(true);
            
            try {

                const xeroService = new XeroService(props.httpClient, accessToken);
                let runTenantId = tenantId;
                let runPayrunId = payrunId;
                let runPayslipId = payslipId;

                const tenants = await xeroService.getTenants();
                if (tenants && Array.isArray(tenants) && tenants.length > 0) {
                    setTenantId(tenants[0].tenantId);
                    runTenantId = tenants[0].tenantId;
                    xeroService.setXeroTenantId(runTenantId);
                }

                if (runTenantId) {
                    const payruns = await xeroService.getPayruns();
                    if (payruns && Array.isArray(payruns) && payruns.length > 0) {
                        setPayrunId(payruns[0].PayRunID);
                        runPayrunId = payruns[0].PayRunID;
                    }
                }

                if (runPayrunId) {
                    const payrun = await xeroService.getPayrun(runPayrunId);
                    if (payrun && Array.isArray(payrun.Payslips) && payrun.Payslips.length > 0) {
                        setPayslipId(payrun.Payslips[0].PayslipID);
                        runPayslipId = payrun.Payslips[0].PayslipID;
                    }
                }

                if (runPayslipId) {
                    const obtainedPayslip = await xeroService.getPayslip(runPayslipId);
                    if (obtainedPayslip) {
                        setPayslip(obtainedPayslip);
                    }
                }

            }
            catch (err) {

            }

            setXeroLoading(false);
            
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
            setShowRefreshXeroContainer(true);
        }
    }, [ accessToken ]);

    React.useEffect(() => {
        if (payslip) {
            setBlurPayslip(false);
            setShowRefreshXeroContainer(false);
        }
        else {
            setBlurPayslip(true);
        }
    }, [ payslip ]);

    // const payslipData = payslip || {};

    const xeroConnectButton: string = require('./assets/connect-blue.svg');
    const xeroLogo: string = require('./assets/xero-logo.png');

    return (<div className={`${styles.xero} ${blurPayslip ? '' : styles.payslipNotBlurred}`} ref={containerRef}>

        <RendererContext.Provider value={createEmotionRenderer()}>

            <Provider theme={teamsTheme}>

                {payslip && <ConnectMeXeroPayslip payslip={payslip} blur={blurPayslip} /> }

                {showSignInContainer && <Flex className={styles.signInContainer} hAlign='center' column>
                        <div className={styles.signInMessage}>{strings.SignInToViewYourPayslip}</div>
                        <span className={styles.signInButton}>
                            <Button title={strings.SignInToXero} 
                                size='medium'
                                onClick={authenticate} 
                                content={<Image 
                                        src={xeroConnectButton} 
                                        width={'190'} height={'43'} />} />
                        </span>
                    </Flex>}

                {showRefreshXeroContainer && <Flex className={styles.refreshXeroContainer} hAlign='center' column>
                        <span className={styles.refreshButton}>
                            <Button content={strings.ViewYourPayslip} 
                                size='medium'
                                onClick={viewPayslip} 
                                icon={xeroLoading ? 
                                        <Loader size='small'/>
                                        : <Image 
                                            src={xeroLogo} 
                                            width={'24'} height={'24'} />} />
                        </span>
                    </Flex>}
            </Provider>

        </RendererContext.Provider>

    </div>);

}
