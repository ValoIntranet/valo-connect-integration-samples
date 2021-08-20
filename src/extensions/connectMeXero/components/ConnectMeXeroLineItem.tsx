import { Flex, Text } from "@fluentui/react-northstar";
import * as React from "react";
import styles from "./ConnectMeXeroLineItem.module.scss";

export function ConnectMeXeroLineItem(props: React.PropsWithChildren<{label: string, value: string | number, valueFormat?: 'currency' | 'decimal', description?: string }>) {

    const language = (window.navigator.languages ? window.navigator.languages[0] : (window.navigator as any).userLanguage || window.navigator.language);

    if (typeof props.value === 'string' && props.value.indexOf('/Date(') > -1 ) {
        const numericTimeValue: number = parseInt(props.value.match(/\/Date\((\d*)\)/i)[1]);
        props.value = Intl.DateTimeFormat(language).format(numericTimeValue);
    }

    if (props.valueFormat && typeof props.value === 'number') {
        switch (props.valueFormat) {
            case 'currency': 
                props.value = Intl.NumberFormat(language, { style: 'currency', currency: 'USD' }).format(props.value); break;
        }
    }

    return <div className={styles.xeroLineItem}>
        <Flex space='between'>
            <Text content={props.label} />
            {props.description && props.description.length > 0 && <Text content={props.description} />}
            <Text content={props.value} />
        </Flex>
    </div>;

}
