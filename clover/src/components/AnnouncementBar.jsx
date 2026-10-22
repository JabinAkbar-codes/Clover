import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "../styles/AnnouncementBar.css";

const messages = [
  "Free Shipping across India on orders over ₹999",
  "New Arrivals Every Week — Shop the Latest Drop",
  "Personalize Your Jewelry with Our Charms",
  "Flat 10% Off on Your First Order — Use WELCOME10",
];

export default function AnnouncementBar() {
  return (
    <div className="announcement-bar">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3200, disableOnInteraction: false }}
        loop={true}
        slidesPerView={1}
        className="announcement-swiper"
      >
        {messages.map((msg, i) => (
          <SwiperSlide key={i}>
            <div className="announcement-inner">
              <span className="announcement-text">{msg}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
