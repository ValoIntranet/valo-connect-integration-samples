import * as React from 'react';
import * as ReactDom from 'react-dom';
import { XeroAuthenticatorDialog } from './XeroAuthenticatorDialog';

export class XeroAuthenticator {

    private urlHostname: string;

    constructor(protected url: string, protected clientId: string, protected element?: HTMLElement) {
        this.urlHostname = this.url.substr(0, this.url.indexOf('/', 9));
    }

    public authenticate(): Promise<string> {

        return new Promise<string>((resolve, reject) => {

            const eventListener = (event: any) => {
                if (event.origin.startsWith(this.urlHostname)) {
                    window.removeEventListener('message', eventListener);
                    if (event.data) {
                        console.log('resolving authenticate()');
                        resolve(event.data);
                    }
                    else {
                        console.log('rejecting authenticate()');
                        reject();
                    }
                }
            };

            window.addEventListener('message', eventListener);
            console.log('event listener added');

            const dialogElement = React.createElement(XeroAuthenticatorDialog, {
                authenticationUrl: this.url,
                clientId: this.clientId,
                dialogOpen: true,
            });

            const containerDiv = document.createElement("div");
            containerDiv.id = `xero_${this.clientId}`;
            (this.element || document.body).appendChild(containerDiv);

            ReactDom.render(dialogElement, containerDiv);

            console.log('XeroAuthenticatorDialog rendered');


        });

    }

}
