import React, { Component } from 'react'
import {
    Container,
    Card,
    Form,
    Row,
    Col,
    Button,
    Image,
    InputGroup,
    FormControl
} from 'react-bootstrap';
import axiosInstance from '../../utils/axiosinstance'
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import swal from 'sweetalert';
import AddClient from './AddClient'
import Autocomplete from '@material-ui/lab/Autocomplete';

var token = localStorage.getItem('access_token')


export default class ClientList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emailSearch: '',
            countrySearch: '',
            addClient: false,
            client_id: null,
            client_list: [],
            country_list: [],
            search: '',
            user:{},
        }
    }

    componentDidMount() {
        axiosInstance.post(`/country/list`).then((res) => {
            const country_list = res.data.response.country_list
            this.setState({ country_list })
            // console.log(country_list)
        })
        this.setState({user:JSON.parse(localStorage.getItem('user_details'))})
        axiosInstance.post(`/client/list`,{country:localStorage.getItem('countryid')})
            .then(res => {
                if(localStorage.getItem('countryid') === null){
                    this.setState({client_list:[]})
                }
                else{
                    const client_list = res.data.response.client_list
                    this.setState({ client_list })
                    // console.log(client_list, 'client_list');
                }
            })
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    searching=(value)=>{
        axiosInstance.post(`/client/list`,{country:value})
        // axiosInstance.post(`/contractor/list`,)
            .then(res => {
                if(localStorage.getItem('countryid') === null){
                    this.setState({client_list:[]})
                }else{
                const client_list = res.data.response.client_list
                this.setState({ client_list })
                // console.log(contractor_list);
                }
            })  
    }
    trashClient = (id) => {
        axiosInstance.post(`/client/delete`, { id })
            .then((res) => {
                // console.log(res);
                if (res.data.message.success !== undefined) {
                    swal("success!", `${res.data.message.success}`, "success").then(() => this.componentDidMount())
                } else {
                    swal("error!", `${res.data.message.error}`, "error")
                }
            })
    }
    renderComponent = (id) => {
        this.setState({
            addClient: true,
            client_id: id,
        })
    }
    Back = () => {
        this.setState({
            addClient: false,
            client_id: null,
        })
        this.componentDidMount()
    }

    render() {
        const { client_list, addClient, emailSearch, countrySearch, country_list } = this.state

        return (
            <div>
                {addClient ? <AddClient id={this.state.client_id} Back={this.Back} /> :

                    <div className="component">
                        {this.state.user.view_client == '0'?<>You Don't Have Permission to Access</>:
                        <>
                        <h3 style={{ marginTop: "30px" }}>Client List</h3>
                        <Card style={{ marginTop: "20px", backgroundColor: "white" }}>
                            <Row>
                                <Col lg={4}>
                                    <Autocomplete
                                        options={client_list}
                                        onChange={(e, value) =>value !== null ? this.setState({ emailSearch: value.email }):  this.setState({ emailSearch: '' }) }
                                        getOptionLabel={(option) => option.email}
                                        renderInput={(params) => (
                                            <div ref={params.InputProps.ref}>
                                                <Form.Control placeholder='Enter Email' type="text" {...params.inputProps} />
                                            </div>
                                        )}
                                    />
                                    <button className='iconButtton'  ><i className="fa fa-search"  ></i></button><br />
                                </Col>
                                <Col lg={4}>
                                    <Autocomplete
                                        options={country_list}
                                        onChange={(e, value) => value !== null && this.searching(value.id)}
                                        getOptionLabel={(option) => option.name}
                                        renderInput={(params) => (
                                            <div ref={params.InputProps.ref}>
                                                <Form.Control placeholder='Enter Country' type="text" {...params.inputProps} />
                                            </div>
                                        )}
                                    />
                                    <button className='iconButtton'><i className="fa fa-search" onClick={this.onSearchCountry} ></i></button><br />
                                </Col>
                                <Col lg={{ offset: '3', span: '1' }}>
                                
                                    <button className='addIcon' onClick={() => this.setState({ addClient: !addClient })} >
                                        <i className="fa fa-plus" style={{ fontSize: "20px", color: "white" }}></i>
                                    </button>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: "10px", overflow: "auto" }}>
                                <table className="table ">
                                    <thead>
                                        <tr>
                                            <th scope="col">Client Name</th>
                                            <th scope="col">Address</th>
                                            <th scope="col">Email ID</th>
                                            <th scope="col">Phone No</th>
                                            <th scope="col">Country </th>
                                            <th scope="col">Contact Person</th>
                                            <th scope="col">Delete</th>
                                            <th scope="col">Edit</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {client_list.map((client, i) =>
                                            (emailSearch === '' || client.email === emailSearch) && (countrySearch === '' || client.country === countrySearch) &&
                                            <tr key={client.id} className={i % 2 === 0 ? "rowtable" : ""} >
                                                <td>{client.name}</td>
                                                <td>{client.address}</td>
                                                <td>{client.email}</td>
                                                <td>{client.phone}</td>
                                                {this.state.country_list.map(country => {
                                                    return (client.country === country.id) && <td>{country.name}</td>
                                                })}
                                                <td>{client.contact_person}</td>
                                                <td><button onClick={(e) => this.trashClient(client.id)} style={{ border: "none" }} ><i className="fa fa-trash" style={{ fontSize: "18px", color: "red" }}></i></button></td>
                                                <td> <button onClick={(e) => this.renderComponent(client.id)} style={{ width: "100px", height: "25px", backgroundColor: "#4A88DC", border: "none", color: "white", borderRadius: "10px" }}>EDIT</button></td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </Row>
                        </Card>
                        </>}
                    </div>
                }
            </div>
        )
    }
}
