import { useEffect, useState } from "react";
import io from "socket.io-client";
import cookie from "cookies-js";

const socket = io.connect("http://localhost:3000");
function SocketIo() {
  const [message, setMessage] = useState("");
  const [idUser, setIdUser] = useState("");
  const [receivedMessage, setReceivedMessage] = useState(null);

  const sendMessage = () => {
    socket.emit("message", {
      message: message,
      id_user: idUser,
    });
    setMessage("");
    setIdUser("");
  };

  // useEffect(() => {

  //   socket.emit("registre", { id_user: cookie.get("connect") });
  //   socket.on("notifications", (Data) => {
  //     setReceivedMessage(Data.message);
  //     alert(`il ya une message  : ${Data.message}`);
  //   });
  // }, []);

  return (
    <div className="m-auto border rounded-lg p-4 flex-col bg-gray-200 flex-wrap justify-between w-1/2">
      <h2 className="text-xl font-bold mb-2">Chat en Temps Réel</h2>
      <p>
        Votre ID: <strong>{idUser}</strong>
      </p>

      <input
        type="text"
        value={idUser}
        onChange={(event) => setIdUser(event.target.value)}
        placeholder="ID utilisateur..."
        className="border p-2 w-full mb-2"
      />

      <input
        type="text"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Message..."
        className="border p-2 w-full mb-2"
      />

      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
      >
        Envoyer
      </button>

      {receivedMessage && (
        <div className="mt-4 p-2 bg-green-200 border rounded">
          <strong>Message reçu:</strong> {receivedMessage}
        </div>
      )}
    </div>
  );
}

export default SocketIo;
