import React from "react";
import {
  CellMeasurer,
  CellMeasurerCache,
  AutoSizer,
  WindowScroller,
  Masonry
} from "react-virtualized";
import createCellPositioner from "./createCellPositioner";
import Unsplash, { toJson } from 'unsplash-js';
import PropTypes from "prop-types";
import Modal from './Modal';
import "./App.css";

class OverviewList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columnWidth: 200,
      height: 300,
      gutterSize: 10,
      showModal: false,
      userImagesList: [],
      blur: false
    };

    this._cache = new CellMeasurerCache({
      defaultHeight: 250,
      defaultWidth: 200,
      fixedWidth: true
    });

    this._onResize = this._onResize.bind(this);
    this._cellRenderer = this._cellRenderer.bind(this);
    this._setMasonryRef = this._setMasonryRef.bind(this);
    this._calculateColumnCount = this._calculateColumnCount.bind(this);
    this._resetCellPositioner = this._resetCellPositioner.bind(this);
    this._handleOpenModal = this._handleOpenModal.bind(this);
  }

  _calculateColumnCount() {
    const { columnWidth, gutterSize } = this.state;

    this._columnCount = Math.floor(this._width / (columnWidth + gutterSize));
  }

  _handleOpenModal(imageDetails) {
    let userName = imageDetails.user.username;
    const unsplash = new Unsplash({ accessKey: "BURekbB-GgxPe9EZdvX1aGO9y6IXMZGDHrjlDv7DYpc" });
    unsplash.users.photos(userName, 1, 10, "latest", { orientation: "landscape" })
    .then(toJson)
    .then(userImages => {
      this.setState({
        showModal: true,
        userImagesList: userImages,
        selectedImage: ''
      })
    })
    .catch(err => {
      alert(err);
      console.error(err);
    })
  }

  handleCloseModal = () => {
    this.setState({showModal: false})
  }

  _cellRenderer({ index, key, parent, style }) {
    const { items } = this.props;
    const { columnWidth } = this.state;
    console.log(items);
    if (items.length > 0) {
      const datum = items[index % items.length];
        return (
          <CellMeasurer cache={this._cache} index={index} key={key} parent={parent}>
            <div
              style={{
                ...style,
                width: columnWidth,
                marginLeft: '30px',
                marginTop: '15px',
              }}
            >
              <div
                className="HoverElement"
                style={{
                  width: "100%",
                  fontSize: 50,
                  // padding: '10px 20px',
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  alt={"Not available"}
                  id={"img-selected"}
                  className="blur-Image"
                  style={{
                    borderRadius: '15px',
                    cursor: 'pointer',
                  }}
                  onClick={() => this._handleOpenModal(datum)}
                  src={datum.urls.thumb} />
              </div>
            </div>
          </CellMeasurer>
        );
    }
    else {
      return (
        <p>Nill</p>
      )
    }
  }

  static contextTypes = {
    customElement: PropTypes.any
  };

  _setMasonryRef(ref) {
    this._masonry = ref;
  }

  _onResize({ width }) {
    this._width = width;

    this._calculateColumnCount();
    this._resetCellPositioner();
    this._masonry.recomputeCellPositions();
  }

  _initCellPositioner() {
    if (typeof this._cellPositioner === "undefined") {
      const { columnWidth, gutterSize } = this.state;

      this._cellPositioner = createCellPositioner({
        cellMeasurerCache: this._cache,
        columnCount: this._columnCount,
        columnWidth,
        spacer: gutterSize
      });
    }
  }

  _resetCellPositioner() {
    const { columnWidth, gutterSize } = this.state;

    this._cellPositioner.reset({
      columnCount: this._columnCount,
      columnWidth,
      spacer: gutterSize
    });
  }

  render() {
    console.log(this.state);
    this._initCellPositioner();
    return (
      <>
      <WindowScroller scrollElement={this.context.customElement}>
        {({ height, isScrolling, registerChild, scrollTop }) => (
          <AutoSizer
            disableHeight
            height={height}
            onResize={this._onResize}
            overscanByPixels={0}
            scrollTop={scrollTop}
          >
            {({ width }) => (
              <Masonry
                autoHeight
                cellCount={this.props.items.length}
                cellMeasurerCache={this._cache}
                cellPositioner={this._cellPositioner}
                cellRenderer={this._cellRenderer}
                height={this.props.height}
                overscanByPixels={0}
                ref={this._setMasonryRef}
                scrollTop={scrollTop}
                width={width}
              />
            )}
          </AutoSizer>
        )}
      </WindowScroller>
        {
          this.state.showModal ? <Modal
            showModal={this.state.showModal} 
            handleCloseModal={this.handleCloseModal}
            userImages = {this.state.userImagesList}
            /> : null
        }
      </>
    );
  }
}

export default OverviewList;
