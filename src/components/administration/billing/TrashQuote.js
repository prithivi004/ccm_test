import React,{useState,useEffect} from 'react'
import { Row, Card, Table, Col, Button } from 'react-bootstrap'
import axiosInstance from '../../utils/axiosinstance'
import CustomButton from '../../utils/Button'
import {Alert} from '../../utils/Utilities'
function TrashQuote() {
    const [QuoteList,setQuoteList] = useState([])
    const [client_list, setclient_list] = useState([])
    const [restoreData, setrestoreData] = useState(false)

    useEffect(()=>{
        axiosInstance.post(`quotation/list`,{trash:1})
        .then(res =>{
            const list = res.data.response.quotation_list
            const QuotationList = list.filter(quote => quote.country_id == localStorage.getItem('countryid'))
            setQuoteList(QuotationList)

        axiosInstance.post(`/client/list`)
        .then(res => {
            const client_list = res.data.response.client_list
            setclient_list(client_list)
            })
        })
    },[])

    useEffect(()=>{
        axiosInstance.post(`quotation/list`,{trash:1})
        .then(res =>{
            const list = res.data.response.quotation_list
            const QuotationList = list.filter(quote => quote.country_id == localStorage.getItem('countryid'))
            console.log(QuotationList)
            setQuoteList(QuotationList)
        })
    },[restoreData])
    
    const clientName = (client_id) => {
        const client = client_list.find(client => parseInt(client.id) === parseInt(client_id))
        if (client !== undefined) {
            return client.name
        } else {
            return ''
        }
    }

    const restore =(id,parent_id) =>{
        if(parent_id == '0'){
            axiosInstance.post(`quotation/restore`,{id})
            .then(res =>{
                if (res.data.message.success !== undefined) {
                    setrestoreData(!restoreData)
                    Alert("success", "success", `${res.data.message.success}`,)
                } else {
                    Alert("error", "error", `${res.data.message.error}`,)
                }
            })
        }
        else{
            const parent = QuoteList.find(quote => quote.id == parent_id)
            if(parent !== undefined){
                Alert('error','Error!',`Recover the Parent Quote " ${parent.quotation_num} " First !..`)
            }
            else{
                axiosInstance.post(`quotation/restore`,{id})
                .then(res =>{
                    if (res.data.message.success !== undefined) {
                        setrestoreData(!restoreData)
                        Alert("success", "success", `${res.data.message.success}`,)
                    } else {
                        Alert("error", "error", `${res.data.message.error}`,)
                    }
                })
            }
        }
        
    }
    
    return (
        <div className="component">
            <Row>
                <Col lg={1}>
                    <button className='button' style={{width:80}} onClick={()=>window.history.back()}>Back</button>
                </Col>
                <Col lg={3} style={{marginTop:10}}>
                    <h4>Deleted Quotes</h4>
                </Col>
            </Row>
            <Card style={{ marginTop: "30px", backgroundColor: "white" }}>
                <Row>
                    <Table style={{ backgroundColor: "white" }} responsive>
                                <thead>
                                    <tr>
                                        <th>Restore</th>
                                        <th >QUOTATION NUMBER</th>
                                            <th >DATE ISSUED</th>
                                            <th >CLIENT</th>
                                            <th >DESCRIPTION</th>
                                            <th >QUOTE AMOUNT</th>
                                            <th >APPROVAL STATUS</th>
                                            <th>CLIENT PO</th>
                                            <th>MARGIN %</th>
                                            <th>MARGIN AMOUNT</th>
                                            <th>CCM TICKET NO</th>
                                            <th>COMPLETION DATE</th>
                                            
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {QuoteList.map(quote =>
                                            <tr key={quote.quotation_num}
                                                
                                            className={quote.job_complete_date !== '0000-00-00'? "greenish" : ""}
                                            style={{ height: "50px", padding: "10px" }}
                                            >
                                            <td><button className="button1" style={{width:70}} onClick={()=>restore(quote.id,quote.parent_id)}>Restore</button></td>
                                            <td>{quote.quotation_num}</td>
                                            <td >{quote.qut_date_issue !== '0000-00-00' ? quote.qut_date_issue : ''}  </td>
                                            <td >{clientName(quote.client_id)} </td>
                                            <td >{quote.description} </td>
                                            <td style={{textAlign:'right'}}>{quote.quotation_amt} </td>
                                            <td >{quote.qut_status === '1' ? 'Approved' : quote.qut_status === '2' ? 'Pending' : quote.qut_status === '3' ? 'Canceled' : quote.qut_status === '4' ? 'Rejected' : ''} </td>
                                            <td > {quote.client_po} </td>
                                            {parseInt(quote.margin_amount) > 0 ?
                                                <>
                                                    <td style={{textAlign:'right'}}>{`${quote.margin}%`} </td>
                                                    <td style={{textAlign:'right'}}>{quote.margin_amount} </td>
                                                </>
                                                : parseInt(quote.margin_amount) === 0 ?
                                                    <>
                                                    <td style={{textAlign:'right'}}>{quote.qut_status === '1' ? '0.00 %' :''}</td>
                                                                <td style={{textAlign:'right'}}>{quote.qut_status === '1' ? '0.00' :''}</td>
                                                    </> :
                                                    <>
                                                        <td ></td>
                                                        <td style={{ color: 'red',textAlign:'right' }} >{quote.margin_amount} </td>
                                                    </>}
                                            <td >{quote.ticket_no !== '0' ? quote.ticket_no : ''} </td>
                                            <td >{quote.job_complete_date !== '0000-00-00' ? quote.job_complete_date : ''} </td>
                                        </tr>)}
                                    </tbody>
                    </Table>
                </Row>
            </Card>
        </div>
    )
}

export default TrashQuote
