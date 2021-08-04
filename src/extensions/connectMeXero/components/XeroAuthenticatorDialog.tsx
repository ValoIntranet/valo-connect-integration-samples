import * as React from "react";
import { RendererContext, Provider, teamsTheme, Dialog } from '@fluentui/react-northstar';
import { createEmotionRenderer } from '@fluentui/react-northstar-emotion-renderer';

import styles from "./XeroAuthenticatorDialog.module.scss";

export interface IXeroAuthenticatorDialogProps {
    authenticationUrl: string;
    clientId: string;
    dialogOpen: boolean;
}

export function XeroAuthenticatorDialog(props: React.PropsWithChildren<IXeroAuthenticatorDialogProps>) {

    const [ dialogOpen, setDialogOpen ] = React.useState<boolean>(props.dialogOpen)

    const iframeSandbox = ['allow-forms', 'allow-modals', 'allow-popups', 'allow-popups-to-escape-sandbox', 'allow-pointer-lock', 'allow-scripts', 'allow-same-origin', 'allow-downloads'];
    const dialogContents = <iframe sandbox={iframeSandbox.join(' ')} src={`${props.authenticationUrl}?${props.clientId}`} className={styles.iframe} />

    return (<div className={styles.xeroAuthenticatorDialogContainer}>
                <RendererContext.Provider value={createEmotionRenderer()}>

                    <Provider theme={teamsTheme}>

                        <Dialog
                            onCancel={() => { setDialogOpen(false); }}
                            cancelButton={null}
                            confirmButton={null}
                            content={dialogContents}
                            header={null}
                            open={dialogOpen} />

                    </Provider>

                </RendererContext.Provider>
            </div>);

}
