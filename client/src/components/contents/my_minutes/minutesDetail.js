import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import apiClient from "api";
import { format } from "date-fns";

const labelMapping = {
  title: "제목",
  department: "부서",
  timeStart: "시작 시간",
  timeEnd: "종료 시간",
  place: "장소",
  item: "안건",
  content: "내용",
  decision: "결정 내용",
  attendees: "참석자",
};

const MinuteDetail = () => {
  const { minuteId } = useParams();
  const [minuteDetail, setMinuteDetail] = useState(null);

  const isCollapsed = useSelector((state) => state.isCollapsed);

  useEffect(() => {
    apiClient.get(`/minutes/${minuteId}`).then((response) => {
      setMinuteDetail(response.data);
    });
  }, [minuteId]);

  if (!minuteDetail) {
    return <div>Loading...</div>;
  }

  const formatDate = (dateString) => {
    return format(new Date(dateString), "yyyy년 MM월 dd일 HH:mm");
  };

  const formatAttendees = (attendees) => {
    return attendees.map((attendee) => attendee.attendee.name).join(", ");
  };

  return (
    <div className={`bg-yellow-50 w-full min-h-screen p-5 ransition-all duration-300 ease-in-out ${
          isCollapsed ? "pl-40" : "pl-80"
        }`}>
      <div className={`w-[960px] mt-12 mx-auto bg-white rounded-lg shadow-md p-12`}>
        <h1 className="font-semibold text-3xl text-gray-700 mb-4">
          {minuteDetail.title}
        </h1>
        {Object.entries(labelMapping).map(([key, label]) => (
          <div className="text-gray-600 text-xl mt-10" key={key}>
            <strong>{label}:</strong>{" "}
            {key === "attendees" ? (
              formatAttendees(minuteDetail[key])
            ) : key === "timeStart" || key === "timeEnd" ? (
              formatDate(minuteDetail[key])
            ) : (
              minuteDetail[key]
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MinuteDetail;
