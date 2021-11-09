import React,{useState,useEffect} from 'react'
import { Modal, Row, Form, Col, Card } from 'react-bootstrap'
import CurrencyFormat from 'react-currency-format'
import axiosInstance from '../../../utils/axiosinstance'
import { DateFormat } from '../../../utils/DateFormat'
import { Alert } from '../../../utils/Utilities'
import EditPayments from './EditPayments'

function MulipleClientInvPayments({InvNo,showPayment,handleClose,user,InvAmount,issueDate,invId,margin,clientinvIdList,continvIdList,recvAmt,EditQuote,recvcontAmt,recvCredit,recvconCredit}) {

    const [RecvdDate,setRecvDate] = useState('')
    const [creditRecvdDate,setcreditRecvdDate] = useState('')
    const [Amount,setAmount] = useState('')
    const [creditAmount,setCreditAmount] = useState('')
    const [invoice,setinvoice] = useState(true)
    const [creditNoteNo, setcreditNoteNo] = useState('')
    const [paymentList, setPaymentList] = useState([])
    const [creditList, setCreditList] = useState([])
    const [date,setDate] =useState('')
    const [refresh , setrefresh ] = useState(false)
    const [creditpay,setCreditpay]=useState([])
    const [Invlist, setInvlist] = useState([])
    const [showEdit, setshowEdit] = useState(false)
    const [mode, setmode] = useState('')
    const [singlecredit, setsinglecredit] = useState('')
    const [singlepayment, setsinglepayment] = useState('')

    useEffect(()=>{
        if(showPayment){
            axiosInstance.post(`invoice/invoice_payment_list`,{invoice_id:invId})
            .then(res =>{
                const list = res.data.response.invoice_payment_list
                let total = 0
                setPaymentList(list)
                list.map(inv =>{
                    total += parseFloat(inv.price)
                })
                
                // console.log('Its me2',res.data.response.invoice_payment_list)
            })
            .then(res =>{
                // setCreditpay(res.data.response.invoice_credit_list)
                let continvarr = []
                if(user == 'Client'){
                    axiosInstance.post(`invoice/invoice_credit_lists`,{invoice_ids:clientinvIdList})
                    .then(res =>{
                        const list = res.data.response.invoice_credit_list
                        // console.log(list)
                        setInvlist(list)
                        const pay = list.filter(inv => inv.invoice_id == invId)
                        setCreditpay(pay)
                    })   
                }
                else{
                    axiosInstance.post(`invoice/invoice_credit_lists`,{invoice_ids:continvIdList})
                    .then(res =>{
                        const list = res.data.response.invoice_credit_list
                        setInvlist(list)
                        const pay = list.filter(inv => inv.invoice_id == invId)
                        setCreditpay(pay)
                        let ContcreditAmount = 0
                    })
                }
            })
    }
    },[showPayment,refresh,showEdit])

    
    const onChangeAmount = (values, name) => {
        const { formattedValue, value } = values;
        // this.setState({ [name]: value },()=>this.props.passData(name,value))
        setAmount(value)
    }

    const submit = () => {
        const payments = []
        const list = [...paymentList]
        const data = {price:Amount,payment_date:RecvdDate}
        list.push(data)
        let total = 0
        list.map(inv => {
            total += parseFloat(inv.price)
        })
        // console.log(total)
        if(total <= parseFloat(InvAmount))
        {
            if(user == 'Client'){
                recvAmt('receivedAmount',Amount,'add')
               }
               else{
                   recvcontAmt('paidAmount',Amount,'add')
               }
                payments.push(data)     
                AddPayment(payments)
        }
        else{
            Alert('error','Error!','Total Invoice payment amount should not be greater than Main Invoice amount')
        }
      
    }
    const submit2=()=>{
        const CreditAmt=[]
        const list = [...creditpay]
        const Creditdata={credit_amount:creditAmount,credit_note:creditNoteNo,credit_date:creditRecvdDate}
        list.push(Creditdata)
        let total = 0
        list.map(credit => {
            total += parseFloat(credit.credit_amount)
        })
        // console.log(total)
        if(total <= parseFloat(InvAmount))
        {
            if(user == 'Client'){
                recvCredit('creditAmount',creditAmount,'add')
               }
               else{
                recvconCredit('creditAmount',creditAmount,'add')
               }
                CreditAmt.push(Creditdata)   
        AddPaymentCredit(CreditAmt)
    }
    else{
        Alert('error','Error!','Total Credit amount should not be greater than Main Invoice amount')
    }
    }

    const DeletePayment = (id,amount) => {
        if( user == 'Client'){
            recvAmt('receivedAmount',amount,'sub')
        }
        else{
           recvcontAmt('paidAmount',amount,'sub')
        }
        axiosInstance.post(`invoice/delete_invoice_payment`,{id})
        .then(res =>{
            console.log(res.data)
            setrefresh(!refresh)
            Alert('success','Success!',`${res.data.message.success}`)
        })
    }
    const DeletePayment2 = (id,amount) => {
        if(user == 'Client'){
            let ClientcreditAmount = 0
            Invlist.map(credit => {
                if(credit !== undefined){
                    ClientcreditAmount += parseFloat(credit.credit_amount)
                }
            })
            margin('creditAmount',ClientcreditAmount-parseFloat(amount))
        }
        else{
            let ContcreditAmount = 0
            Invlist.map(credit => {
                if(credit !== undefined){
                    ContcreditAmount += parseFloat(credit.credit_amount)
                }
            })
            margin('credit_amount',ContcreditAmount-parseFloat(amount))
        }
        axiosInstance.post(`invoice/delete_invoice_credit`,{id})
        .then(res =>{
            console.log(res.data)
            setrefresh(!refresh)
            EditQuote()
            Alert('success','Success!',`${res.data.message.success}`)
        })
    }

    const AddPaymentCredit = (CreditAmt) =>{
        if(user == 'Client'){
            let ClientcreditAmount = 0
            Invlist.map(credit => {
                // if(credit !== undefined){
                    ClientcreditAmount += parseFloat(credit.credit_amount)
                // }
            })
            margin('creditAmount',ClientcreditAmount+parseFloat(creditAmount))
        }
        else{
            let ContcreditAmount = 0
            Invlist.map(credit => {
                // if(credit !== undefined){
                    ContcreditAmount += parseInt(credit.credit_amount)
                // }
            })
            margin('credit_amount',ContcreditAmount+parseInt(creditAmount))
        }
        axiosInstance.post('invoice/save_invoice_credit',{invoice_id:invId,credits:CreditAmt})
        .then(res =>{
            console.log(res.data)
            Alert('success','Success!',`${res.data.message.success}`)
            setrefresh(!refresh)
            EditQuote()
            setCreditAmount('')
            setcreditNoteNo('')
            setcreditRecvdDate('')
        })
    }
    const AddPayment = (payments) =>{
        axiosInstance.post('invoice/save_invoice_payment',{invoice_id:invId,payments})
        .then(res =>{
            console.log(res.data)
            Alert('success','Success!',`${res.data.message.success}`)
            setrefresh(!refresh)
            setAmount('')
            setRecvDate('')
        })
    }

    return (
                <Modal
                    show={showPayment}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                    size="xl"
                    style={{ marginTop: '50px', marginLeft: '90px' }}
               
                >
                    <Modal.Header >
                        <Modal.Title>{user} </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Row>
                        <Col lg={2}>
                        <button class="button" onClick={handleClose} ><i aria-hidden="true" class="angle left link icon"></i>back</button>
                        </Col>
                        <Col lg={2}>
                        {invoice?<button class="button" onClick={()=>setinvoice(!invoice)} >Add Credit</button>:
                        <button class="button" onClick={()=>setinvoice(!invoice)} >Add invoice</button>}
                            </Col>
                    </Row>
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
                            {invoice?
                        <Row style={{marginTop:"20px"}}>
                            <Col lg={3}>
                                <Form.Label>Received Amount</Form.Label>
                                <CurrencyFormat
                                    className='form-control'
                                    value={Amount}
                                    placeholder="Received Amount"
                                    onValueChange={(values) => onChangeAmount(values, 'receivedAmount')}
                                    thousandSeparator={true} />
                            </Col>
                            <Col lg={3}>
                                <Form.Label>Payment Date</Form.Label>
                                <Form.Control value={RecvdDate} onChange={(e)=>setRecvDate(e.target.value)} type="date"/>
                            </Col>
                            <Col lg={2}>
                                <button className='button' style={{marginTop:"30px"}} onClick={submit}>Add</button>
                            </Col>
                            </Row>:
                            <Row style={{marginTop:"20px"}}>
                            <Col lg={3}>
                                <Form.Label>Credit Amount</Form.Label>
                                <CurrencyFormat
                                    className='form-control'
                                    value={creditAmount}
                                    placeholder="Credit Amount"
                                    onValueChange={(values) => 
                                        setCreditAmount(values.value)}
                                    thousandSeparator={true} />:

                            </Col>
                            <Col lg={3}>
                                <Form.Label>Credit Received Date</Form.Label>
                                <Form.Control value={creditRecvdDate} onChange={(e)=>setcreditRecvdDate(e.target.value)} type="date"/>
                            </Col>
                            <Col lg={3}>
                                <Form.Label>Credit Note No</Form.Label>
                                <Form.Control value={creditNoteNo} placeholder="Credit Note No" onChange={(e)=>setcreditNoteNo(e.target.value)} type="text"/>
                            </Col>
                            
                            <Col lg={2}>
                                <button className='button' onClick={submit2} style={{marginTop:"30px"}}>Add</button>
                            </Col>
                        </Row>}
                        <Card style={{ marginTop: "30px", backgroundColor: "white", height: '500px', }}>
                            <Row>
                                {invoice?
                                <table class="ui single line table">
                                    <thead >
                                        {user === 'Client' ?
                                            <tr >
                                                <th >Invoice No</th>
                                                <th >Invoice Amount</th>
                                                <th >Issued Date</th>
                                                <th >Received Date</th>
                                                <th >Received Amount</th>
                                                <th >Edit</th>
                                                <th >Delete</th>
                                            </tr>
                                            :
                                            <tr >
                                                <th >Invoice No</th>
                                                <th >Invoice Amount</th>
                                                <th >Issued Date</th>
                                                <th >Paid Date</th>
                                                <th >Paid Amount</th>
                                                <th >Edit</th>
                                                <th >Delete</th>
                                            </tr>}
                                    </thead>
                                    <tbody >
                                        {paymentList !== undefined && paymentList.map(inv =>
                                            <tr >
                                                <td >{InvNo} </td>
                                                <td > {InvAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                <td > {issueDate}</td>
                                                <td > {DateFormat(inv.payment_date)} </td>
                                                <td > {inv.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </td>
                                                <td><button onClick={() => {
                                                    setmode('Payment Edit')
                                                    setsinglepayment(inv)
                                                    setshowEdit(!showEdit)
                                                }} className='buttonStyle'><i className='green edit link icon' style={{ fontSize: "18px", }} ></i></button></td>
                                                <td><button style={{ border: 'none' }} onClick={()=>DeletePayment(inv.id,inv.price)}><i className="fa fa-trash" style={{ fontSize: "18px", color: "red" }}></i></button></td>
                                            </tr>
                                        )} 
                                    </tbody>
                                </table>:
                                <table class="ui single line table">
                                    <thead>
                                    {user === 'Client' ?
                                            <tr >
                                                <th >Credit Note Amount</th>
                                                <th >Credit Note Received Date</th>
                                                <th >Credit Note Number</th>
                                                <th >Edit</th>
                                                <th >Delete</th>
                                            </tr>
                                            :
                                            <tr >
                                             
                                                <th >Credit Note Amount</th>
                                                <th >Credit Note Received Date</th>
                                                <th >Credit Note Number</th>
                                                <th >Edit</th>
                                                <th >Delete</th>
                                            </tr>}
                                    </thead> 
                                    <tbody>
                                    { creditpay.map(credit=>(
                                        <tr>
                                                <td>{credit.credit_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                <td>{DateFormat(credit.credit_date)}</td>
                                                <td>{credit.credit_note}</td>
                                                <td><button onClick={() => {
                                                    setmode('Credit Edit')
                                                    setsinglecredit(credit)
                                                    setshowEdit(!showEdit)
                                                }} className='buttonStyle'><i className='green edit link icon' style={{ fontSize: "18px", }} ></i></button></td>
                                                <td><button style={{ border: 'none' }} onClick={()=>DeletePayment2(credit.id,credit.credit_amount)}><i className="fa fa-trash" style={{ fontSize: "18px", color: "red" }}></i></button></td>
                                            </tr>
                                    ))
                                           
                                    }
                                    </tbody>   
                                </table>
                                }
                            </Row>
                        </Card>
                        <EditPayments
                            showPaymentEdit={showEdit}
                            handleClose={()=>setshowEdit(!showEdit)}
                            mode={mode}
                            credit={singlecredit}
                            payment={singlepayment}
                            InvNo={InvNo}
                            InvAmount={InvAmount}
                            issueDate={issueDate}
                            Invlist={Invlist}
                            EditQuote={EditQuote}
                            user={user}
                            margin={margin}
                            payments={paymentList}
                            contAmount={recvcontAmt}
                            clientAmount={recvAmt}
                            clientCredit={recvCredit}
                            contCredit={recvconCredit}
                            />
                    </Modal.Body>
                    <Modal.Footer>

                    </Modal.Footer>
                </Modal>
    )
}

export default MulipleClientInvPayments
