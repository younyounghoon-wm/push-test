"use client";

import { useEffect, useState } from "react";

const VAPID_PUBLIC_KEY =
  "BBz-aLS6tcINQi2bVz2c5wJDnnkWr5EaseoR38VoSfJjeivq1bioH1RRqAD1acRhTrDgab6yqn__Uva9t_D9aRo";

export default function Home() {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      console.log("서비스 워커를 지원하는 브라우저입니다.");
      navigator.serviceWorker
        .register("./service-worker.js")
        .then((registration) => {
          console.log("등록 정보", registration);
        })
        .catch((err) => {
          console.error("서비스 워커 등록에 실패하였습니다.", err);
        });
    }
  }, []);

  const handleNotifiy = () => {
    // 권한 사용자 에이전트 권한 허용 받기
    Notification.requestPermission().then(
      (permission: NotificationPermission) => {
        if (permission === "granted") {
          console.log("알림 권한 허용");

          // 1. 구독하기
          navigator.serviceWorker.ready.then((registration) => {
            const options: PushSubscriptionOptionsInit = {
              applicationServerKey: VAPID_PUBLIC_KEY,
              userVisibleOnly: true,
            };

            // 1-1. 구독정보 요청하기
            registration.pushManager
              .subscribe(options)
              .then((pushSubscription) => {
                console.log("pushSubscription", pushSubscription);

                // 서버에 구독정보 & PUBLIC_KEY 보내주기
                fetch("http://localhost:8000/vapidKey", {
                  method: "POST",
                  body: JSON.stringify({
                    pushSubscription,
                    vapidPublicKey: VAPID_PUBLIC_KEY,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                })
                  .then((res) => res.json())
                  .then((data) => console.log("data", data));
              })
              .then((res) => {})
              .catch((err) => {
                console.error("구독 정보 실패", err);
              });
          });

          // 2. 구독정보 애플리케이션 서버에 보내기
        } else if (permission === "denied") {
          console.log("알림 권한 거부");
        } else {
          console.log("알림 차단", permission);
        }
        setPermission(permission);
      }
    );
  };

  const checkNoti = () => {
    new Notification("HI");
  };

  const handlePush = () => {
    fetch("http://localhost:8000/push").then(() => {});
  };

  return (
    <main>
      <button onClick={handleNotifiy}>알림 켜기</button>
      <h3>현재 브라우저 알림 권한 : {permission}</h3>
      <button onClick={checkNoti}>노티 확인용 버튼</button>
      <button onClick={handlePush}>푸시 날리기</button>
    </main>
  );
}
