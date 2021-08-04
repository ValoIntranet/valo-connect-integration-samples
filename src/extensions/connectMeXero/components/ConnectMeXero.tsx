import * as React from "react";
import styles from "./ConnectMeXero.module.scss";

import { IConnectMeXeroProps } from './IConnectMeXeroProps';
import { XeroAuthenticator } from "./XeroAuthenticator";

export function ConnectMeXero(props: React.PropsWithChildren<IConnectMeXeroProps>) {

    const containerRef = React.useRef<HTMLDivElement>();
    const [authenticator, setAuthenticator] = React.useState<XeroAuthenticator>();
    const [authenticatorCode, setAuthenticatorCode ] = React.useState<string>();

    React.useEffect(() => {

        if (containerRef.current) {
            setAuthenticator(new XeroAuthenticator(
                props.widgetConfig && props.widgetConfig.authenticationUrl, 
                props.widgetConfig && props.widgetConfig.xeroClientId, 
                containerRef.current));

        }

    }, []);

    const authenticate = async () => {
        const code = await authenticator.authenticate();
        setAuthenticatorCode(code);
    }

    React.useEffect(() => {
        authenticator && authenticate();
    }, [ authenticator ]);

    return (<div className={styles.xero} ref={containerRef}>
        {JSON.stringify(authenticatorCode)}
    </div>);

}
