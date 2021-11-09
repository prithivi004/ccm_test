import React, { Component } from 'react'
import { Card, Form, Row, Col, Button, Image } from 'react-bootstrap'
import Logo from './img/logo-light.png'
import axios from 'axios'
import CustomTextBox from './utils/TextBox'
import { Alert } from './utils/Utilities'
import axiosInstance from './utils/axiosinstance'
import { useHistory } from 'react-router-dom'

export class NewUserPwd extends Component {
    constructor(props) {
        super(props)

        this.state = {
            Password: '',
            ConfirmPassword: '',
            hash:''
        }
    }
    componentDidMount(){
        const url=new URL(window.location.href)
        const hash=url.searchParams.get('hash')
        if (hash===null) {
            window.location.replace('/')
        }
        // console.log(hash)
        this.setState({
            hash:hash
        })
    }
    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    onSubmit = () => {
        const { Password, ConfirmPassword, hash} = this.state

        if (Object.values(this.state).every(x => x)) {
            if (Password !== ConfirmPassword) {
                Alert("error", "Oops", "Password Mismatched!")
                return
            }
            const data = {password: Password, confirm_password: ConfirmPassword, hash:hash }
            axiosInstance.post(`https://ccmanagement.group/quote_api/public/login/activation`,data,{
                auth: {
                username: 'ccm_auth',
                password: 'ccm_digi123#'
                },
            })
                .then((res) => {

                    if(res.data.message.error === undefined){
                        Alert("success", "Success", `${res.data.message.success}`)
                        setTimeout(()=>{
                            window.location.replace('/')
                        },2000)
                    }
                    else{
                        Alert("error","Warning",`${res.data.message.error}`)
                    }
                    // console.log(res.data)

                })
        }
    }

    render() {
        const { Password, ConfirmPassword} = this.state
        return (
            <div>
                <div className="component">
                    <Card border="dark" sm={6} >
                        <Row>
                            <Col sm={4}>
                                <Image src={Logo} rounded style={{ width: "100px", marginLeft: "30%", marginTop: "20%" }} />
                            </Col>
                            <Col sm={4} style={{ marginTop: '50px' }}>
                                <CustomTextBox
                                    txtBoxLabel="Password"
                                    txtBoxType="password"
                                    txtBoxName="Password"
                                    txtBoxValue={Password}
                                    txtBoxPH="Password"
                                    changeEvent={this.onChange}
                                /><br/>
                                <CustomTextBox
                                    txtBoxLabel="Confirm Password"
                                    txtBoxType="password"
                                    txtBoxName="ConfirmPassword"
                                    txtBoxValue={ConfirmPassword}
                                    txtBoxPH="ConfirmPassword"
                                    changeEvent={this.onChange}
                                />
                            </Col>
                        </Row>
                        <Row className='d-flex justify-content-center' style={{ marginTop: "4%" }}>
                            <Button onClick={this.onSubmit}>Save</Button>
                        </Row>
                    </Card>
                </div>
            </div>
        )
    }
}


export default NewUserPwd

