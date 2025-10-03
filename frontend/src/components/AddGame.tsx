import React, { useState } from "react";
import axios from 'axios';
import { IGame } from "./IGame";

type AddGameProps = {
  reload: () => void;
  games: IGame[];
};

const AddGame: React.FC<AddGameProps> = ({ reload, games }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Generate preview URL
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !price || !name) {
      alert('Please input all fields');
      return;
    }
    const num = Number(price)
    if (isNaN(num)) {
      alert('Price should be a number');
      return;
    }


    const found = games.find((x: IGame) => x.name === name);
    if (found) {
      alert("This game is already existed.");
      return;
    }    

    try {
      const filename = encodeURIComponent(image.name);
      const contentType = image.type;

      // Send POST request to API Gateway
      const url = process.env.REACT_APP_API_GAME_URL || "";
      const response = await axios.post(
        url,
        { filename, contentType, price, name }
      );

      const { uploadURL } = response.data;
      // Upload the file to S3 using the pre-signed URL
      await axios.put(uploadURL, image, {
        headers: { 'Content-Type': image.type },
      });

      reload();
      setName("");
      setPrice("");
      setImage(null);
      setPreview(null);

    } catch (error) {
      console.log("error: ", error);
      alert('Upload failed. Please try again.');
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md max-w-md">
      <h2 className="text-xl font-bold mb-2">Add New Game</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 mb-2 w-full rounded"
      />
      <input
        type="text"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="border p-2 mb-2 w-full rounded"
      />
      <input
        type="file" onChange={handleFileChange}
        key={image ? image.name : 'reset'}
        className="border p-2 mb-2 w-full rounded"
      />
      {preview && (
        <div className="mb-3 flex justify-center">
          <img src={preview} alt="Preview" className="w-24 h-24 rounded-lg border border-gray-300 object-cover" />
        </div>
      )}
      <button type="button" className="bg-blue-500 text-white p-2 rounded w-full" onClick={handleSubmit}>
        Add
      </button>
    </div>
  );
};

export default AddGame;
