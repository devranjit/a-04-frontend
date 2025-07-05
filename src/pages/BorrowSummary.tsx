import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGetBorrowSummaryQuery } from "../pages/bookApi";

function BorrowSummary() {
  const { data: summary, isLoading, isError, error } = useGetBorrowSummaryQuery();

  if (isLoading) return <div>Loading borrow summary...</div>;

  if (isError) {
    console.error("Error fetching summary:", error);
    toast.error("Failed to load borrow summary.");
    return <div className="text-red-600 text-center mt-4">Failed to load borrow summary.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6 text-center">
        Borrowed Books Summary
      </h1>
      {summary && summary.length === 0 ? (
        <p className="text-center">No borrow records found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Title</th>
              <th className="p-2 border">ISBN</th>
              <th className="p-2 border">Total Borrowed</th>
            </tr>
          </thead>
          <tbody>
            {summary?.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="p-2 border">{item.book.title}</td>
                <td className="p-2 border">{item.book.isbn}</td>
                <td className="p-2 border">{item.totalQuantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default BorrowSummary;
