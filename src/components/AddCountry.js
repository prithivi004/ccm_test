import React, { Component } from 'react'
import { Card, Row, Col, Form, Image } from 'react-bootstrap'
import topimage from './img/logo-light.png';
import CustomButton from './utils/Button'
import CountrySelect from 'react-bootstrap-country-select';
import { head } from 'ramda';
import axiosInstance from './utils/axiosinstance'
import { Alert } from './utils/Utilities'
import swal from 'sweetalert';
import Swal from 'sweetalert2';

var token = localStorage.getItem('access_token')

export default class Country extends Component {


    constructor(props) {
        super(props)

        this.state = {
            country_id: null,
            country_object: '',
            status: '',
            country_list: [],
        }
    }


    componentDidMount() {
        // console.log(process.env.REACT_APP_URL)
        axiosInstance.post(`/country/list`)
            .then((res) => {
                // console.log(res,'response')
                const country_list = res.data.response.country_list
                this.setState({ country_list })
                // console.log(country_list, 'country_list');
            })
    }


    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }


    countryChange = (e) => {
        // console.log(e)
        this.setState({ country_object: e }, () => this.filterID())
    }


    filterID = () => {
        const { country_list, country_object, } = this.state;
        if (country_object !== null) {
            const filterList = head(country_list.filter(object => object.name == country_object.name))
            if (filterList !== undefined) {
                this.setState({ country_id: filterList.id, status: filterList.status })
            }

        } else {
            this.setState({ country_id: null, status: '' })
        }

    }


    onSubmit = (e) => {
        const { country_object, status } = this.state;

        const data = {
            name: country_object.name,
            status: status,
        }
        if (country_object === null) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please Fillout all the Fields!',
            })
        } else {
            axiosInstance.post(`/country/add`, data,)
                .then((res) => {
                    // console.log(res);
                    if (res.data.message.success !== undefined) {
                        swal("success!", `${res.data.message.success}`, "success")
                    } else {
                        swal("error!", `${res.data.message.error}`, "error")
                    }
                })
                .then(() => this.onCancel())
            .catch(e => console.log(e))
        }
    }


    onUpdate = (e) => {
        const { country_id, country_object, status } = this.state;

        const data = {
            name: country_object.name,
            status: status,
        }
        axiosInstance.post(`/country/edit/` + country_id, data)
            .then(res => {
                if (res.data.message.success !== undefined) {
                    // console.log(res)
                    Alert("success", "Success!", `${res.data.message.success}`)
                } else {
                    // console.log(res)
                    Alert("error", "error!", `${res.data.message.error}`)
                }
            })
            .then(() => this.onCancel())
            .catch(e => console.log(e))
    }


    onDelete = (e) => {
        const { country_id, country_object, status } = this.state;

        axiosInstance.post(`/country/delete`, { id: country_id })
        .then(res => {
            if (res.data.message.success !== undefined) {
                // console.log(res)
                Alert("success", "Success!", `${res.data.message.success}`)
            } else {
                // console.log(res)
                Alert("error", "error!", `${res.data.message.error}`)
            }
        })
            .then(() => this.onCancel())
            .catch((e) => console.log(e))
    }


    onCancel = (e) => {
        this.setState({
            country_id: null,
            country_object: '',
            status: '',
            country_list: [],
        })
        this.componentDidMount();
    }

    render() {
        const { country_id, status, country_object } = this.state;

        return (
            <div>

                <div className="component">
                    <p style={{ fontSize: "20px" }}>Country</p>

                    <Card border="dark" sm={6} style={{ height: "500px" }}>
                        <Form >
                            <Row style={{ marginTop: "3%" }}>
                                <Col lg={4} sm={4}>
                                    <Image src={topimage} rounded style={{ width: "100px", marginLeft: "20%" }} />
                                </Col>

                                <Col xs={6} sm={4}>

                                    <Form.Group  >
                                        <Form.Label style={{ fontSize: "17px", fontWeight: "bold", marginTop: "15px" }}>Country Name</Form.Label>
                                        <CountrySelect
                                            value={country_object}
                                            onChange={this.countryChange}
                                            valueAs='name'
                                        />
                                    </Form.Group>
                                </Col>

                                {/* <Col xs={6} sm={4}>
                                    <Form.Group  >
                                        <Form.Label style={{ fontSize: "17px", fontWeight: "bold", marginTop: "15px" }}>Status</Form.Label>
                                        <Form.Control as="select" name="status" placeholder="status" value={status} id="status" onChange={this.onChange} >
                                            <option value="" disabled>Status</option>
                                            <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col> */}
                            </Row>
                            <Row className="row justify-content-md-center" style={{ marginTop: "15%" }}>
                                <CustomButton btnType="reset" BtnTxt="Add" disabledButton={country_id !== null} ClickEvent={this.onSubmit} />
                                {/* <CustomButton btnType="reset" BtnTxt="Update" disabledButton={country_id === null} ClickEvent={this.onUpdate} /> */}
                                <CustomButton btnType="reset" BtnTxt="Delete" disabledButton={country_id === null} ClickEvent={this.onDelete} />
                                {/* <CustomButton btnType="reset" BtnTxt="Cancel" ClickEvent={this.onCancel} /> */}
                            </Row>
                        </Form>
                    </Card>
                </div>
            </div>
        )
    }
}
