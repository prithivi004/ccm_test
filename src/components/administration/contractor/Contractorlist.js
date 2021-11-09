import React, { Component } from 'react'
import {
    Container,
    Card,
    Form,
    Row,
    Col,
    Button,
    Image
} from 'react-bootstrap';
import axiosInstance from '../../utils/axiosinstance'
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import swal from 'sweetalert';
import AddContractor from './Addcontractor'
import Autocomplete from '@material-ui/lab/Autocomplete';


var token = localStorage.getItem('access_token')



export default class contractor_list extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contractor_id:null,
            emailSearch: '', 
            countrySearch: '',

            contractor_list: [],
            country_list: [],
            user:{}

        }
    }

    componentDidMount() {

        axiosInstance.post(`/country/list`)
            .then((res) => {
                const country_list = res.data.response.country_list
                this.setState({ country_list })
                // console.log(country_list);
            })
            const user = localStorage.getItem('user_details') 
            // console.log(JSON.parse(user),'user')
            this.setState({user:JSON.parse(localStorage.getItem('user_details'))})
        axiosInstance.post(`/contractor/list`,{country:localStorage.getItem('countryid')})
        // axiosInstance.post(`/contractor/list`,)
            .then(res => {
                if(localStorage.getItem('countryid') === null){
                    this.setState({contractor_list:[]})
                }else{
                const contractor_list = res.data.response.contractor_list
                this.setState({ contractor_list })
                // console.log(contractor_list);
                }
            })
    }

    handleSearch = e => {
        this.setState({ search: e.target.value })
    }
    searching=(value)=>{
        axiosInstance.post(`/contractor/list`,{country:value})
        // axiosInstance.post(`/contractor/list`,)
            .then(res => {
                if(localStorage.getItem('countryid') === null){
                    this.setState({contractor_list:[]})
                }else{
                const contractor_list = res.data.response.contractor_list
                this.setState({ contractor_list })
                // console.log(contractor_list);
                }
            })  
    }
    trashContractor = (id) => {
        console.log(id)
        axiosInstance.post(`/contractor/delete`, { id })
            .then((res) => {
                // console.log(res);
                if (res.data.message.success !== undefined) {
                    swal("success!", `${res.data.message.success}`, "success").then(() => this.componentDidMount())
                } else {
                    swal("error!", `${res.data.message.error}`, "error")
                }
            })
            .catch((e) => {
                // console.log(e)
            })
    }
    renderComponent = (id) => {
        this.setState({
            addContractor: true,
            contractor_id: id,
        })
    }
    Back = (e) => {
        this.setState({
            addContractor: false,
            contractor_id: null,
        })
        this.componentDidMount()
    }
    renderTable = (contractor, i) => {
        return (
            <tr key={contractor.id} className={i % 2 === 0 ? "rowtable" : ""} style={{ height: "30px" }}>
                <td>{contractor.name}</td>
                <td>{contractor.address}</td>
                <td>{contractor.email}</td>
                <td>{contractor.phone}</td>
                {this.state.country_list.map(country => {
                    return (contractor.country === country.id) && <td>{country.name}</td>
                })}
                <td>{contractor.contact_person}</td>
                <td><button onClick={(e) => this.trashContractor(contractor.id)} style={{ border: "none" }} ><i className="fa fa-trash" style={{ fontSize: "18px", color: "red" }}></i></button></td>
                <td> <button onClick={(e) => this.renderComponent(contractor.id)} style={{ width: "100px", height: "25px", backgroundColor: "#4A88DC", border: "none", color: "white", borderRadius: "10px" }}>EDIT</button></td>
            </tr>
        )
    }

    search = () => {
        // alert("Hello Wrold")
    }
    render() {
        const { emailSearch, countrySearch, addContractor, country_list, contractor_list, } = this.state
        return (
            <div>
                {addContractor ? <AddContractor id={this.state.contractor_id} Back={this.Back} /> :
                    <div className="component">
                        {this.state.user.view_cont == '0'?<>You Dont Have Permission to Access</>
                        :<>
                        <h3 style={{ marginTop: "30px" }}>Contractor List</h3>
                        <Card style={{ marginTop: "20px", backgroundColor: "white" }}>
                            <Row  >
                            <Col lg={4}>
                                    <Autocomplete
                                        options={contractor_list}
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
                                        // onChange={(e, value) => value !== null ? this.setState({ countrySearch: value.id }) : this.setState({ countrySearch: '' })}
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
                                <Col lg={{offset:'3'}}>
                                    <button className='addIcon' onClick={() => this.setState({ addContractor: !addContractor })} >
                                        <i className="fa fa-plus" style={{ fontSize: "20px", color: "white" }}></i>
                                    </button>
                                </Col>

                            </Row>
                            <Row style={{ marginTop: "10px", overflow: "auto" }}>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Contractor Name</th>
                                            <th scope="col">Address</th>
                                            <th scope="col">Email ID</th>
                                            <th scope="col">Phone No</th>
                                            <th scope="col">Country</th>
                                            <th scope="col">Contact Person</th>
                                            <th scope="col">Delete</th>
                                            <th scope="col">Edit</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contractor_list.map((contractor, i)=>
                                         (emailSearch === '' || contractor.email === emailSearch) && (countrySearch === '' || contractor.country === countrySearch) &&
                                         <tr key={contractor.id} className={i % 2 === 0 ? "rowtable" : ""} style={{ height: "30px" }}>
                                         <td>{contractor.name}</td>
                                         <td>{contractor.address}</td>
                                         <td>{contractor.email}</td>
                                         <td>{contractor.phone}</td>
                                         {this.state.country_list.map(country => {
                                             return (contractor.country === country.id) && <td>{country.name}</td>
                                         })}
                                         <td>{contractor.contact_person}</td>
                                         <td><button onClick={(e) => this.trashContractor(contractor.id)} style={{ border: "none" }} ><i className="fa fa-trash" style={{ fontSize: "18px", color: "red" }}></i></button></td>
                                         <td> <button onClick={(e) => this.renderComponent(contractor.id)} style={{ width: "100px", height: "25px", backgroundColor: "#4A88DC", border: "none", color: "white", borderRadius: "10px" }}>EDIT</button></td>
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
