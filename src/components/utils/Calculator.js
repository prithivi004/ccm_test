export const CurrencyConvertor = (currency, chart_list, currency_list) => {

    let client_total = 0
    let client_received = 0
    let client_remaining = 0
    let cont_total = 0
    let cont_paid = 0
    let cont_remaining = 0
    let margin = 0

    chart_list.map(data => {
        // console.log(data,"data")
        if (data.currency === currency) {
            client_total += parseFloat(data.total_client_issue_amount)
            client_received += parseFloat(data.total_client_received_amount)
            cont_total += parseFloat(data.total_cont_issue_amount)
            cont_paid += parseFloat(data.total_cont_received_amount)
            margin += parseFloat(data.total_margin_amount)
        } else {
            // console.log(currency_list[currency],"curreency")
            client_total += parseFloat(data.total_client_issue_amount * (currency_list[currency] / currency_list[data.currency]))
            client_received += parseFloat(data.total_client_received_amount * (currency_list[currency] / currency_list[data.currency]))
            cont_total += parseFloat(data.total_cont_issue_amount * (currency_list[currency] / currency_list[data.currency]))
            cont_paid += parseFloat(data.total_cont_received_amount * (currency_list[currency] / currency_list[data.currency]))
            margin += parseFloat(data.total_margin_amount * (currency_list[currency] / currency_list[data.currency]))
        }
    })

    // marginlist !== undefined &&  marginlist.map(mar => {
    //     marginamt +=  parseFloat(mar.margin * (currency_list[currency] / currency_list[mar.currency]))
    // })

    client_remaining = client_total - client_received
    cont_remaining = cont_total - cont_paid

    // const margin = client_received - cont_paid
    // console.log(chart_list, client_total,client_received,client_remaining,cont_total,cont_paid,cont_remaining,'chart_list')
    return {
        client: [parseFloat(client_total).toFixed(2), parseFloat(client_received).toFixed(2), parseFloat(client_remaining).toFixed(2)],
        cont: [parseFloat(cont_total).toFixed(2), parseFloat(cont_paid).toFixed(2), parseFloat(cont_remaining).toFixed(2)],
        margin:parseFloat(margin).toFixed(2)
    }
}
export const AgedDataCalculator = (currency, chart_list, currency_list)=>{
    let payables = 0;
    let receivables = 0

    chart_list.map(data => {
        if (data.currency === currency) {
            payables += parseFloat(data.payables)
            receivables += parseFloat(data.receivables)
        } else {
            payables += parseFloat(data.payables * (currency_list[currency] / currency_list[data.currency]))
            receivables += parseFloat(data.receivables * (currency_list[currency] / currency_list[data.currency]))
        }
    })
    return [parseFloat(receivables).toFixed(2),parseFloat(payables).toFixed(2),]
}