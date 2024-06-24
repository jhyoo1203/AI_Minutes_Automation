import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import apiClient from "api";

import "swiper/css";
import "swiper/css/scrollbar";

import { Scrollbar } from "swiper/modules";
import { CiClock1 } from "react-icons/ci";

const RecentlyView = () => {
  const [allMinutes, setAllMinutes] = useState([]);
  const [user] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  useEffect(() => {
    if (user) {
      apiClient.get(`/minutes/user/${user.id}`).then((response) => {
        setAllMinutes(response.data);
        console.log(response.data);
      });
    }
  }, [user]);

  useEffect(() => {
    const handleWindowResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const getSlidesPerView = () => {
    if (viewportWidth >= 1280) return 4; // xl
    if (viewportWidth >= 768) return 3; // md
    if (viewportWidth >= 640) return 2; // sm
    return 1; // xs
  };

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

  const handleLongTitle = (title) => {
    const maxLength = 10;
    if (title.length > maxLength) {
      return `${title.substring(0, maxLength)}...`;
    }
    return title;
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
      <div className="text-left xl:ml-48 md:ml-12 xl:mt-20 lg:mt-10 flex font-bold text-lg">
        <CiClock1 className="mt-1" />
        <p className="ml-1">최근에 추가된 회의록</p>
      </div>
      <Swiper
        slidesPerView={getSlidesPerView()}
        slidesPerGroup={getSlidesPerView()}
        scrollbar={true}
        modules={[Scrollbar]}
        className="w-full max-w-[1280px] mx-auto"
      >
        {allMinutes.map((minutes, index) => (
          <SwiperSlide key={index}>
            <div className="flex justify-center mb-5 mx-3 sm:mb-10">
              <div className="w-full sm:w-80 h-auto sm:h-84 border-2 mt-5 border-green-500 hover:border-green-600 font-bold p-3 sm:p-5 bg-green-50 items-center justify-center rounded-3xl shadow-md hover:shadow-lg">
                <p className="text-xl sm:text-2xl font-bold my-3">
                  {handleLongTitle(minutes.title)}
                </p>
                <div className="flex flex-col justify-start items-start">
                  <div className="p-2 bg-white rounded-lg shadow-md border-2 border-gray-300">
                    <p>
                      <span className="w-12 inline-block">시작:</span>
                      {formatDate(minutes.timeStart)}
                    </p>
                    <p>
                      <span className="w-12 inline-block">끝:</span>
                      {formatDate(minutes.timeEnd)}
                    </p>
                  </div>
                  <p>
                    <span className="mt-5 w-12 inline-block">장소:</span>
                    {minutes.place}
                  </p>
                </div>
                <span className="mt-5 w-24 inline-block text-lg sm:text-lg text-green-900">
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
