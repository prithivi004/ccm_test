import React, { Component } from 'react'
import { Accordion, Icon,Popup,Pagination } from 'semantic-ui-react'
import {Table} from 'react-bootstrap'

export default class SearchAccordion extends Component {
    constructor(props){
        super(props)

        
    }
  state = { 
    activeIndex: 0,
    activePage: 1
   }

   handlePaginationChange = (e, { activePage }) => {
     this.setState({ activePage })
     this.props.pagination(activePage)
   }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  render() {
    const { activeIndex,activePage } = this.state
    console.log(activePage,'active')
    return (
        <div style={{marginTop:20}}>
      <Accordion fluid styled>
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={this.handleClick}
        >
          <Icon name='dropdown' />
         Quotation <span style={{backgroundColor:'yellow'}}>{this.props.list.length} results</span>
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
        <Table style={{ backgroundColor: "white" }} responsive>
                                    <thead>
                                        <tr>
                                            <th>EDIT</th>
                                            <th>VIEW_INV</th>
                                            <th >QUOTE NO</th>
                                            <th >DATE ISSUED</th>
                                            <th >CLIENT</th>
                                            <th >DESCRIPTION</th>
                                            <th style={{textAlign:'right'}}>QUOTE AMT</th>
                                            <th >QUOTE APPROVAL</th>
                                            <th>CLIENT PO</th>
                                            <th>MARGIN %</th>
                                            <th style={{textAlign:'right'}}>MARGIN AMT</th>
                                            <th>CCM TKT NO</th>
                                            <th>COMPLETION DATE</th>
                                            <th>DELETE</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {quotation_list.map(this.renderTable)} */}
                                        {this.props.list.length !== 0 && this.props.list.map((quote, i) =>
                                            <>
                                                <tr key={quote.quotation_num}
                                                
                                                    className={quote.job_complete_date !== '0000-00-00'? "greenish" : ""}
                                                    onClick={() => this.props.childQuote(quote.id)}
                                                    style={{ height: "50px", padding: "10px" }}
                                                    >
                                                    
                                                    <td>
                                                    {/* <Link to={`/editQuotation/${quote.id}`}> */}
                                                    <button onClick={() => this.props.renderComponent(quote.id)} className='buttonStyle'><i className='green edit link icon' style={{ fontSize: "18px", }} ></i></button>
                                                    {/* </Link> */}
                                                    </td>
                                                    <td><button onClick={()=>this.props.paymentChange(quote.id)} className='buttonStyle'><i className='fa fa-book' style={{ fontSize: "18px", color: "blue", margin: '5px' }} ></i></button></td>
                                                    {quote.sub_list == 0 ?<td> {quote.quotation_num} </td>:
                                                    <Popup content="View Child Quote" trigger={<td style={{cursor:'pointer'}}> {quote.quotation_num} </td>}/>}
                                                    
                                                    <td >{quote.qut_date_issue !== '0000-00-00' ? quote.qut_date_issue.replace(/(\d{4})-(\d{1,2})-(\d{1,2})/g,"$3/$2/$1") : ''}  </td>
                                                    <td >{this.props.clientName(quote.client_id)} </td>
                                                    <td >{quote.description} </td>
                                                    <td style={{textAlign:'right'}}>{quote.quotation_amt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </td>
                                                    <td >{quote.qut_status === '1' ? 'Approved' : quote.qut_status === '2' ? 'Pending' : quote.qut_status === '3' ? 'Canceled' : quote.qut_status === '4' ? 'Rejected' : ''} </td>
                                                    <td > {quote.client_po} </td>
                                                    {parseInt(quote.margin_amount) > 0 ?
                                                        <>
                                                            <td>{quote.qut_status === '1' ?
                                                                `${quote.margin}%`:''} </td>
                                                            <td style={{textAlign:'right'}}>{quote.qut_status === '1' ?
                                                                quote.margin_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):''} </td>
                                                        </>
                                                        : parseInt(quote.margin_amount) === 0 ?
                                                            <>
                                                                <td >0 %</td>
                                                                <td >0.00</td>
                                                            </> :
                                                            <>
                                                                <td ></td>
                                                                <td style={{ color: 'red',textAlign:'right' }} >{quote.qut_status === '1' ?
                                                                    quote.margin_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):''} </td>
                                                            </>}
                                                    <td >{quote.ticket_no !== '0' ? quote.ticket_no : ''} </td>
                                                    <td >{quote.job_complete_date !== '0000-00-00' ? quote.job_complete_date.replace(/(\d{4})-(\d{1,2})-(\d{1,2})/g,"$3/$2/$1") : ''} </td>
                                                    <td><button onClick={(e) => this.props.trashQuote(quote.id, quote.client_invoice_id, quote.cont_invoice_id, 'parent',quote.sub_list)} className='buttonStyle'><i className='fa fa-trash' style={{ fontSize: "18px", color: "red", margin: '5px' }} ></i></button></td>
                                                </tr>
                                                <React.Fragment >
                                                    {(this.props.visible === true && this.props.visibleParent == quote.id) && this.props.childQuote_list.map(child =>
                                                        <tr key={child.quotation_num}
                                                            className="rowtable"
                                                            style={{ height: "50px", padding: "10px" }}>
                                                            <td><button onClick={() => this.props.renderComponent(child.id)} className='buttonStyle'><i className='green edit link icon' style={{ fontSize: "18px", backgroundColor: '#C3E7FB' }} ></i></button></td>
                                                            <td><button onClick={()=>this.props.paymentChange(child.id,"child")} className='buttonStyle'><i className='fa fa-book' style={{ fontSize: "18px", color: "blue", margin: '5px' }} ></i></button></td>
                                                            <td > {child.quotation_num} </td>
                                                            <td >{child.qut_date_issue !== '0000-00-00' ? child.qut_date_issue.replace(/(\d{4})-(\d{1,2})-(\d{1,2})/g,"$3/$2/$1") : ''}  </td>
                                                            <td >{this.props.clientName(child.client_id)} </td>
                                                            <td >{child.description} </td>
                                                            <td  style={{textAlign:'right'}}>{child.quotation_amt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </td>
                                                            <td >{child.qut_status === '1' ? 'Approved' : child.qut_status === '2' ? 'Pending' : child.qut_status === '3' ? 'Canceled' : child.qut_status === '4' ? 'Rejected' : ''} </td>
                                                            <td > {child.cont_po_num} </td>
                                                            {parseInt(child.margin_amount) > 0 ?
                                                                <>
                                                                    <td>{quote.qut_status === '1' ?
                                                                        `${child.margin}%`:''} </td>
                                                                    <td  style={{textAlign:'right'}}>{quote.qut_status === '1' ?
                                                                        child.margin_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):''} </td>
                                                                </>
                                                                : parseInt(child.margin_amount) === 0 ?
                                                                    <>
                                                                        <td ></td>
                                                                        <td ></td>
                                                                    </> : <>
                                                                        <td ></td>
                                                                        <td style={{ color: 'red',textAlign:"right" }} >{quote.qut_status === '1' ?
                                                                            child.margin_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):''} </td>
                                                                    </>}
                                                            <td >{child.ticket_no !== '0' ? child.ticket_no : ''} </td>
                                                            <td >{child.job_complete_date !== '0000-00-00' ? child.job_complete_date.replace(/(\d{4})-(\d{1,2})-(\d{1,2})/g,"$3/$2/$1") : ''} </td>
                                                            <td><button onClick={(e) => this.props.trashQuote(child.id, child.client_invoice_id, child.cont_invoice_id, 'child')} className='buttonStyle'><i className='fa fa-trash' style={{ fontSize: "18px", color: "red", margin: '5px', backgroundColor: '#C3E7FB' }} ></i></button></td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            </>
                                        )}
                                    </tbody>
                                </Table>
                                {/* <div style={{display:'flex',alignItems:'center',justifyContent:'center',marginTop:"50px"}}>
                                <button  style={{
                                        marginLeft:"20px",
                                        border:"5px solid white",
                                        backgroundColor:"#4A88DC",
                                        padding:"10px",
                                        color:"white",
                                        borderRadius:"10px"
                                        }}
                                        onClick={()=>this.props.pagination('dec')}><i className="fa fa-arrow-left" style={{fontSize:"15px"}}></i></button>
                                <p style={{marginLeft:"20px",fontSize:"18px",marginTop:"15px"}}>{this.props.pagenumber}</p>
                                <button 
                                    style={{
                                        marginLeft:"20px",
                                        border:"5px solid white",
                                        backgroundColor:"#4A88DC",
                                        padding:"10px",
                                        color:"white",
                                        borderRadius:"10px"
                                        }}
                                        onClick={()=>this.props.pagination('inc')}><i className="fa fa-arrow-right" style={{fontSize:"15px"}}></i></button>
                            </div> */}
                            <div style={{marginLeft:550}}>
                            <Pagination defaultActivePage={activePage}  onPageChange={this.handlePaginationChange} totalPages={this.props.totalPages} />
                            </div>
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 1}
          index={1}
          onClick={this.handleClick}
        >
          <Icon name='dropdown' />
         Contractor PO
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          <p>
            There are many breeds of dogs. Each breed varies in size and
            temperament. Owners often select a breed of dog that they find to be
            compatible with their own lifestyle and desires from a companion.
          </p>
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 2}
          index={2}
          onClick={this.handleClick}
        >
          <Icon name='dropdown' />
         Invoice {this.props.list.length} results
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
          <p>
            Three common ways for a prospective owner to acquire a dog is from
            pet shops, private owners, or shelters.
          </p>
          <p>
            A pet shop may be the most convenient way to buy a dog. Buying a dog
            from a private owner allows you to assess the pedigree and
            upbringing of your dog before choosing to take it home. Lastly,
            finding your dog from a shelter, helps give a good home to a dog who
            may not find one so readily.
          </p>
        </Accordion.Content>
        <Accordion.Title
          active={activeIndex === 3}
          index={1}
          onClick={this.handleClick}
        >
          <Icon name='dropdown' />
         Credits
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 3}>
          <p>
            There are many breeds of dogs. Each breed varies in size and
            temperament. Owners often select a breed of dog that they find to be
            compatible with their own lifestyle and desires from a companion.
          </p>
        </Accordion.Content>
      </Accordion>
      </div>
    )
  }
}