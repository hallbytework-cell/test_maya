import React, { useState, useEffect, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import OptifiedImage from "@/components/OptimizedImageResponsive";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Slider = lazy(() => import("react-slick"));

const heroSlides = [
  // {
  //   imgSrc: "/images/banner/banner1.jpg",
  //   btn: { label: "Shop Now", link: "/category/plants" },
  // },
  {
    imgSrc: "https://res.cloudinary.com/dwdu18hzs/image/upload/v1768482996/universal_uploads/univ_1768482990232_0_1768482990232.avif",
    btn: { label: "Explore Plants", link: "/category/plants" },
  },
  {
    imgSrc: "https://res.cloudinary.com/dwdu18hzs/image/upload/v1769878067/universal_uploads/univ_1769878057874_0_1769878057874.avif",
    btn: { label: "Explore Plants", link: "/category/plants" },
  }
];

const heightClasses = "h-[30vh] md:h-[70vh]";

function HeroSkeleton() {
  return (
    <div className={`relative w-full ${heightClasses} bg-gray-200 animate-pulse rounded-lg flex items-center justify-center`}>
      <div className="text-gray-400 text-lg">Loading Slider...</div>
    </div>
  );
}

export default function HomeHero() {
  const [sliderReady, setSliderReady] = useState(false);

  useEffect(() => {
    setSliderReady(true);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    swipe: true,
    touchMove: true,
    swipeToSlide: true,
    pauseOnHover: true,
    lazyLoad: "progressive",
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          dots: true,
        }
      }
    ]
  };

  if (!sliderReady) {
    return (
      <section className="mt-0 w-full overflow-hidden">
        <div className={`relative w-full ${heightClasses}`}> 
          <OptifiedImage
            src={heroSlides[0].imgSrc}
            alt={heroSlides[0].btn.label}
            width={1920}
            height={1080}
            fetchpriority="high"
            loading="eager"
            className="w-full h-full object-cover rounded-lg block"
          />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
            <Link
              to={heroSlides[0].btn.link}
              className="bg-green-600 text-white px-3 py-1.5 lg:px-6 lg:py-3 rounded-md hover:bg-green-700 transition shadow-lg whitespace-nowrap"
            >
              {heroSlides[0].btn.label}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-0 w-full overflow-hidden group">
      <Suspense fallback={<HeroSkeleton />}>
        <Slider {...settings}>
          {heroSlides.map((slide, idx) => (
            <div key={idx} className={`relative w-full ${heightClasses} outline-none`}>
              <OptifiedImage
                src={slide.imgSrc}
                alt={slide.btn.label}
                width={1920}
                height={1080}
                fetchpriority={idx === 0 ? "high" : "low"}
                loading={idx === 0 ? "eager" : "lazy"}
                className="w-full h-full object-fill rounded-lg select-none block"
              />
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
                <Link
                  to={slide.btn.link}
                  className="bg-green-600 text-white px-3 py-1.5 lg:px-6 lg:py-3 rounded-md hover:bg-green-700 transition shadow-lg whitespace-nowrap"
                >
                  {slide.btn.label}
                </Link>
              </div>
            </div>
          ))}
        </Slider>
      </Suspense>

      <style>{`
        .slick-dots {
          bottom: 25px;
          z-index: 20;
        }
        .slick-dots li button:before {
          color: white;
          font-size: 10px;
          opacity: 0.7;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        .slick-active button:before {
          color: #22c55e !important;
          opacity: 1 !important;
        }
        .slick-prev, .slick-next {
          z-index: 20;
          width: 40px;
          height: 40px;
        }
        .slick-prev { left: 25px; }
        .slick-next { right: 25px; }
        
        .slick-slide {
           height: 40vh;
        }
        @media (min-width: 768px) {
          .slick-slide {
            height: 70vh;
          }
        }
        .slick-slide > div {
           height: 100%;
        }
      `}</style>
    </section>
  );
}