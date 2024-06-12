import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import apiClient from "api";

import "swiper/css";
import "swiper/css/scrollbar";

import { Scrollbar } from "swiper/modules";
import { CiClock1 } from "react-icons/ci";

const RecentlyView = () => {
  const [allMinutes, setAllMinutes] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    apiClient.get("/minutes").then((response) => {
      const sortedData = response.data.sort((a, b) => new Date(b.timeEnd) - new Date(a.timeEnd));
      setAllMinutes(sortedData);
    });
  }, []);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString("ko-KR", options);
  };

  if (!user) {
    return (
      <p
        className="mt-32 text-green-700 text-4xl font-bold"
        style={{ textShadow: "1px 1px 1px #000000" }}
      >
        로그인이 필요합니다.
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="text-left ml-12 mt-10 flex font-bold text-lg">
        <CiClock1 className="mt-1" />
        <p className="ml-1 text-base">최근에 추가된 회의록</p>
      </div>
      <Swiper
        slidesPerView={4}
        slidesPerGroup={4}
        scrollbar={true}
        modules={[Scrollbar]}
        className="w-[1200px]"
      >
        {allMinutes.map((minutes, index) => (
          <SwiperSlide key={index}>
            <div className="flex justify-center mb-10">
              <div className="w-72 h-72 border-2 mt-5 border-green-500 hover:border-green-600 font-bold p-5 bg-green-50 items-center justify-center rounded-3xl shadow-md hover:shadow-lg">
                <p className="text-2xl font-bold my-3">{minutes.title}</p>
                <div className="flex flex-col justify-start items-start">
                  <p>
                    <span className="w-12 inline-block">시작:</span>
                    {formatDate(minutes.timeStart)}
                  </p>
                  <p>
                    <span className="w-12 inline-block">끝:</span>
                    {formatDate(minutes.timeEnd)}
                  </p>
                  <p>
                    <span className="mt-5 w-12 inline-block">장소:</span>
                    {minutes.place}
                  </p>
                </div>
                <span className="mt-5 w-24 inline-block text-lg text-green-900">
                  참석자
                </span>
                <p>
                  {minutes.attendees.map((people, index) => (
                    <span key={index}>
                      {people.attendee.name}
                      {index < minutes.attendees.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RecentlyView;
