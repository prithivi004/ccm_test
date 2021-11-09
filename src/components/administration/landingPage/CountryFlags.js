import React from 'react'
import { Card,Row,Col } from 'react-bootstrap'
import ReactCountryFlag from 'react-country-flag'
import {getCode} from 'country-list'
export default function CountryFlags({country,onChange,id}) {

    return (
        <div>
            <Card style={{backgroundColor:"white",marginTop:"10px",maxWidth:500}}>
                <Row>
                    <Col lg={2} xs={2}>
                        {country == 'United States'?
                        <ReactCountryFlag countryCode={'US'} style={{fontSize:"25px"}} svg />:
                        <ReactCountryFlag countryCode={getCode(country)} style={{fontSize:"25px"}} svg />}
                    </Col>
                    <Col lg={8} xs={8}>
                        <h6 style={{cursor:"pointer"}} onClick={e=>onChange(id)}>{country}</h6>
                    </Col>
                </Row>
            </Card>
        </div>
    )
}
