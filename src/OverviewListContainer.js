import React from "react";
import OverviewList from "./OverviewList";
import PropTypes from "prop-types";
import Unsplash, { toJson } from 'unsplash-js';
import InfiniteScroll from "react-infinite-scroll-component";
import './App.css';

let pageNumber = 1;

class OverviewListContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      imageList: [],
      totalPageCount: 0,
      display: false
    }
  }
  static childContextTypes = {
    customElement: PropTypes.any
  };
  getImagesBasedOnPageNumber = (pageNumber) => {
    const unsplash = new Unsplash({ accessKey: "BURekbB-GgxPe9EZdvX1aGO9y6IXMZGDHrjlDv7DYpc" });
    unsplash.photos.listPhotos(pageNumber, 30, "latest")
      .then(toJson)
      .then(images => {
        // console.log(images);
        this.setState({
          imageList: [...this.state.imageList, ...images],
          // containerHeight: this.state.containerHeight + 400
        })
      })
      .catch(err => {
        alert(err);
        console.error(err);
    })
  }
  componentDidMount() { 
    this.getImagesBasedOnPageNumber(pageNumber);
  }

  getChildContext() {
    const { container } = this.state;
    return {
      customElement: container
    };
  }
  handleLoadImages = (e) => {
    e.preventDefault();
    this.getImagesBasedOnPageNumber(pageNumber);
    // window.location.reload();
    this.setState({
      display: true
    });
    // window.location.reload();
  }
  render() {
    // if (this.state.imageList.length > 0) {
    if (this.state.display) {
      if (this.state.imageList.length > 0) {
        return (
          <InfiniteScroll
            dataLength={this.state.imageList.length}
            next={this.getImagesBasedOnPageNumber}
            hasMore={true}
            // loader={<h4>Loading...</h4>}
          >
            <OverviewList
            items={this.state.imageList}
            showImages = {this.state.display}
            />
          </InfiniteScroll> 
        ); 
      }
      else {
        return (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <h1 className="ml12">Loading Photos</h1>
          </div>
        )
      }
    }
    else {
      return (
        <div>
          <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
            }}>
              <a href="!" onClick={this.handleLoadImages} className="Center-btn">
                <span>Explore</span>
                <div class="liquid"></div>
              </a>
          </div>
        </div>
      )
    }
  }
}

export default OverviewListContainer;
