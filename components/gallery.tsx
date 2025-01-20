import React from "react";
import classes from "../styles/gallery.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import { keyframes } from "styled-components";
import '@fortawesome/fontawesome-free/css/all.min.css';

const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
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
        className={classes.container}
        style={{
          marginTop: "5.3rem",
          backgroundColor: "transparent",
          padding: "5rem",
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
              }}
            >
              <p>
                Sublime Replenishing Night Masque
              </p>
              <p className={classes.paragraph}>
                Richly nourishing hydration for overnight use
              </p>
            </div>
          </div>
          <div>
            <div className={classes.gallery1}>
              <img
                className={classes.galleryImg2}
                alt="Img 2"
              ></img>
              <a href="#" className={classes.btnGallery}>
                Rōzu Eau de Parfum
              </a>
              <p className={classes.paragraph}>Floral, Green and Woody</p>
            </div>
          </div>
          <div>
            <div className={classes.gallery1}>
              <img
                className={classes.galleryImg3}
                alt="Img 3"
              ></img>
              <a href="#" className={classes.btnGallery}>
                The Chance Companion
              </a>
              <p className={classes.paragraph}>
                For fragnant, soft skin neck-to-toe
              </p>
            </div>
          </div>
          <div>
            <div className={classes.gallery1}>
              <img
                className={classes.galleryImg4}
                alt="Img 4"
              ></img>
              <a href="#" className={classes.btnGallery}>
                Aganice Aromatique Candle
              </a>
              <p className={classes.paragraph}>Cardamom, Mimosa, Tobacco</p>
            </div>
          </div>
          <div>
            <div className={classes.gallery1}>
              <img
                className={classes.galleryImg5}
                alt="Img 5"
              ></img>
              <a href="#" className={classes.btnGallery}>
                Parsley Seed Extented Anti-Oxidant Skin Care Kit
              </a>
              <p className={classes.paragraph}>
                Delivers potent doses of anti-oxidants
              </p>
            </div>
          </div>
          <div>
            <div className={classes.gallery1}>
              <img
                className={classes.galleryImg6}
                alt="Img 6"
              ></img>
              <a href="#" className={classes.btnGallery}>
                Rose Hair & Scalp Moisturising Masque
              </a>
              <p className={classes.paragraph}>
                Maintain scalp and hair in peak condition
              </p>
            </div>
          </div>
          <div className={classes.gallery1}>
            <img className={classes.galleryImg7} alt="Img 7"></img>
            <a href="#" className={classes.btnGallery}>
              Resurrection Duet
            </a>
            <p className={classes.paragraph}>Cleanse and nourish the hands</p>
          </div>
        </Slider>
      </div>
    );
  };
  
  export default Gallery;