import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { useGetBookQuery, useUpdateBookMutation } from "../pages/bookApi";

function EditBook() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: book, isLoading, isError, error } = useGetBookQuery(id!);
  const [updateBook] = useUpdateBookMutation();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [isbn, setIsbn] = useState("");
  const [description, setDescription] = useState("");
  const [copies, setCopies] = useState(1);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setGenre(book.genre);
      setIsbn(book.isbn);
      setDescription(book.description || "");
      setCopies(book.copies);
      setAvailable(book.available);
    }
  }, [book]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedAvailable = copies === 0 ? false : available;

    updateBook({
      id: book!._id,
      updates: {
        title,
        author,
        genre,
        isbn,
        description,
        copies,
        available: updatedAvailable,
      },
    })
      .unwrap()
      .then(() => {
        toast.success("Book updated successfully!");
        setTimeout(() => navigate("/"), 1500);
      })
      .catch((error) => {
        console.error("Error updating book:", error);
        toast.error("Failed to update book.");
      });
  };

  if (isLoading) return <div>Loading book data...</div>;
  if (isError) {
    console.error("Fetch error:", error);
    toast.error("Failed to load book data.");
    return <div className="text-red-600 mt-4 text-center">Failed to load book data.</div>;
  }

  return (
    <div>
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Edit Book</h1>
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
            <option value="">Select genre</option>
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
            min={0}
            onChange={(e) => setCopies(Number(e.target.value))}
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
            disabled={copies === 0}
          />
          <label>Available</label>
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Update Book
        </button>
      </form>
    </div>
  );
}

export default EditBook;
