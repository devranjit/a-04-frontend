import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCreateBookMutation } from "../pages/bookApi";

function AddBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [isbn, setIsbn] = useState("");
  const [description, setDescription] = useState("");
  const [copies, setCopies] = useState(1);
  const [available, setAvailable] = useState(true);

  const navigate = useNavigate();
  const [createBook] = useCreateBookMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createBook({
      title,
      author,
      genre,
      isbn,
      description,
      copies,
      available,
    })
      .unwrap()
      .then(() => {
        toast.success("Book added successfully!");
        setTimeout(() => navigate("/"), 1500);
      })
      .catch((error) => {
        console.error("Error adding book:", error);
        toast.error("Failed to add book.");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="bg-white shadow-lg rounded-xl w-full max-w-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Add New Book
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Title:</label>
            <input
              type="text"
              className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Author:</label>
            <input
              type="text"
              className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Genre:</label>
            <select
              className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Genre
              </option>
              <option value="FICTION">FICTION</option>
              <option value="NONFICTION">NON-FICTION</option>
              <option value="SCIENCE">SCIENCE</option>
              <option value="HISTORY">HISTORY</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">ISBN:</label>
            <input
              type="text"
              className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Description:</label>
            <textarea
              className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Copies:</label>
            <input
              type="number"
              className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={copies}
              min={1}
              onChange={(e) => setCopies(Number(e.target.value))}
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
            />
            <label className="font-medium">Available</label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition duration-300"
          >
            Add Book
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddBook;
