import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ShareCard() {
  const { id } = useParams();
  const [card, setCard] = useState({
    id: id,
    title: "",
    description: "",
  });

  const IP = "192.168.1.11"; //Cambiar la IP dependiendo de la red

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`http://${IP}:5000/api/card/${id}`);
        setCard(response.data.data[0]);
        console.log(card);
      } catch (error) {
        console.error("Error fetching space cards:", error);
      }
    };

    getData();
  }, [id]);

  const openFile = async (cardId: any) => {
    try {
      const response = await axios.get(
        `http://${IP}:5000/api/card/${cardId}/file`,
        {
          responseType: "blob", // Important to get the file as a Blob
        }
      );

      const contentType = response.headers['content-type'];

      const file = new Blob([response.data], { type: contentType });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, "_blank");
    } catch (error) {
      console.error("Error opening file:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-lg bg-white p-8 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Detalles de la tarjeta</h2>
        <p className="mb-2">
          <span className="font-bold">Título:</span> {card.title}
        </p>
        <p className="mb-4">
          <span className="font-bold">Descripción:</span> {card.description}
        </p>
        <button
          onClick={() => openFile(card.id)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Ver documento
          <svg
            className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </button>
        {/* Aquí puedes agregar más detalles según sea necesario */}
      </div>
    </div>
  );
}

export default ShareCard;
