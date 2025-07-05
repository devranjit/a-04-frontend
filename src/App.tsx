import { Routes, Route, Link, useLocation } from "react-router-dom";
import BooksList from "./pages/BooksList";
import AddBook from "./pages/AddBook";
import BookDetail from "./pages/BookDetail";
import BorrowSummary from "./pages/BorrowSummary";
import BorrowBook from "./pages/BorrowBook";
import EditBook from "./pages/editBook";
import "./index.css";

function App() {
  const location = useLocation();

  const linkClass = (path: string) =>
    `hover:underline ${
      location.pathname === path ? "font-bold underline" : ""
    }`;

  return (
    <div className="min-h-screen bg-gray-10 ">
      <nav className="bg-blue-600 text-white p-4 flex flex-col sm:flex-row gap-2 sm:gap-4">
        <Link to="/" className={linkClass("/")}>
          All Books
        </Link>
        <Link to="/add" className={linkClass("/add")}>
          Create book
        </Link>
        <Link to="/borrows" className={linkClass("/borrows")}>
          Borrow Summary
        </Link>
      </nav>

      <main className="p-4">
        <Routes>
          <Route path="/" element={<BooksList />} />
          <Route path="/add" element={<AddBook />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/borrows" element={<BorrowSummary />} />
          <Route path="/borrow/:id" element={<BorrowBook />} />
          <Route path="/edit/:id" element={<EditBook />} />
        </Routes>
      </main>
      <footer className="bg-gray-800 text-white text-center py-4 mt-8">
        <p className="text-sm">
          Minimal Library Management System © {new Date().getFullYear()} | Built
          with ❤️ by Dev Ranjit
        </p>
      </footer>
    </div>
  );
}

export default App;
