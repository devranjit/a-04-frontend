import { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  genre?: string;
  description?: string;
  copies: number;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

const BookDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://library-management-lake-three.vercel.app/api/books/${id}`)
      .then((res) => res.json())
      .then((response) => {
        console.log("API response:", response);
        setBook(response.data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!book)
    return <p className="text-center text-gray-500 mt-8">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded shadow-lg mt-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        {book.title}
      </h1>

      <div className="space-y-4 text-gray-800">
        <p>
          <strong className="text-gray-600">Author:</strong> {book.author}
        </p>
        <p>
          <strong className="text-gray-600">ISBN:</strong> {book.isbn}
        </p>
        {book.genre && (
          <p>
            <strong className="text-gray-600">Genre:</strong> {book.genre}
          </p>
        )}
        <p>
          <strong className="text-gray-600">Copies:</strong> {book.copies}
        </p>
        <p>
          <strong className="text-gray-600">Available:</strong>{" "}
          {book.available ? (
            <span className="text-green-600 font-semibold">Yes</span>
          ) : (
            <span className="text-red-600 font-semibold">No</span>
          )}
        </p>
        {book.description && book.description.trim() && (
          <p>
            <strong className="text-gray-600">Description:</strong>{" "}
            {book.description}
          </p>
        )}
        <p>
          <strong className="text-gray-600">Created At:</strong>{" "}
          {new Date(book.createdAt).toLocaleString()}
        </p>
        <p>
          <strong className="text-gray-600">Updated At:</strong>{" "}
          {new Date(book.updatedAt).toLocaleString()}
        </p>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate(`/edit/${book._id}`)}
          className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 transition-colors duration-200"
        >
          Edit Book
        </button>
      </div>
    </div>
  );
};

export default BookDetail;
