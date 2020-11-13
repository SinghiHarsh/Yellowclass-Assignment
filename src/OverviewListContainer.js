import React from "react";
import OverviewList from "./OverviewList";
import PropTypes from "prop-types";
import Unsplash, { toJson } from 'unsplash-js';
import InfiniteScroll from "react-infinite-scroll-component";

let pageNumber = 1;

class OverviewListContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      imageList: [],
      totalPageCount: 0,
      containerHeight: 1000
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
          containerHeight: this.state.containerHeight + 400
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

  render() {
    if (this.state.imageList.length > 0) {
      return (
        <div>
          <InfiniteScroll
            dataLength={this.state.imageList.length}
            next={this.getImagesBasedOnPageNumber}
            hasMore={true}
            loader={<h4>Loading...</h4>}
          >
            <OverviewList
              items={this.state.imageList}
              height={this.state.containerHeight}

            />
          </InfiniteScroll>
        </div>
      );
    }
    else {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems:'center'
        }}>
          <p>Hello World</p>
        </div>
      )
    }
  }
}

export default OverviewListContainer;
