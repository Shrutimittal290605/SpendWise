import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import moment from "moment";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import axios from "axios";
import { deleteTransactions, editTransactions } from "../../utils/ApiRequest";
import "./home.css";

const TableData = (props) => {
  const [show, setShow] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [currId, setCurrId] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    transactionType: "",
  });

  const handleClose = () => {
    setShow(false);
    setEditingTransaction(null);
    setCurrId(null);
  };

  const handleShow = () => setShow(true);

  const handleEditClick = (itemKey) => {
    const transaction = props.data.find((item) => item._id === itemKey);

    if (!transaction) return;

    setCurrId(itemKey);
    setEditingTransaction(transaction);

    setValues({
      title: transaction.title || "",
      amount: transaction.amount || "",
      description: transaction.description || "",
      category: transaction.category || "",
      date: transaction.date
        ? moment(transaction.date).format("YYYY-MM-DD")
        : "",
      transactionType: transaction.transactionType || "",
    });

    handleShow();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!currId) return;

    try {
      const { data } = await axios.put(`${editTransactions}/${currId}`, {
        ...values,
      });

      if (data.success === true) {
        handleClose();
        setRefresh((prev) => !prev);
        window.location.reload();
      } else {
        console.log("Unable to update transaction");
      }
    } catch (error) {
      console.error("Update transaction error:", error);
    }
  };

  const handleDeleteClick = async (itemKey) => {
    if (!props.user?._id) return;

    try {
      const { data } = await axios.post(`${deleteTransactions}/${itemKey}`, {
        userId: props.user._id,
      });

      if (data.success === true) {
        setRefresh((prev) => !prev);
        window.location.reload();
      } else {
        console.log("Unable to delete transaction");
      }
    } catch (error) {
      console.error("Delete transaction error:", error);
    }
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    // keeps component synchronized with parent data
  }, [props.data, props.user, refresh]);

  return (
    <>
      <div className="spendwise-table-wrapper">
        <div className="table-responsive">
          <table className="spendwise-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Transaction</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>

            <tbody>
              {props.data && props.data.length > 0 ? (
                props.data.map((item) => {
                  const isIncome = item.transactionType === "credit";

                  return (
                    <tr key={item._id}>
                      <td>
                        <div className="transaction-date">
                          {moment(item.date).format("DD MMM YYYY")}
                        </div>
                      </td>

                      <td>
                        <div className="transaction-title">
                          {item.title}
                        </div>

                        {item.description && (
                          <div className="transaction-description">
                            {item.description}
                          </div>
                        )}
                      </td>

                      <td>
                        <span className="category-badge">
                          {item.category}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            isIncome
                              ? "type-badge income-badge"
                              : "type-badge expense-badge"
                          }
                        >
                          {isIncome ? "Income" : "Expense"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            isIncome
                              ? "amount-income"
                              : "amount-expense"
                          }
                        >
                          {isIncome ? "+" : "-"}₹
                          {Number(item.amount || 0).toLocaleString("en-IN")}
                        </span>
                      </td>

                      <td>
                        <div className="transaction-actions">
                          <button
                            type="button"
                            className="table-action edit-action"
                            onClick={() => handleEditClick(item._id)}
                            title="Edit transaction"
                          >
                            <EditNoteIcon fontSize="small" />
                          </button>

                          <button
                            type="button"
                            className="table-action delete-action"
                            onClick={() => handleDeleteClick(item._id)}
                            title="Delete transaction"
                          >
                            <DeleteForeverIcon fontSize="small" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6">
                    <div className="empty-transactions">
                      <div className="empty-icon">₹</div>
                      <h5>No transactions yet</h5>
                      <p>
                        Add your first income or expense to start tracking
                        your finances.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT TRANSACTION MODAL */}
      <Modal
        show={show}
        onHide={handleClose}
        centered
        contentClassName="border-0"
      >
        <div
          style={{
            background: "#111524",
            color: "#fff",
            borderRadius: "18px",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Modal.Header
            closeButton
            closeVariant="white"
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Modal.Title className="fw-bold">
              Edit Transaction
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="p-4">
            {editingTransaction && (
              <Form onSubmit={handleEditSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>

                  <Form.Control
                    name="title"
                    type="text"
                    value={values.title}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Amount</Form.Label>

                  <Form.Control
                    name="amount"
                    type="number"
                    value={values.amount}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>

                  <Form.Select
                    name="category"
                    value={values.category}
                    onChange={handleChange}
                  >
                    <option value="">Choose...</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Rent">Rent</option>
                    <option value="Salary">Salary</option>
                    <option value="Tip">Tip</option>
                    <option value="Food">Food</option>
                    <option value="Medical">Medical</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>

                  <Form.Control
                    type="text"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Transaction Type</Form.Label>

                  <Form.Select
                    name="transactionType"
                    value={values.transactionType}
                    onChange={handleChange}
                  >
                    <option value="credit">Income</option>
                    <option value="expense">Expense</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>

                  <Form.Control
                    type="date"
                    name="date"
                    value={values.date}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Form>
            )}
          </Modal.Body>

          <Modal.Footer
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Button
              variant="secondary"
              onClick={handleClose}
              className="rounded-3"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleEditSubmit}
              className="border-0 rounded-3 px-4"
              style={{
                background:
                  "linear-gradient(90deg, #7c5cff, #4da5ff)",
              }}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default TableData;