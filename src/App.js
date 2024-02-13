import React, { Component } from 'react';
import axios from 'axios';

import Search from './Search';
import Table from './Table';
import Loading from './Loading';
import Login from './Login/Login';

import './App.css';

const DEFAULT_QUERY = '';
const DEFAULT_HPP = 100;

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const withLoading = Component => ({ isLoading, ...rest }) =>
  isLoading ? <Loading /> : <Component {...rest} />;

const TableWithLoading = withLoading(Table);

class App extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false,
      click: 0 // Add click state
    };
  }

  onDismiss = objectID => {
    const isNotId = item => item.objectID !== objectID;
    const updatedHits = this.state.results[this.state.searchKey].hits.filter(
      isNotId
    );
    this.setState({
      results: {
        [this.state.searchKey]: {
          ...this.state.results[this.state.searchKey],
          hits: updatedHits
        }
      }
    });
  };

  onSearchChange = event => {
    this.setState({ searchTerm: event.target.value });
  };

  setSearchTopStories = result => {
    const { hits, page } = result;
    const { searchKey, results } = this.state;

    const oldHits =
      results && results[searchKey] ? results[searchKey].hits : [];

    const updatedHits = [...oldHits, ...hits];

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      },
      isLoading: false
    });
  };

  onSearchSubmit = event => {
    event.preventDefault();

    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
  };

  fetchSearchTopStories = (searchTerm, page = 0) => {
    this.setState({ isLoading: true });
    axios(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then(result => {
        // Limit the number of articles to 90
        const limitedResult = {
          ...result.data,
          hits: result.data.hits.slice(0, 90)
        };
        this._isMounted && this.setSearchTopStories(limitedResult);
      })
      .catch(error => this._isMounted && this.setState({ error }));
  };

  componentDidMount() {
    this._isMounted = true;

    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    this.fetchSearchTopStories(searchTerm);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  needsToSearchTopStories = searchTerm => {
    return !this.state.results[searchTerm];
  };

  // Update the click state
  updateClickState = click => {
    this.setState({ click });
  };

  render() {
    const {
      searchTerm,
      searchKey,
      results,
      error,
      isLoading,
      click // Add click state
    } = this.state;
    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];

    return (
      <div className="page">
        <div className="interactions">
          <Search
            searchTerm={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
            onClick={this.updateClickState} // Pass the callback function
          >
            Search
          </Search>
        </div>
        {click === 1 ? (
          <Login /> // Render Login component if click is 1
        ) : (
          <React.Fragment>
            {error ? (
              <div className="interactions">
                <p>Something went wrong!</p>
              </div>
            ) : (
              <TableWithLoading
                list={list}
                onDismiss={this.onDismiss}
                isLoading={isLoading}
              />
            )}
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default App;
