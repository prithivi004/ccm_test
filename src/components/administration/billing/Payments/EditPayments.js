import React,{ useEffect,useState} from 'react'
import { Modal, Row, Form, Col, Card, ModalTitle } from 'react-bootstrap'
import axiosInstance from '../../../utils/axiosinstance'
import CurrencyFormat from 'react-currency-format'
import { DateFormat } from '../../../utils/DateFormat'
import { Alert } from '../../../utils/Utilities'
import { data } from 'currency-codes'
function EditPayments({showPaymentEdit,handleClose,mode,credit,contAmount,clientAmount,payment,InvNo,InvAmount,issueDate,Invlist,EditQuote,user,margin,payments,clientCredit,contCredit}) {

    const [Price, setPrice] = useState('')
    const [payment_date, setpayment_date] = useState('')
    const [creditAmount, setCreditAmount] = useState('')
    const [creditRecvdDate, setcreditRecvdDate] = useState('')
    const [creditNoteNo, setcreditNoteNo] = useState('')
    useEffect(()=>{
        setPrice(payment.price)
        setpayment_date(DateFormat(payment.payment_date))
        setCreditAmount(credit.credit_amount)
        setcreditRecvdDate(DateFormat(credit.credit_date))
        setcreditNoteNo(credit.credit_note)
        console.log(Invlist)
    },[showPaymentEdit])


    const Edit = () =>{
        const filtered = payments.filter(inv => inv.id != payment.id)
        let amount = 0
        const edited = {id:payment.id,price:Price,payment_date}
        filtered.push(edited)
        filtered.map(inv => {
            amount += parseFloat(inv.price)
        })
        if(amount <= parseFloat(InvAmount))
        {
            if(user == 'Client'){
                clientAmount('receivedAmount',amount,'edit')
            }
            else{
                contAmount('paidAmount',amount,'edit')
            }
            axiosInstance.post('invoice/save_invoice_payment',{invoice_id:payment.invoice_id,payments:[{id:payment.id,price:Price,payment_date}]})
            .then(res =>{
                console.log(res.data)
                Alert('success','Succes!',`${res.data.message.success}`)
            })
        }
        else{
            Alert('error','Error!','Total Invoice payment amount should not be greater than Main Invoice amount')
        }
        
    }

    const EditCredit = () =>{
        const filtered = Invlist.filter(cred => cred.id != credit.id)
        let amount = 0
        const editedcredit = {id:credit.id,credit_note:creditNoteNo,credit_amount:creditAmount,credit_date:creditRecvdDate}
        const data = {invoice_id:credit.invoice_id,credits:[{id:credit.id,credit_note:creditNoteNo,credit_amount:creditAmount,credit_date:creditRecvdDate}]}
        filtered.push(editedcredit)
        filtered.map(inv => {
            amount += parseFloat(inv.credit_amount)
        })
        if(amount <= parseFloat(InvAmount))
        {
            if(user == 'Client'){
                clientCredit('creditAmount',amount,'edit')
                let ClientcreditAmount = 0
                filtered.map(credit => {
                    // if(credit !== undefined){
                        ClientcreditAmount += parseFloat(credit.credit_amount)
                    // }
                })
                margin('creditAmount',ClientcreditAmount)
            }
            else{
                contCredit('creditAmount',amount,'edit')
                let ContcreditAmount = 0
            filtered.map(credit => {
                // if(credit !== undefined){
                    ContcreditAmount += parseInt(credit.credit_amount)
                // }
            })
            margin('credit_amount',ContcreditAmount)
            }
            axiosInstance.post('invoice/save_invoice_credit',data)
            .then(res =>{
                // console.log(res.data)
                Alert('success','Succes!',`${res.data.message.success}`)
                EditQuote()
            })
        }
        else{
            Alert('error','Error!','Total Credit amount should not be greater than Main Invoice amount')
        }
        // console.log(filtered)
        // if(user == 'Client'){
        //     let ClientcreditAmount = 0
        //     filtered.map(credit => {
        //         // if(credit !== undefined){
        //             ClientcreditAmount += parseFloat(credit.credit_amount)
        //         // }
        //     })
        //     margin('creditAmount',ClientcreditAmount)
        // }
        // else{
        //     let ContcreditAmount = 0
        //     filtered.map(credit => {
        //         // if(credit !== undefined){
        //             ContcreditAmount += parseInt(credit.credit_amount)
        //         // }
        //     })
        //     margin('credit_amount',ContcreditAmount)
        // }
        // axiosInstance.post('invoice/save_invoice_credit',data)
        // .then(res =>{
        //     // console.log(res.data)
        //     Alert('success','Succes!',`${res.data.message.success}`)
        //     EditQuote()
        // })
    }
    return (
        <Modal
            show={showPaymentEdit}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            size="xl"
            style={{ marginTop: '50px', marginLeft: '90px',backgroundColor:'#00000055' }}
            >
            
                    <Modal.Header >
                        <Modal.Title>{mode} </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <button class="ui icon button" onClick={handleClose} ><i aria-hidden="true" class="angle left link icon"></i>Close</button>
                    <Row style={{marginTop:"20px"}}>
                            <Col lg={3}>
                                <Form.Label>Invoice Number</Form.Label>
                                <Form.Control disabled value={InvNo}/>
                            </Col>
                            <Col lg={3}>
                                <Form.Label>Invoice Amount</Form.Label>
                               <CurrencyFormat
                                    className='form-control'
                                    value={InvAmount}
                                    disabled
                                    placeholder="Received Amount"
                                    thousandSeparator={true} />
                            </Col>
                            <Col lg={3}>
                                <Form.Label>Issued Date</Form.Label>
                                <Form.Control value={issueDate} disabled type="date"/>
                            </Col>
                        </Row>
                        {mode == 'Payment Edit'?
                        <Row style={{marginTop:'20px'}}>
                            <Col lg={3}>
                            <Form.Label>Received Amount</Form.Label>
                                <CurrencyFormat
                                    className='form-control'
                                    value={Price}
                                    placeholder="Received Amount"
                                    onValueChange={(values) => setPrice(values.value)}
                                    thousandSeparator={true} />
                            </Col>
                            <Col lg={3}>
                                <Form.Label>Payment Date</Form.Label>
                                <Form.Control value={payment_date} onChange={(e)=>setpayment_date(e.target.value)} type="date"/>
                            </Col>
                            <Col lg={3}>
                                <button className='ui primary button' style={{marginTop:"30px"}} onClick={Edit}>Edit</button>
                            </Col>
                        </Row>
                        :
                        <Row style={{marginTop:'20px'}}>
                            <Col lg={3}>
                            <Form.Label>Credit Amount</Form.Label>
                                <CurrencyFormat
                                    className='form-control'
                                    value={creditAmount}
                                    placeholder="Credit Amount"
                                    onValueChange={(values) => 
                                        setCreditAmount(values.value)}
                                    thousandSeparator={true} />
                            </Col>
                            <Col lg={3}>
                                <Form.Label>Credit Received Date</Form.Label>
                                <Form.Control value={creditRecvdDate} onChange={(e)=>setcreditRecvdDate(e.target.value)} type="date"/>
                            </Col>
                            <Col lg={3}>
                                <Form.Label>Credit Note No</Form.Label>
                                <Form.Control value={creditNoteNo} placeholder="Credit Note No" onChange={(e)=>setcreditNoteNo(e.target.value)} type="text"/>
                            </Col>
                            <Col lg={3}>
                                <button className='ui primary button' onClick={EditCredit} style={{marginTop:"30px"}}>Edit</button>
                            </Col>
                        </Row>
                    }
                    </Modal.Body>
        </Modal>
    )
}

export default EditPayments
