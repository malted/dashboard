"use client";

import moment from "moment/moment";
import { useEffect, useState } from "react";

// import Image from "next/image";

export default function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4221");

    ws.onopen = () => {
      console.log("connected to websocket");
    };

    ws.onmessage = (event) => {
      const info = JSON.parse(event.data);
      setEvents((prev) => [...prev, ...info]);
      console.log("recieved info:", info);
    };

    ws.onclose = () => {
      console.log("disconnected from websocket");
    };

    return () => ws.close();
  }, []);

  const filteredEvents = events.filter((e) => e.guid);

  return (
    <>
      <h1 className="text-8xl font-bold text-center">Hack Club HQ</h1>
      <h2 className="text-6xl text-center mb-12">Shelburne, Vermont</h2>

      <div className="flex flex-col gap-6 text-3xl">
        {filteredEvents.map((info) => (
          <div
            className="flex border justify-between items-center bg-neutral-900"
            key={info.guid}
          >
            <div class="flex flex-col items-center">
              <img class="w-32" src={info.senderAvatar} alt="" />
              <p className="text-8xl my-auto">{info.sender}</p>
            </div>

            <div className="flex flex-col gap-2 justify-between">
              <p className="text-8xl">{info.event}</p>
              <p className="text-7xl">{info.repo}</p>
              <p className="text-4xl">{info.repoUrl}</p>
            </div>

            <p className="text-7xl">{moment(info.timestampMs).fromNow()}</p>
          </div>
        ))}
      </div>
    </>
  );
  // return <DashboardComponent />;
}
