import React, { Component } from "react";
import Pagination from "react-js-pagination";
const request = require('superagent');


class Main extends Component {
    constructor(props) {
        super(props);
		this.state = {
            statusMessages: '',
            messageType:'',
            searchName: '',
            searchableData: [],
            statusBook:'',
            activePage: 1,
            activepagevalue: '',
            totalrecordscount: '',
            pageNumber: 1,
            show:false,
            showList:false,
        }
        this.handleChange =this.handleChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
    }
    
    componentDidMount() {
        this.handlePageChange(1);
    }
    
    handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        this.setState({activePage: pageNumber});
        request.get('https://server--app-test.repl.co/book/list/' + this.state.searchName + '/' + pageNumber)
        .set('Accept', 'application/json')
        .send()
        .end((error, response) => {
            if (error) {
                this.setState({ statusMessages: 'Error could not get book list', messageType: 'danger' })
            } else {
                var r = JSON.parse(response.text);
                if(r.GoodreadsResponse.search.results){
                    this.setState({ searchableData : r.GoodreadsResponse.search.results.work, 
                        activePage: r.GoodreadsResponse.search["results-start"],
                        totalrecordscount: r.GoodreadsResponse.search["total-results"], 
                        activepagevalue: pageNumber,
                        show:true,
                        showList:true }, () => {});
                }else{
                    setTimeout(
                        function() {
                            this.setState({ statusBook: 'Sorry Book not found! Please try again.' });
                        }
                        .bind(this),
                        2000
                    );
                    
                }
            }   
        });
    }

    handleChange(e) {
        this.setState({ searchName: e.target.value });
        this.setState({ statusBook : ''});
        this.setState({showList:false});
        this.setState({show:false});
        // this.handleSearch(this.state.pageNumber);
    }
    
    handleSearch(pageNumber){
        request.get('https://server--app-test.repl.co/book/list/' + this.state.searchName + '/' + this.state.activePage)
        .set('Accept', 'application/json')
        .send()
        .end((error, response) => {
            if (error) {
                this.setState({ statusMessages: 'Error could not get book list', messageType: 'danger' })
            } else {
                var r = JSON.parse(response.text);
                if(r.GoodreadsResponse.search.results){
                    this.setState({ searchableData : r.GoodreadsResponse.search.results.work, 
                        activePage: r.GoodreadsResponse.search["results-start"],
                        totalrecordscount: r.GoodreadsResponse.search["total-results"], 
                        activepagevalue: pageNumber,
                        show:true,
                        showList:true }, () => {});
                }else{
                    setTimeout(
                        function() {
                            this.setState({ statusBook: 'Sorry Book not found! Please try again.' });
                        }
                        .bind(this),
                        2000
                    );
                    
                }
            }   
        });  
    }
  render() {
    const { searchableData } = this.state;
    const { statusBook }  = this.state;
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                <h4>Book Search here..</h4>
                    <form className="">
                        <div className="col-md-6 ">
                            <div className="form-group topl">
                                <label>By Book name:</label>
                                <input type="searchName" name="searchName" id="searchName" className="form-control" value={this.state.searchName} onChange={this.handleChange} placeholder="Search"/>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <button type="button" className="btn btn-outline-success" onClick={this.handleSearch.bind(this)}><i className="fa fa-search"></i> Search</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="col-xs-12">
                <div className="wbox contacts-list ">
                {searchableData.map((_book) => {
                            return (
                                <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                                    {this.state.showList &&
                                        <div className="product-card">
                                            <div className="product-image">
                                                    <img src={_book.best_book.image_url}/>
                                            </div>
                                            <div className="product-info">
                                                <h5>{_book.best_book.title}</h5>
                                            </div>
                                            <div className="product-info">
                                                <h5> Author by <strong>{_book.best_book.author.name}</strong></h5>
                                            </div>
                                        </div>
                                    }
                                </div>
                            );
                        })
                    }
                    <div className="alert alert-light" role="alert">
                        {statusBook}
                    </div>
                    {this.state.show &&
                        <div className="pagination clear padding-top-20 padding-left-20">
                            <Pagination
                                activePage={this.state.activePage}
                                className="paginationdata"
                                itemsCountPerPage={50}
                                totalItemsCount={this.state.totalrecordscount}
                                pageRangeDisplayed={20}
                                onChange={this.handlePageChange}
                            />
                        </div>
                    }
                </div>     
            </div>
        </div>
    );
  }
}
export default Main;