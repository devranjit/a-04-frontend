import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../pages/store";
import { openDeleteModal, closeDeleteModal } from "../pages/uislice";
import {
  useGetBookQuery,
  useBorrowBookMutation,
  useUpdateBookMutation,
} from "../pages/bookApi";
import { useState } from "react";

function BorrowBook() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isModalOpen = useSelector((state: RootState) => state.ui.isDeleteModalOpen);

  const { data: book, isLoading, isError } = useGetBookQuery(id!);
  const [borrowBook] = useBorrowBookMutation();
  const [updateBook] = useUpdateBookMutation();

  const [quantity, setQuantity] = useState(1);
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleBorrowConfirm = () => {
    if (!book) return;

    setSubmitting(true);

    const updatedCopies = book.copies - quantity;
    const updatedAvailable = updatedCopies > 0;

    borrowBook({ bookId: book._id, quantity, dueDate })
      .unwrap()
      .then(() =>
        updateBook({
          id: book._id,
          updates: {
            copies: updatedCopies,
            available: updatedAvailable,
          },
        }).unwrap()
      )
      .then(() => {
        toast.success("Borrow successful!");
        dispatch(closeDeleteModal());
        setTimeout(() => navigate("/borrows"), 1500);
      })
      .catch((error) => {
        console.error("Error processing borrow:", error);
        toast.error("Borrow failed.");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;

    if (quantity < 1) {
      toast.error("Quantity must be at least 1.");
      return;
    }

    if (quantity > book.copies) {
      toast.error(`Quantity cannot exceed available copies (${book.copies}).`);
      return;
    }

    if (!dueDate) {
      toast.error("Please select a due date.");
      return;
    }

    dispatch(openDeleteModal());
  };

  if (isLoading) return <div>Loading book data...</div>;
  if (isError) {
    toast.error("Failed to load book data.");
    navigate("/books");
    return null;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4 text-center">
        Borrow "{book!.title}"
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Quantity (max {book!.copies}):</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={quantity}
            min={1}
            max={book!.copies}
            onChange={(e) => setQuantity(Number(e.target.value))}
            disabled={book!.copies === 0}
            required
          />
          {book!.copies === 0 && (
            <p className="text-red-600 text-sm mt-1">
              This book is currently out of stock and cannot be borrowed.
            </p>
          )}
        </div>
        <div>
          <label className="block mb-1">Due Date:</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            disabled={book!.copies === 0}
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full disabled:opacity-50"
          disabled={submitting || book!.copies === 0}
        >
          {submitting ? "Processing..." : "Confirm Borrow"}
        </button>
      </form>

      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-center text-green-700">
              Confirm Borrow
            </h2>
            <p className="mb-6 text-center">
              Borrow {quantity} copy(ies) of "{book!.title}" until {dueDate}?
            </p>
            <div className="flex justify-between">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => dispatch(closeDeleteModal())}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={handleBorrowConfirm}
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

export default BorrowBook;
