import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import crossButton from './assets/cancel.svg';
import "./modal.css";

const settings = {
    dots: false
}
class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    handleModal = (e) => {
    }
    handleChange = (e) => {
        this.setState({
            typedCode: e.target.value
        })
    }
    render() {
        console.log(this.props);
        return (
            <div className="Modal-popup"
                style={{
                    display: this.props.showModal === true ? 'block' : 'none'
                }}
            >
                <div className="Modal-content"
                    style={{
                        display: this.props.showModal === true ? 'block' : 'none'
                    }}
                >
                    <img style={{
                        height:'20px',
                        width: '20px',
                        float: 'right',
                        marginLeft: '20px',
                        marginTop: '-30px',
                        cursor: 'pointer'
                    }}
                        alt={"Header"}
                        onClick={() => {this.props.handleCloseModal()}}
                        src={crossButton} />
                    <div><span style={{
                        color: '#fff'
                    }}>{this.props.userImages.length > 0 ? 'Photos by, ' + this.props.userImages[0].user.first_name : ''}</span></div>
                    <Slider {...settings}>
                        {
                            this.props && this.props.userImages.length > 0 ? 
                                this.props.userImages.map(el => {
                                    return (
                                        <div key={el.id}
                                            style={{
                                                display: this.props.showModal === true ? 'flex' : 'none'
                                            }}
                                        >
                                            <img alt={"Gallery"} src={el.urls.regular}/>
                                        </div>
                                    )
                                })
                                : (
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems:'center'
                                    }}>
                                        <p style={{color: 'white'}}>No user images available</p>
                                    </div>
                            )
                        }
                    </Slider>
                </div>
            </div>
        )
    }
}
export default Modal;