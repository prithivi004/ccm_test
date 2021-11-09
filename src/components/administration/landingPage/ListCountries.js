import React from 'react'
import { Card,Row,Col,Form } from 'react-bootstrap'
import ReactCountryFlag from 'react-country-flag'
import {getCode} from 'country-list'

function ListCountries({country,remove,profile}) {
    return (
            // <div style={{backgroundColor:"#3A5F85",width:"200px",marginLeft:"20px",display:"flex",justifyContent:'center',alignItems:'center'}}>
            //     <ReactCountryFlag countryCode={getCode(country)} style={{fontSize:"25px"}} svg />
            //     <h6 style={{marginLeft:"10px"}}>{country}</h6>
            //  </div>
              <div className='ui yellow fluid card' style={{ width: '15rem' }}>
                <div className='content mx-sm-3' >
                  {/* <i className='ui flag th'></i> */}
                  {country == 'United States'?
                  <ReactCountryFlag countryCode={'US'} style={{fontSize:"25px"}} svg />:
                  <ReactCountryFlag countryCode={getCode(country)} style={{fontSize:"25px"}} svg />}
                  <Form.Label style={{marginLeft:"10px"}}>{country}</Form.Label>
                { profile === undefined? <button className="buttonStyle" style={{marginLeft:"20px"}} onClick={()=>remove(country)}><i className="fa fa-times"  style={{cursor:'pointer',color:'red'}}></i></button>:''}
                </div>
          </div>
    )
}

export default ListCountries
