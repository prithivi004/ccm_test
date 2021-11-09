import React, { useEffect,useState } from 'react'
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
import { Header, Dropdown } from 'semantic-ui-react'
import { DateFormat } from '../../../utils/DateFormat'

export function Payment(props){

    const [show, setshow] = useState(null)
    const [list, setlist] = useState([])
    const [user, setuser] = useState('')
        
        //console.log(show,list, 'show')
    useEffect(() => {
        setshow(props.show)
        setlist(props.list)
        setuser(props.user)
    }, [props.show])
    const { handleClose, onDelete, } = props;
        return (
            <>
                <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                    size="xl"
                    style={{ marginTop: '50px', marginLeft: '90px' }}
                //aria-labelledby="contained-modal-title-vcenter"
                //centered
                >
                    <Modal.Header >
                        <Modal.Title>{user} </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <button class="button" onClick={handleClose} ><i aria-hidden="true" class="angle left link icon"></i>back</button>
                        <Card style={{ marginTop: "30px", backgroundColor: "white", height: '500px', }}>
                            <Row>
                                <table class="ui single line table">
                                    <thead >
                                        {user === 'Client' ?
                                            <tr >
                                                <th >Invoice No</th>
                                                <th >Invoice Amount</th>
                                                <th >Issued Date</th>
                                                <th >Last Received Date</th>
                                                <th >Received Amount</th>
                                                {/* <th >Credit Note Amount</th>
                                                <th >Credit Note Received Date</th>
                                                <th >Credit Note No</th> */}
                                                <th >Delete</th>
                                            </tr>
                                            :
                                            <tr >
                                                <th >Invoice No</th>
                                                <th >Invoice Amount</th>
                                                <th >Invoice Received Date</th>
                                                <th >Last Paid Date</th>
                                                <th >Paid Amount</th>
                                                {/* <th >Credit Note Amount</th>
                                                <th >Credit Note Received Date</th>
                                                <th >Credit Note No</th> */}
                                                <th >Delete</th>
                                            </tr>}
                                    </thead>
                                    <tbody >
                                        {list !== undefined && list.map(inv =>
                                            <tr >
                                                <td >{inv.num} </td>
                                                <td > {inv.invoice_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </td>
                                                <td > {DateFormat(inv.invoice_date)} </td>
                                                <td > {DateFormat(inv.amount_received_date)} </td>
                                                <td > {inv.price} </td>
                                                {/* <td > {inv.credit_amount} </td>
                                                <td > {DateFormat(inv.credit_date)} </td>
                                                <td > {inv.credit_note} </td> */}
                                                <td><button style={{ border: 'none' }} onClick={(e) => onDelete(inv.id)}><i className="fa fa-trash" style={{ fontSize: "18px", color: "red" }}></i></button></td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </Row>
                        </Card>
                    </Modal.Body>
                    <Modal.Footer>

                    </Modal.Footer>
                </Modal>
            </>
        )
    }

export default Payment
