"use client"

import { useEffect } from 'react'

const ClientScripts = () => {
  useEffect(() => {
    const options = {
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
        pagination: {
            el: `.swiper-pagination`,
            clickable: true,
            type: "bullets",
            dynamicBullets: true,

        },
        navigation: {
            nextEl: `.swiper-button-next`,
            prevEl: `.swiper-button-prev`,
        }
      };
      new (window as any).Swiper(`.swiper-container`, options);
  }, []);
  
  return null
}

export default ClientScripts