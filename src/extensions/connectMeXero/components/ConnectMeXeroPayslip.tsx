import * as React from "react";
import { ConnectMeXeroLineItem } from "./ConnectMeXeroLineItem";
import styles from "./ConnectMeXeroPayslip.module.scss";

export function ConnectMeXeroPayslip(props: React.PropsWithChildren<{ payslip: any, blur: boolean } >) {

    return (<div className={`${styles.xeroPayslip} ${props.blur ? styles.blur : ''}`}>
        <div className={`${styles.xeroPayslipInformation} ${styles.xeroPayslipSection}`}>
            <ConnectMeXeroLineItem label={'From'} value={props.payslip.ProviderName} />
            <ConnectMeXeroLineItem label={'Payslip for'} value={`${props.payslip.Payslip.FirstName} ${props.payslip.Payslip.LastName}`} />
            <ConnectMeXeroLineItem label={'Date'} value={`${props.payslip.DateTimeUTC}`} />
        </div>
        <div className={`${styles.xeroEarningsDeductions} ${styles.xeroPayslipSection}`}>
            { props.payslip.Payslip.EarningsLines.map(line => {
                return <ConnectMeXeroLineItem label={'Earning'} description={`Rate: ${line.RatePerUnit}`} value={line.NumberOfUnits} />;
            })}
            { props.payslip.Payslip.DeductionLines.map(line => {
                return <ConnectMeXeroLineItem label={'Deduction'} description={line.CalculationType} value={line.Amount} valueFormat={'currency'} />;
            })}
            { props.payslip.Payslip.LeaveEarningsLines.map(line => {
                return <ConnectMeXeroLineItem label={'Leave earning'} description={`Rate: ${line.RatePerUnit}`} value={line.NumberOfUnits} valueFormat={'currency'} />;
            })}
        </div>
        <div className={`${styles.xeroLeaveAccruals} ${styles.xeroPayslipSection}`}>
            { props.payslip.Payslip.LeaveAccrualLines.map(line => {
                return <ConnectMeXeroLineItem label={'Leave accural'} description={``} value={line.NumberOfUnits} />;
            })}
        </div>
        <div className={`${styles.xeroSuperannuation} ${styles.xeroPayslipSection}`}>
            { props.payslip.Payslip.SuperannuationLines.map(line => {
                return <ConnectMeXeroLineItem label={'Superannuation'} description={line.Percentage && `Calculated: ${line.Percentage}%`} value={line.Amount} valueFormat={'currency'} />;
            })}
        </div>
        <div className={`${styles.xeroTaxation} ${styles.xeroPayslipSection}`}>
            { props.payslip.Payslip.TaxLines.map(line => {
                return <ConnectMeXeroLineItem label={'Taxation'} description={line.TaxTypeName} value={line.Amount} valueFormat={'currency'} />;
            })}
        </div>
    </div>);

}
