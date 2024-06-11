import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/scrollbar';
import { Scrollbar } from 'swiper/modules';
import { CiClock1 } from "react-icons/ci";

const RecentlyView = () => {
    const recents = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

  return (
    <div className="flex flex-col">
      <div className="text-left ml-12 mt-10 flex font-bold text-lg">
        <CiClock1 className="mt-2" />
        <p className="ml-1">recently view</p>
      </div>
      <Swiper
        slidesPerView={4}
        slidesPerGroup={4}
        scrollbar={true}
        modules={[Scrollbar]}
        className="w-[1200px]"
      >
        {recents.map((jobData, index) => (
          <SwiperSlide>
            <div key={index} className="flex justify-center mb-10">
              <div className="w-72 h-72 border-2 mt-5 border-green-500 font-bold p-5 bg-green-50 items-center justify-center rounded-3xl shadow-md hover:shadow-lg">
                
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RecentlyView;
