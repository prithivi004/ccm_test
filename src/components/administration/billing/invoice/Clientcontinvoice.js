import React,{ useState, useEffect } from 'react'
import {
    Container,
    Card,
    Form,
    Row,
    Col,
    Button,
    Image,
    Table,
    InputGroup,
    FormControl,
    Modal
} from 'react-bootstrap';
import { DateFormat } from '../../../utils/DateFormat'
import axiosInstance from '../../../utils/axiosinstance'

function Clientcontinvoice(props) {
    const [clientcredit, setclientcredit] = useState([])
    const [contractor, setcontractor] = useState(false)
    const [clientinv, setclientinv] = useState([])
    const [continv, setcontinv] = useState([])
    const [contcredit, setcontcredit] = useState([])

    useEffect(()=>{

        // setcontinv(props.cont_list)  
        const clientinvoice = props.client_list
        const continvoice = props.cont_list
        props.quote.client_invoice_id !== undefined &&
            axiosInstance.post(`invoice/invoice_credit_lists`,{invoice_ids: props.quote.client_invoice_id})
            .then(res =>{
                const list = res.data.response.invoice_credit_list
                setclientcredit(list)
                    // list.map(credit => props.client_list.map(inv => inv.id == credit.invoice_id && clientinvoice.push({...inv,...credit})))
                    clientinvoice.forEach(inv => {
                        let arr = []
                       list.map(credit =>{
                           if(inv.id == credit.invoice_id){
                                arr.push(credit)
                               inv.credits = arr
                           }
                       }) 
                    });
                    setclientinv(clientinvoice)
        })
        props.quote.cont_invoice_id !== undefined && 
            axiosInstance.post(`invoice/invoice_credit_lists`,{invoice_ids:props.quote.cont_invoice_id})
            .then(res =>{
                const list = res.data.response.invoice_credit_list
                setcontcredit(list)
                continvoice.forEach(inv => {
                    let arr = []
                   list.map(credit =>{
                       if(inv.id == credit.invoice_id){
                            arr.push(credit)
                           inv.credits = arr
                       }
                   }) 
                });
                setcontinv(continvoice)
            })
    },[props.show])

    // const Cont_Name = (cont_id) => {
    //     const contractor = contlist.find(cont => parseInt(cont.id) === parseInt(cont_id))
    //     if (contractor !== undefined) {
    //         return contractor.name
    //     } else {
    //         return ''
    //     }
    // }

    const CalcTotalCredit = (invoice_id,user) =>{
        let amount = 0
        let list = []

        if(user == 'client'){
            list = clientcredit.filter(credit => credit.invoice_id == invoice_id)
        }
        else{
            list = contcredit.filter(credit => credit.invoice_id == invoice_id)
        }
        // console.log(list)
        list.map(credit =>{
                // console.log(credit)
            amount += parseFloat(credit.credit_amount)
        })
        return amount.toFixed(2)

    }
    return (
                <Modal
                    show={props.show}
                    onHide={props.handleClose}
                    backdrop="static"
                    keyboard={false}
                    size="xl"
                    style={{ marginTop: '50px', marginLeft: '90px' }}
                //aria-labelledby="contained-modal-title-vcenter"
                //centered
                >
                    {/* <Modal.Header >
                        <Modal.Title>{user} </Modal.Title>
                    </Modal.Header> */}
                    <Modal.Body>
                    <Row>
                    <Col lg={3}>
                        <Row>
                            <Col lg={6}>
                            <button class="button" onClick={props.handleClose} style={{width:100}} ><i aria-hidden="true" class="angle left link icon"></i>back</button>
                            </Col>
                            <Col lg={6}>
                            {contractor?<button class="button"  style={{width:200}} onClick={()=>setcontractor(!contractor)}> View Client invoice </button>
                        :<button class="button"  style={{width:200}} onClick={()=>setcontractor(!contractor)}>View Contractor invoice</button>}
                            </Col>
                            </Row>                          
                        </Col>  
                    </Row>       
                        <Card style={{ marginTop: "30px", backgroundColor: "white", height: '500px', }}>
                            <Row>
                                {contractor ?
                                <table class="ui single line table">
                                <thead>
                                        <tr >
                                            <th >Invoice No</th>
                                            <th >Invoice Amount</th>
                                            <th >Invoice Received Date</th>
                                            <th >Tax No</th>
                                            <th >Paid Date</th>
                                            <th >Paid Amount</th>
                                            <th >Credit Note Amount</th>
                                            <th>Credit Note No</th>
                                            <th>Credit Received Date</th>
                                            {/* <th >Delete</th> */}
                                        </tr>
                                </thead>
                    <tbody >
                        
                            {continv.map(inv => inv.credits !== undefined?
                                            inv.credits.map(cred=>
                                            <tr >
                                                    <td >{inv.num} </td>
                                                    <td > {inv.invoice_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </td>
                                                    <td > {DateFormat(inv.invoice_date)} </td>
                                                    <td > {inv.tax_invoice} </td>
                                                    <td > {DateFormat(inv.amount_received_date)} </td>
                                                    <td > {inv.price} </td>
                                                    <td > {cred.credit_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                    <td > {cred.credit_note}</td>
                                                    <td > {DateFormat(cred.credit_date)}</td>
                                                {/* <td><button style={{ border: 'none' }} onClick={(e) => onDelete(inv.id)}><i className="fa fa-trash" style={{ fontSize: "18px", color: "red" }}></i></button></td> */}
                                            </tr>):
                                            <tr >
                                                    <td >{inv.num} </td>
                                                    <td > {inv.invoice_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </td>
                                                    <td > {DateFormat(inv.invoice_date)} </td>
                                                    <td > {inv.tax_invoice} </td>
                                                    <td > {DateFormat(inv.amount_received_date)} </td>
                                                    <td > {inv.price} </td>
                                                    <td > {inv.credit_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                    <td > {inv.credit_note}</td>
                                                    <td > {DateFormat(inv.credit_date)}</td>
                                                {/* <td><button style={{ border: 'none' }} onClick={(e) => onDelete(inv.id)}><i className="fa fa-trash" style={{ fontSize: "18px", color: "red" }}></i></button></td> */}
                                            </tr>

                                    )}
                    </tbody>
                </table>:
                                <table class="ui single line table">
                                        <thead >
                                            <tr >
                                                <th >Invoice No</th>
                                                <th >Invoice Amount</th>
                                                <th >Issued Date</th>
                                                <th >Received Date</th>
                                                <th >Received Amount</th>
                                                <th >Credit Note Amount</th>
                                                <th>Credit Note No</th>
                                                <th>Credit Received Date</th>
                                            </tr>
                                        </thead>
                                            <tbody >
                                            {clientinv.map(inv => inv.credits !== undefined?
                                            inv.credits.map(cred=>
                                                <tr >
                                                    <td >{inv.num} </td>
                                                    <td > {inv.invoice_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </td>
                                                    <td > {DateFormat(inv.invoice_date)} </td>
                                                    <td > {DateFormat(inv.amount_received_date)} </td>
                                                    <td > {inv.price} </td>
                                                    <td > {cred.credit_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                    <td > {cred.credit_note}</td>
                                                    <td > {DateFormat(cred.credit_date)}</td>
                                                    {/* <td><button style={{ border: 'none' }} onClick={(e) => onDelete(inv.id)}><i className="fa fa-trash" style={{ fontSize: "18px", color: "red" }}></i></button></td> */}
                                                </tr>):
                                                <tr >
                                                    <td >{inv.num} </td>
                                                    <td > {inv.invoice_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </td>
                                                    <td > {DateFormat(inv.invoice_date)} </td>
                                                    <td > {DateFormat(inv.amount_received_date)} </td>
                                                    <td > {inv.price} </td>
                                                    <td > {inv.credit_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                    <td > {inv.credit_note}</td>
                                                    <td > {DateFormat(inv.credit_date)}</td>
                                                    {/* <td><button style={{ border: 'none' }} onClick={(e) => onDelete(inv.id)}><i className="fa fa-trash" style={{ fontSize: "18px", color: "red" }}></i></button></td> */}
                                            </tr>
                                            )}
                                        </tbody>
                                    </table>}
                            </Row>
                        </Card>
                    </Modal.Body>
                    <Modal.Footer>

                    </Modal.Footer>
                </Modal>
    )
}

export default Clientcontinvoice
