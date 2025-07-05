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
    <div>
      <h1 className="text-2xl font-bold mb-4">Add New Book</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1">Title:</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Author:</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Genre:</label>
          <select
            className="w-full border p-2 rounded"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          >
            <option value="" disabled>Select Genre</option>
            <option value="FICTION">FICTION</option>
            <option value="NONFICTION">NON-FICTION</option>
            <option value="SCIENCE">SCIENCE</option>
            <option value="HISTORY">HISTORY</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">ISBN:</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Description:</label>
          <textarea
            className="w-full border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Copies:</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
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
          <label>Available</label>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Book
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}

export default AddBook;
