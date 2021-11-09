import React, { Component } from 'react'
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

export class ContPO_list extends Component {

    Cont_Name = (cont_id) => {
        const contractor = this.props.cont_list.find(cont => parseInt(cont.id) === parseInt(cont_id))
        if (contractor !== undefined) {
            return contractor.name
        } else {
            return ''
        }
    }

    render() {
        const { show, handleClose, list, onDelete, } = this.props;
        return (
            <>
                <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                    size="xl"
                    style={{ marginTop: '50px', marginLeft: '90px' }}
                >
                    <Modal.Header >
                        <Modal.Title>Contractor PO List </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <button class="button" onClick={handleClose} ><i aria-hidden="true" class="angle left link icon"></i>back</button>
                        <Card style={{ marginTop: "30px", backgroundColor: "white", height: '500px', }}>
                            <Row>
                                <table class="ui single line table">
                                    <thead >
                                        <tr >
                                        {/* <th>ID</th> */}
                                            <th >Contractor Name</th>
                                            <th >Po Number</th>
                                            <th >Po Amount</th>
                                            <th >Po Issued Date</th>
                                            <th>Quotation No</th>
                                            <th>Quotation Amount</th>
                                            <th >Work Commence</th>
                                            <th >Work Complete</th>
                                            <th >Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody >
                                        {list !== undefined && list.length !== 0 && list.map(po =>
                                            <tr >
                                            {/* <td>{po.id}</td> */}
                                                <td >{this.Cont_Name(po.cont_id)} </td>
                                                <td > {po.po_number} </td>
                                                <td > {po.po_amount} </td>
                                                <td > {DateFormat(po.po_issue_date)} </td>
                                                <td>{po.quote_number}</td>
                                                <td>{po.quote_amount}</td>
                                                <td > {DateFormat(po.work_commence)} </td>
                                                <td > {DateFormat(po.work_complete)} </td>
                                                <td><button style={{ border: 'none' }} onClick={(e) => onDelete(po.id,po.cont_id)}><i className="fa fa-trash" style={{ fontSize: "18px", color: "red" }}></i></button></td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </Row>
                        </Card>
                    </Modal.Body>
                </Modal>
            </>
        )
    }
}

export default ContPO_list
