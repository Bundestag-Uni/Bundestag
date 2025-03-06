import React from "react";
import classes from "../styles/gallery.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import { keyframes } from "styled-components";
import '@fortawesome/fontawesome-free/css/all.min.css';

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    // responsive: [
    //   {
    //     breakpoint: 1300,
    //     settings: {
    //       slidesToShow: 2,
    //       slidesToScroll: 1,
    //       initialSlide: 1,
    //     },
    //   },
    //   {
    //     breakpoint: 800,
    //     settings: {
    //       slidesToShow: 1,
    //       slidesToScroll: 1,
    //     },
    //   },
    // ],
  };
  
  function Arrow(props) {
    let className = props.type === "next" ? "nextArrow" : "prevArrow";
    className += " arrow";
    const char =
      props.type === "next" ? (
        <i className="fas fa-chevron-right"></i>
      ) : (
        <i className="fas fa-chevron-left"></i>
      );
    return (
      <span className={className} onClick={props.onClick}>
        {char}
      </span>
    );
  }
  
  const Gallery = () => {
    return (
      <div
        style={{
          marginTop: "2rem",
          backgroundColor: "transparent",
          padding: "4rem",
        }}
      >
        <Slider
          {...settings}
          arrows={true}
          accessibility={true}
          prevArrow={<Arrow type="prev" />}
          nextArrow={<Arrow type="next" />}
        >
          <div>
            <div
              className={classes.gallery1}
              onMouseOver={() => {
                console.log("HOVER");
              }}>
              <p>
                Slide1
              </p>
            </div>
          </div>
          <div>
            <p>
              Slide2
            </p>
          </div>
        </Slider>
      </div>
    );
  };
  
  export default Gallery;