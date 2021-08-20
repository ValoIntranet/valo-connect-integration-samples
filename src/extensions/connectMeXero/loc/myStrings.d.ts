declare interface IConnectMeXeroApplicationCustomizerStrings {
  ConnectMeXeroPayslipWidgetTitle: string;
  ConnectMeXeroPayslipWidgetDescription: string;
  WidgetSizeSingleColumn: string;
  WidgetSizeTwoColumns: string;
  WidgetSizeThreeColumns: string;
  ConnectWidgetSize: string;
  AuthenticationUrl: string;
  XeroClientId: string;
  SignInToViewYourPayslip: string;
  SignInToXero: string;
  ViewYourPayslip: string;
  RefreshPaylsip: string;
  SignOutFromXero: string;
  NoXeroConnectionsFound: string;
}

declare module 'ConnectMeXeroApplicationCustomizerStrings' {
  const strings: IConnectMeXeroApplicationCustomizerStrings;
  export = strings;
}
