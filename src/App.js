import React, { Component } from 'react';
import './App.css';
import { URL } from "./constant";
import Modal from 'react-modal';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

Modal.setAppElement('#root');

const filterKeyMap = {
  searchTitle: 'title',
  searchUrl: 'url',
  searchAuthor: 'author',
};

class App extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      counter: 0,
      hits: [],
      searchTitle: '',
      searchUrl: '',
      searchAuthor: '',
      filteredData: [],
      modalData: '',
      modalOpen: false,
      fetchedHits: [],
    }
  }

  componentDidMount() {
    this.getHits();
  }

  async getHits() {
    const { hits, counter } = this.state;
    const res = await fetch( URL( counter ) );
    res.json()
       .then( res => this.setState( {
         hits: [...hits, ...res.hits],
         filteredData: [...hits, ...res.hits]
       } ) );
  }

  handleClick = ( index ) => {
    const { hits } = this.state;
    const foundData = hits[index];
    this.setState( {
      modalData: foundData,
      modalOpen: true,
    } );
  };

  closeModal = () => {
    this.setState( {
      modalOpen: false,
      modalData: '',
    } )
  };

  handleChange = ( event ) => {
    const { name, value } = event.target;
    const { hits } = this.state;
    const _key = filterKeyMap[name];
    const filteredData = hits.filter( item => (item[_key]).includes( value ) );
    this.setState( {
      [name]: value,
      filteredData
    } );
  };

  handlePrev = () => {
    this.setState( {
      counter: this.state.counter >= 0 ? this.state.counter - 1 : this.setState( { counter: 0 } )
    }, () => {
      this.getHits();
    } );
  }

  handleNext = () => {
    this.setState({
      counter: this.state.counter + 1,
    }, () => {
      this.getHits();
    })
  };

  render() {
    let { searchTitle, searchUrl, searchAuthor, filteredData, modalOpen, modalData } = this.state;

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
              value={searchTitle}
            />

            <label htmlFor="searchUrl">
              URL :
            </label>
            <input
              type="text"
              name="searchUrl"
              id="searchUrl"
              onChange={this.handleChange}
              value={searchUrl}
            />

            <label htmlFor="searchAuthor">
              Author
            </label>
            <input
              type="text"
              id="searchAuthor"
              name="searchAuthor"
              onChange={this.handleChange}
              value={searchAuthor}
            />
            {
              modalOpen && modalData &&
              <Modal
                isOpen={modalOpen}
                onRequestClose={this.closeModal}
                style={customStyles}
                contentLabel="Example Modal"
              >
                <button onClick={this.closeModal} style={{color: 'red', border: 0, cursor: 'pointer'}}>close</button>
                <p>Title : {modalData.title}<br/> URL : {modalData.url}<br/> Created At : {modalData["created_at"]}<br/> Author : {modalData.author}</p>
              </Modal>
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
                filteredData.map((hit,index) => {
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
            <div className="inline-block">
              <p>Counter : {this.state.counter}</p>
              <div className="pagination">
                <button
                  type="button"
                  onClick={this.handlePrev}
                > &lt; Prev</button>
                <span> || </span>
                <button
                  type="button"
                  onClick={this.handleNext}
                >Next &gt; </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default App;