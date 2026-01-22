import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "./Notification.css";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const res = await api.get("/notifications");
    setNotifications(res.data);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="notification-container">
      <div className="bell" onClick={() => setOpen(!open)}>
        🔔
        {unreadCount > 0 && <span className="count">{unreadCount}</span>}
      </div>

      {open && (
        <div className="notification-box">
          {notifications.length === 0 && <p>No notifications</p>}

          {notifications.map(n => (
            <div
              key={n._id}
              className={`notification ${n.isRead ? "" : "unread"}`}
            >
              <b>{n.title}</b>
              <p>{n.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;