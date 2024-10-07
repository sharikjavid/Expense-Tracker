import React, { useState, useEffect } from "react";

import {
  Button,
  Form,
  InputGroup,
  FormControl,
  Modal,
  Table,
  Pagination,
  OverlayTrigger,
  Tooltip,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import SidebarNav from "../SidebarNav/SidebarNav";
import BreadcrumbAndProfile from "../BreadcrumbAndProfile/BreadcrumbAndProfile";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExcel,
  faPlusCircle,
  faCalendarAlt,
  faPenToSquare,
  faTrashCan,
  faSearch,
  faCheckCircle,
  faArrowCircleLeft,
  faArrowCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Expenses() {
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem("expenses");
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(null);
  const [description, setDescription] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [category, setCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expensesPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Latest");
  const [filterCategory, setFilterCategory] = useState("All Transactions");
  const [showModal, setShowModal] = useState(false);
  const [showNotification, setShowNotification] = useState(""); // Notification state

  const categories = ["Utility", "Rent", "Groceries", "Entertainment", "Other"];

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // Export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(expenses);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");
    XLSX.writeFile(wb, "Expenses.xlsx");
  };

  const handleEdit = (expense) => {
    setEditing(true);
    setCurrentExpense(expense);
    setName(expense.name);
    setAmount(expense.amount);
    setDate(new Date(expense.date));
    setDescription(expense.description);
    setIsPaid(expense.status === "PAID");
    setCategory(expense.category || "");
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const expenseData = {
      id: editing ? currentExpense.id : Date.now(),
      name,
      amount,
      date: date.toISOString(),
      description,
      status: isPaid ? "PAID" : "DUE",
      category,
    };

    if (editing) {
      setExpenses(
        expenses.map((expense) =>
          expense.id === currentExpense.id ? expenseData : expense
        )
      );
      setShowNotification("updated");
    } else {
      setExpenses([...expenses, expenseData]);
      setShowNotification("added");
    }

    resetForm();
    setShowModal(false);
    setTimeout(() => setShowNotification(""), 3000); // Hide notification after 3 seconds
  };

  const resetForm = () => {
    setName("");
    setAmount("");
    setDate(null);
    setDescription("");
    setIsPaid(false);
    setEditing(false);
    setCurrentExpense(null);
    setCategory("");
  };

  const handleRemove = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
    setShowNotification("deleted");
    setTimeout(() => setShowNotification(""), 3000); // Hide notification after 3 seconds
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category?.toLowerCase()?.includes(searchQuery.toLowerCase());

    const matchesCategory =
      filterCategory === "All Transactions" ||
      expense.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const sortedExpenses = filteredExpenses.sort((a, b) => {
    if (sortOption === "Latest") {
      return new Date(b.date) - new Date(a.date);
    } else {
      return new Date(a.date) - new Date(b.date);
    }
  });

  const indexOfLastExpense = currentPage * expensesPerPage;
  const indexOfFirstExpense = indexOfLastExpense - expensesPerPage;
  const currentExpenses = sortedExpenses.slice(
    indexOfFirstExpense,
    indexOfLastExpense
  );

  const totalPages = Math.ceil(filteredExpenses.length / expensesPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) =>
      prev * expensesPerPage < filteredExpenses.length ? prev + 1 : prev
    );
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Tooltip component for descriptions
  const renderTooltip = (message) => <Tooltip>{message}</Tooltip>;

  // Format date for rendering
  const renderDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <Container fluid>
      <Row>
        <SidebarNav />

        <Col md={10} className="main">
          <BreadcrumbAndProfile
            username="Mr. Joe"
            role="Software Developer"
            pageTitle="Expenses"
            breadcrumbItems={[
              { name: "Dashboard", path: "/dashboard", active: true },
              { name: "Expenses", path: "/expenses", active: true },
            ]}
          />
          <div className="d-flex justify-content-end align-items-center py-4">
            <Button
              onClick={() => {
                setEditing(false);
                resetForm();
                setShowModal(true);
              }}
              className="btn btn-dark add-expense-button"
            >
              <FontAwesomeIcon
                icon={faPlusCircle}
                className="icon-right icon-left"
              />
              Add New Expense
            </Button>
          </div>

          <div className="d-flex justify-content-between align-items-center py-4 w-100">
            <InputGroup className="search-bar enhanced-search-bar">
              <FormControl
                placeholder="Search expenses..."
                onChange={(e) => setSearchQuery(e.target.value)}
                className="modern-search"
              />
              <InputGroup.Text className="search-icon enhanced-search-icon">
                <FontAwesomeIcon icon={faSearch} />
              </InputGroup.Text>
            </InputGroup>

            <div className="d-flex gap-3 sort-container ml-auto">
              <div className="d-flex align-items-center gap-2 sort-select-wrapper">
                <label
                  className="text-muted sort-label"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Sort by
                </label>
                <Form.Select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="rounded-md"
                >
                  <option value="Latest">Latest</option>
                  <option value="Oldest">Oldest</option>
                </Form.Select>
              </div>

              <div className="d-flex align-items-center gap-2 filter-container">
                <label
                  className="text-muted filter-label"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Filter by Category
                </label>
                <Form.Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="rounded-md filter-select"
                >
                  <option value="All Transactions">None</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </div>
          </div>

          <Table hover className="mt-4 table-white" responsive>
            <thead>
              <tr>
                <th>Expense Name</th>
                <th>Category</th>
                <th>Transaction Date</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentExpenses.map((expense) => (
                <OverlayTrigger
                  key={expense.id}
                  placement="top"
                  overlay={renderTooltip(
                    expense.description || "No description available"
                  )}
                >
                  <tr>
                    <td>{expense.name}</td>
                    <td>{expense.category}</td>
                    <td>{renderDate(expense.date)}</td>
                    <td style={{ color: "green", fontWeight: "600" }}>
                      €{expense.amount}
                    </td>
                    <td>
                      <OverlayTrigger
                        placement="top"
                        overlay={renderTooltip("Edit this expense")}
                      >
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          onClick={() => handleEdit(expense)}
                          style={{ cursor: "pointer", marginRight: "10px" }}
                        />
                      </OverlayTrigger>

                      <OverlayTrigger
                        placement="top"
                        overlay={renderTooltip("Delete this expense")}
                      >
                        <FontAwesomeIcon
                          icon={faTrashCan}
                          onClick={() => handleRemove(expense.id)}
                          style={{ cursor: "pointer", color: "red" }}
                        />
                      </OverlayTrigger>
                    </td>
                  </tr>
                </OverlayTrigger>
              ))}
            </tbody>
          </Table>

          <Button
            onClick={exportToExcel}
            className="btn btn-dark add-expense-button"
          >
            <FontAwesomeIcon icon={faFileExcel} className="icon-left" /> Export
            to Excel
          </Button>

          <div className="d-flex justify-content-center mt-4">
            <Pagination className=" custom-pagination">
              <Pagination.Prev
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className=" pagination-arrow"
              >
                <FontAwesomeIcon icon={faArrowCircleLeft} size="lg" />
              </Pagination.Prev>
              {Array.from({ length: totalPages }, (_, idx) => (
                <Pagination.Item
                  key={idx + 1}
                  active={idx + 1 === currentPage}
                  onClick={() => handlePageClick(idx + 1)}
                  className={`pagination-item ${
                    idx + 1 === currentPage ? "active-item" : ""
                  }`}
                >
                  {idx + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className=" pagination-arrow"
              >
                <FontAwesomeIcon icon={faArrowCircleRight} size="lg" />
              </Pagination.Next>
            </Pagination>
          </div>

          {showNotification && (
            <motion.div
              className="notification-left-corner"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <FontAwesomeIcon icon={faCheckCircle} />
              {showNotification === "added" && "Expense added successfully!"}
              {showNotification === "updated" &&
                "Expense updated successfully!"}
              {showNotification === "deleted" &&
                "Expense deleted successfully!"}
            </motion.div>
          )}
        </Col>
      </Row>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        dialogClassName="material-modal"
      >
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title>
            {editing ? "Edit Expense" : "Add New Expense"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="expense-name">Name</Form.Label>
              <Form.Control
                id="expense-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Expense Name"
                required
                className="form-control-custom"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="expense-description">Description</Form.Label>
              <Form.Control
                id="expense-description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description"
                required
                className="form-control-custom"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="expense-amount">Amount</Form.Label>
              <Form.Control
                id="expense-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount in Euros"
                required
                className="form-control-custom"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="expense-date">Date</Form.Label>
              <div className="date-picker-container position-relative">
                <DatePicker
                  id="expense-date"
                  selected={date}
                  onChange={(selectedDate) => setDate(selectedDate)}
                  dateFormat="yyyy-MM-dd"
                  className="form-control date-picker-input form-control-custom"
                  placeholderText="Select a date"
                  popperPlacement="bottom-end"
                />
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="calendar-icon position-absolute"
                  onClick={() =>
                    document.querySelector(".date-picker-input").focus()
                  }
                  style={{
                    cursor: "pointer",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="expense-category">Category</Form.Label>
              <Form.Select
                id="expense-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="form-control-custom"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button type="submit" className="mt-3 btn btn btn-dark w-100">
              {editing ? "Update Expense" : "Add Expense"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Expenses;
