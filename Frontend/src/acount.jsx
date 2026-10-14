import { useState, useEffect } from "react";
import { Bell, Check, Trash2, X } from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // adapte au port de ton serveur

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  // Récupère les notifs au début
  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/allNot");
      const data = response.data;

      if (data.Etat === "Success" && Array.isArray(data.Data)) {
        const notifs = data.Data.map((item) => ({
          id: item.id_notification,
          message: item.contenu,
          time: calculateTimeAgo(item.date_c),
          isRead: false,
          color:
            item.type === "warning"
              ? "border-yellow-400"
              : item.type === "error"
                ? "border-red-400"
                : "border-blue-400",
        }));
        setNotifications(notifs);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des notifications", error);
    }
  };

  // Calcul du temps écoulé
  const calculateTimeAgo = (dateString) => {
    const now = new Date();
    const notifDate = new Date(dateString);
    const diffMs = now - notifDate;
    const minutes = Math.floor(diffMs / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `Il y a ${days}j`;
    if (hours > 0) return `Il y a ${hours}h`;
    if (minutes > 0) return `Il y a ${minutes}min`;
    return "À l'instant";
  };

  useEffect(() => {
    fetchNotifications();

    // 🎧 Écoute d'un événement de notification temps réel
    socket.on("new_notification", (notif) => {
      const newNotif = {
        id: notif.id_notification,
        message: notif.contenu,
        time: calculateTimeAgo(notif.date_c),
        isRead: false,
        color:
          notif.type === "warning"
            ? "border-yellow-400"
            : notif.type === "error"
              ? "border-red-400"
              : "border-blue-400",
      };
      setNotifications((prev) => [newNotif, ...prev]);
    });

    // Nettoyage
    return () => socket.off("new_notification");
  }, [refresh]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const arkAsRead = async (id) => {
    await axios
      .get(`http://localhost:3000/admin/updateNotification/${id}`)
      .then((response) => {
        if (response.data.Etat === "Success") {
          setRefresh(!refresh);
          console.log("Notifications mises à jour avec succès");
        } else {
          console.error("Erreur lors de la mise à jour des notifications");
        }
      });
  };

  const markAllAsRead = async () => {
    await axios
      .get("http://localhost:3000/admin/updateAllNotification")
      .then((response) => {
        if (response.data.Etat === "Success") {
          setRefresh(!refresh);
          console.log("Notifications mises à jour avec succès");
        } else {
          console.error("Erreur lors de la mise à jour des notifications");
        }
      });
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  return (
    <div className="relative inline-block">
      <button
        onClick={toggleDropdown}
        className="relative flex items-center p-2 rounded-full  hover:bg-gray-100 transition-all duration-300"
      >
        <Bell
          size={24}
          className={unreadCount > 0 ? "text-[#C4A998]" : "text-gray-600"}
        />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#C4A998] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-96 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="font-semibold text-gray-700">Notifications</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          </div>

          <div className="max-h-[480px] overflow-y-auto">
            {notifications.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {notifications.map((notif) => (
                  <li
                    key={notif.id}
                    className={`relative flex items-start p-4 hover:bg-gray-50 transition-colors duration-300 ${
                      notif.isRead ? "opacity-75" : ""
                    }`}
                  >
                    <div className={`flex-1 border-l-4 pl-3 ${notif.color}`}>
                      <p className="text-sm text-gray-800 mb-1">
                        {notif.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {notif.time}
                        </span>
                        <div className="flex items-center gap-2">
                          {!notif.isRead && (
                            <form
                              onSubmit={(event) => {
                                event.preventDefault();
                                arkAsRead(notif.id);
                              }}
                            >
                              <button
                                type="submit"
                                className="text-[#C4A998] hover:text-[#b39887] p-1 rounded-full hover:bg-gray-100"
                                title="Marquer comme lu"
                              >
                                <Check size={16} />
                              </button>
                            </form>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <Bell size={40} className="mb-2 opacity-50" />
                <p>Aucune notification</p>
              </div>
            )}
          </div>

          {unreadCount > 0 && (
            <div className="border-t p-3">
              <button
                onClick={markAllAsRead}
                className="w-full py-2 text-center text-sm text-[#C4A998] hover:bg-gray-50 rounded-md transition-colors duration-300"
              >
                Tout marquer comme lu
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
