import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useGetBooksQuery,
  useDeleteBookMutation,
} from "../pages/bookApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../pages/store";
import { openDeleteModal, closeDeleteModal } from "../pages/uislice";
import { useState } from "react";

function BooksList() {
  const navigate = useNavigate();
  const { data: books, isLoading, isError, error } = useGetBooksQuery();
  const [deleteBook] = useDeleteBookMutation();
  const dispatch = useDispatch();
  const isDeleteModalOpen = useSelector(
    (state: RootState) => state.ui.isDeleteModalOpen
  );
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    setBookToDelete(id);
    dispatch(openDeleteModal());
  };

  const handleDelete = (id: string) => {
    deleteBook(id)
      .unwrap()
      .then(() => toast.success("Book deleted successfully!"))
      .catch((err) => {
        console.error("Delete error:", err);
        toast.error("Failed to delete book.");
      });
  };

  const handleBorrow = (id: string) => {
    navigate(`/borrow/${id}`);
  };

  if (isLoading)
    return (
      <div className="text-center text-gray-500 mt-8">Loading books...</div>
    );

  if (isError) {
    console.error("Fetch error:", error);
    return (
      <div className="text-center text-red-600 mt-8">
        Error loading books. Please try again later.
      </div>
    );
  }

  return (
    <div>
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-center">Books List</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books?.map((book) => (
          <div
            key={book._id}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
          >
            <div className="flex-grow">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-2">
                {book.title}
              </h2>
              <p className="text-gray-500 mb-4">by {book.author}</p>
              <p className="text-sm text-gray-400 mb-4">
                ISBN: {book.isbn} | Genre: {book.genre}
              </p>
              <p className="text-sm mb-2">
                Copies:{" "}
                <span
                  className={
                    book.copies > 0
                      ? "text-green-600 font-bold"
                      : "text-red-600 font-bold"
                  }
                >
                  {book.copies}
                </span>
              </p>
              <p className="text-sm">
                Available:{" "}
                {book.available ? (
                  <span className="text-green-600 font-bold">Yes</span>
                ) : (
                  <span className="text-red-600 font-bold">No</span>
                )}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mt-auto pt-4">
              <Link
                to={`/book/${book._id}`}
                className="flex-1 bg-green-500 text-white px-3 py-2 text-sm rounded hover:bg-green-600 text-center"
              >
                Details
              </Link>
              <button
                className="flex-1 bg-yellow-500 text-white px-3 py-2 text-sm rounded hover:bg-yellow-600"
                onClick={() => navigate(`/edit/${book._id}`)}
              >
                Edit
              </button>
              <button
                className="flex-1 bg-red-500 text-white px-3 py-2 text-sm rounded hover:bg-red-600"
                onClick={() => confirmDelete(book._id)}
              >
                Delete
              </button>
              <button
                className="flex-1 bg-blue-500 text-white px-3 py-2 text-sm rounded hover:bg-blue-600"
                onClick={() => handleBorrow(book._id)}
              >
                Borrow
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-center text-red-600">
              Confirm Deletion
            </h2>
            <p className="mb-6 text-center">
              Are you sure you want to delete this book?
            </p>
            <div className="flex justify-between">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => dispatch(closeDeleteModal())}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => {
                  if (bookToDelete) handleDelete(bookToDelete);
                  dispatch(closeDeleteModal());
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BooksList;
