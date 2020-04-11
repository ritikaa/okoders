import React, { Component } from 'react';
import './App.css';
import { URL } from "./constant";

const filterKeyMap = {
  searchTitle: 'title',
  searchUrl: 'url',
  searchAuthor: 'author'
};

class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      counter: 0,
      hits: [],
      searchTitle: '',
      searchUrl: '',
      searchAuthor: '',
      filteredData: [],
      modalData: '',
      modalOpen: false
    }
  }

  componentWillMount() {
    this.getHits();
    this.interval = setInterval(() => {
      this.getHits();
    },10000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  async getHits() {
    const res = await fetch(URL);
    res.json()
      .then(res => this.setState({
        hits: res.hits,
        filteredData: res.hits,
        counter: this.state.counter+1,
      }));
    //console.log(this.state.hits);
    //console.log(this.state.counter);
  }

  handleClick = (index)  => {
    //console.log(index);
    const { hits } = this.state;
    const foundData = hits.find((el,index) => el);
    console.log(foundData);
    this.setState({
       modalData : foundData,
        modalOpen: true,
    })
    // const { hits } = this.state;
    // let modalFind = hits.find(index);
    // console.log(modalFind);
    // this.setState({
    //   modalData: hits.find(index)
    // })
  };

  handleChange  = (event) => {
    const { name, value} = event.target;
    const { hits } = this.state;
    const _key = filterKeyMap[name];
    const filteredData = hits.filter(item => (item[_key]).includes(value));
    this.setState({
      [name]: value,
      filteredData
    });
  };

  render() {
    return (
      <div className="wrapper">
        <div>
          <h4>Search By : </h4>
          <form>
              <label htmlFor="searchTitle">
                Title :
              </label>
              <input
                type="text"
                id="searchTitle"
                name="searchTitle"
                onChange={this.handleChange}
                value={this.state.searchTitle}
              />

              <label htmlFor="searchUrl">
                URL :
              </label>
              <input
                type="text"
                name="searchUrl"
                id="searchUrl"
                onChange={this.handleChange}
                value={this.state.searchUrl}
              />

              <label htmlFor="searchAuthor">
                Author
              </label>
              <input
                type="text"
                id="searchAuthor"
                name="searchAuthor"
                onChange={this.handleChange}
                value={this.state.searchAuthor}
              />
            <div>
              <h4>Filter By : </h4>
            </div>
            {/*<button*/}
            {/*  type="button"*/}
            {/*  onClick={this.handleClick}*/}
            {/*>*/}
            {/*  Get Data*/}
            {/*</button>*/}
            <div>
              <p>Counter : {this.state.counter}</p>
            </div>
            {
              this.state.modalOpen &&
                <p>{this.state.modalData.title}<br/>{this.state.modalData.url}<br/>{this.state.modalData["created_at"]}<br/>{this.state.modalData.author}</p>
            }
            <table>
              <thead>
              <tr>
                <th>Title</th>
                <th>URL</th>
                <th>Created At</th>
                <th>Author</th>
              </tr>
              </thead>
              <tbody>
              {
                this.state.filteredData.map((hit,index) => {
                  return <tr key={index} onClick={() => this.handleClick(index)}>
                    <td>{hit.title}</td>
                    <td>{hit.url}</td>
                    <td>{hit["created_at"]}</td>
                    <td>{hit.author}</td>
                  </tr>
                })
              }
              </tbody>
            </table>
          </form>
        </div>
      </div>
    );
  }
}

export default App;
