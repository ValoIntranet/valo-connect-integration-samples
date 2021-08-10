export default () => { 
    return {
        ProviderName: 'Valo Solutions Pty. Ltd.',
        DateTimeUTC: '/Date(1628209049261)/',
        Payslip: {
            "FirstName": "Vito",
            "LastName": "Cline",
            "Tax": 178.00,
            "NetPay": 1296.25,
            "EarningsLines": [
                {
                    "EarningsRateID": "0c648aba-6bd8-44d6-ba9d-4e91e3f9daad",
                    "RatePerUnit": 20.187500,
                    "NumberOfUnits": 76.0000
                }
            ],
            "DeductionLines": [
                {
                    "Amount": 10.00,
                    "CalculationType": "FIXEDAMOUNT",
                    "DeductionTypeID": "0a157a97-d3c5-4b89-a4e8-2b414ea9d452"
                }
            ],
            "LeaveEarningsLines": [],
            "TimesheetEarningsLines": [],
            "LeaveAccrualLines": [
                {
                    "LeaveTypeID": "20820771-cfb5-45c3-a617-8ed8897c3ef9",
                    "NumberOfUnits": 5.8301,
                    "AutoCalculate": true
                },
                {
                    "LeaveTypeID": "9c0e0dda-070d-4ba7-926a-6b3a989ebf77",
                    "NumberOfUnits": 2.9151,
                    "AutoCalculate": true
                }
            ],
            "ReimbursementLines": [],
            "SuperannuationLines": [
                {
                    "ContributionType": "SGC",
                    "CalculationType": "PERCENTAGEOFEARNINGS",
                    "MinimumMonthlyEarnings": 450.0000,
                    "ExpenseAccountCode": "478",
                    "LiabilityAccountCode": "826",
                    "PaymentDateForThisPeriod": "/Date(1638057600000+0000)/",
                    "Percentage": 9.0000,
                    "Amount": 138.0800
                },
                {
                    "ContributionType": "SALARYSACRIFICE",
                    "CalculationType": "FIXEDAMOUNT",
                    "ExpenseAccountCode": "478",
                    "LiabilityAccountCode": "826",
                    "PaymentDateForThisPeriod": "/Date(1638057600000+0000)/",
                    "Amount": 50.0000
                }
            ],
            "TaxLines": [
                {
                    "TaxTypeName": "PAYG",
                    "Description": "With tax-free threshold, no leave loading",
                    "Amount": 178.00
                },
                {
                    "TaxTypeName": "HELP Component",
                    "Amount": 0.00
                }
            ]
        }

    }
}
