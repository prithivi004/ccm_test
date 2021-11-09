export const DateFilter = (invoice) => {
    let total = 0;
    let received = 0;

    invoice.map(inv => {
        total += parseInt(inv.invoice_amount)
        received += (parseInt(inv.price) - parseInt(inv.credit_amount))
    })
    let remaining = total - received
    const data = [total, received, remaining]
    return data

}