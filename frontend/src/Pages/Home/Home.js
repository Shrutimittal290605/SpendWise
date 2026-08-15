import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Modal,
  Form,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import "./home.css";
import {
  addTransaction,
  getTransactions,
} from "../../utils/ApiRequest";
import axios from "axios";
import {
  ToastContainer,
  toast,
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../components/Spinner";
import TableData from "./TableData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import BarChartIcon from "@mui/icons-material/BarChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SavingsIcon from "@mui/icons-material/Savings";
import Analytics from "./Analytics";

const Home = () => {
  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  const [cUser, setcUser] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const [frequency, setFrequency] = useState("7");
  const [type, setType] = useState("all");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [view, setView] = useState("table");

  const [activeSection, setActiveSection] =
    useState("dashboard");

  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    transactionType: "",
  });

  const handleStartChange = (date) => {
    setStartDate(date);
  };

  const handleEndChange = (date) => {
    setEndDate(date);
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => {
    setShow(true);
  };

  // ---------------------------------------------------
  // USER AUTH / AVATAR CHECK
  // ---------------------------------------------------
  useEffect(() => {
    const avatarFunc = async () => {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        navigate("/login");
        return;
      }

      try {
        const user = JSON.parse(storedUser);

        if (
          user?.isAvatarImageSet === false ||
          user?.avatarImage === ""
        ) {
          navigate("/setAvatar");
          return;
        }

        setcUser(user);
        setRefresh(true);
      } catch (error) {
        console.error(
          "User parsing error:",
          error
        );

        localStorage.removeItem("user");
        navigate("/login");
      }
    };

    avatarFunc();
  }, [navigate]);

  // ---------------------------------------------------
  // FORM HANDLING
  // ---------------------------------------------------
  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeFrequency = (e) => {
    setFrequency(e.target.value);
  };

  const handleSetType = (e) => {
    setType(e.target.value);
  };

  // ---------------------------------------------------
  // SIDEBAR ACTIONS
  // ---------------------------------------------------
  const handleDashboardClick = () => {
    setActiveSection("dashboard");
    setView("table");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleTransactionsClick = () => {
    setActiveSection("transactions");
    setView("table");

    setTimeout(() => {
      const element = document.getElementById(
        "recent-transactions"
      );

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 50);
  };

  const handleAnalyticsClick = () => {
    setActiveSection("analytics");
    setView("chart");

    setTimeout(() => {
      const element = document.getElementById(
        "analytics-section"
      );

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 50);
  };

  // ---------------------------------------------------
  // ADD TRANSACTION
  // ---------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cUser?._id) {
      toast.error(
        "User session not found. Please login again.",
        toastOptions
      );
      return;
    }

    const {
      title,
      amount,
      description,
      category,
      date,
      transactionType,
    } = values;

    if (
      !title ||
      !amount ||
      !description ||
      !category ||
      !date ||
      !transactionType
    ) {
      toast.error(
        "Please enter all the fields",
        toastOptions
      );
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        addTransaction,
        {
          title,
          amount,
          description,
          category,
          date,
          transactionType,
          userId: cUser._id,
        }
      );

      if (data.success === true) {
        toast.success(
          data.message,
          toastOptions
        );

        setValues({
          title: "",
          amount: "",
          description: "",
          category: "",
          date: "",
          transactionType: "",
        });

        handleClose();
        setRefresh((prev) => !prev);
      } else {
        toast.error(
          data.message ||
            "Unable to add transaction",
          toastOptions
        );
      }
    } catch (error) {
      console.error(
        "Add transaction error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Something went wrong while adding the transaction.",
        toastOptions
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------
  // RESET FILTERS
  // ---------------------------------------------------
  const handleReset = () => {
    setType("all");
    setStartDate(null);
    setEndDate(null);
    setFrequency("7");
  };

  // ---------------------------------------------------
  // FETCH TRANSACTIONS
  // ---------------------------------------------------
  useEffect(() => {
    if (!cUser?._id) return;

    const fetchAllTransactions =
      async () => {
        try {
          setLoading(true);

          const { data } =
            await axios.post(
              getTransactions,
              {
                userId: cUser._id,
                frequency,
                startDate,
                endDate,
                type,
              }
            );

          setTransactions(
            data.transactions || []
          );
        } catch (error) {
          console.error(
            "Fetch transactions error:",
            error
          );

          toast.error(
            error?.response?.data?.message ||
              "Unable to fetch transactions.",
            toastOptions
          );

          setTransactions([]);
        } finally {
          setLoading(false);
        }
      };

    fetchAllTransactions();
  }, [
    cUser,
    refresh,
    frequency,
    endDate,
    type,
    startDate,
  ]);

  // ---------------------------------------------------
  // SUMMARY CALCULATIONS
  // ---------------------------------------------------
  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;

    transactions.forEach(
      (transaction) => {
        const amount = Number(
          transaction.amount || 0
        );

        if (
          transaction.transactionType ===
          "credit"
        ) {
          income += amount;
        }

        if (
          transaction.transactionType ===
          "expense"
        ) {
          expense += amount;
        }
      }
    );

    return {
      income,
      expense,
      balance: income - expense,
      savings: income - expense,
    };
  }, [transactions]);

  const formatCurrency = (amount) => {
    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN")}`;
  };

  // ---------------------------------------------------
  // TABLE / CHART BUTTONS
  // ---------------------------------------------------
  const handleTableClick = () => {
    setActiveSection("transactions");
    setView("table");

    setTimeout(() => {
      const element =
        document.getElementById(
          "recent-transactions"
        );

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 50);
  };

  const handleChartClick = () => {
    handleAnalyticsClick();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top right, rgba(98, 70, 234, 0.16), transparent 30%), linear-gradient(135deg, #080a12 0%, #0d1020 45%, #11162b 100%)",
        color: "#fff",
        paddingBottom: "50px",
      }}
    >
      {/* Header */}
      <Header
        onAddTransaction={handleShow}
      />

      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onDashboard={handleDashboardClick}
        onTransactions={
          handleTransactionsClick
        }
        onAddTransaction={handleShow}
        onAnalytics={handleAnalyticsClick}
      />

      {/* Main content */}
      <main className="spendwise-main-content">
        {loading &&
        transactions.length === 0 ? (
          <Spinner />
        ) : (
          <Container
            fluid
            className="px-3 px-md-4 px-lg-5 pt-4"
          >
            {/* --------------------------------------------
                HERO SECTION
            --------------------------------------------- */}
            <div
              id="dashboard-section"
              className="rounded-4 p-4 p-md-5 mb-4"
              style={{
                background:
                  "linear-gradient(135deg, rgba(109, 74, 255, 0.25), rgba(61, 140, 255, 0.12))",
                border:
                  "1px solid rgba(255,255,255,0.08)",
                boxShadow:
                  "0 20px 60px rgba(0,0,0,0.28)",
                scrollMarginTop: "100px",
              }}
            >
              <Row className="align-items-center">
                <Col lg={12}>
                  <div className="text-uppercase small fw-semibold mb-2 text-light opacity-75">
                    Personal Finance Dashboard
                  </div>

                  <h1
                    className="fw-bold mb-2"
                    style={{
                      fontSize:
                        "clamp(2rem, 4vw, 3.4rem)",
                      letterSpacing:
                        "-1px",
                    }}
                  >
                    Welcome to{" "}
                    <span
                      style={{
                        background:
                          "linear-gradient(90deg, #9d7bff, #56b4ff)",
                        WebkitBackgroundClip:
                          "text",
                        WebkitTextFillColor:
                          "transparent",
                      }}
                    >
                      SpendWise
                    </span>
                  </h1>

                  <p className="mb-0 text-light opacity-75">
                    Track your money, understand your
                    spending and stay in control of your
                    finances.
                  </p>
                </Col>
              </Row>
            </div>

            {/* --------------------------------------------
                SUMMARY CARDS
            --------------------------------------------- */}
            <Row className="g-3 mb-4">
              <Col md={6} xl={3}>
                <div
                  className="h-100 rounded-4 p-4"
                  style={{
                    background:
                      "rgba(255,255,255,0.045)",
                    border:
                      "1px solid rgba(255,255,255,0.07)",
                    backdropFilter:
                      "blur(10px)",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <small className="text-light opacity-50">
                        Total Balance
                      </small>

                      <h3 className="fw-bold mt-2 mb-1">
                        {formatCurrency(
                          summary.balance
                        )}
                      </h3>

                      <small className="text-light opacity-50">
                        Available balance
                      </small>
                    </div>

                    <div
                      className="rounded-3 p-2"
                      style={{
                        background:
                          "rgba(124, 92, 255, 0.16)",
                      }}
                    >
                      <AccountBalanceWalletIcon />
                    </div>
                  </div>
                </div>
              </Col>

              <Col md={6} xl={3}>
                <div
                  className="h-100 rounded-4 p-4"
                  style={{
                    background:
                      "rgba(255,255,255,0.045)",
                    border:
                      "1px solid rgba(255,255,255,0.07)",
                    backdropFilter:
                      "blur(10px)",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <small className="text-light opacity-50">
                        Total Income
                      </small>

                      <h3 className="fw-bold mt-2 mb-1 text-success">
                        {formatCurrency(
                          summary.income
                        )}
                      </h3>

                      <small className="text-light opacity-50">
                        Money received
                      </small>
                    </div>

                    <div
                      className="rounded-3 p-2"
                      style={{
                        background:
                          "rgba(34, 197, 94, 0.14)",
                      }}
                    >
                      <TrendingUpIcon />
                    </div>
                  </div>
                </div>
              </Col>

              <Col md={6} xl={3}>
                <div
                  className="h-100 rounded-4 p-4"
                  style={{
                    background:
                      "rgba(255,255,255,0.045)",
                    border:
                      "1px solid rgba(255,255,255,0.07)",
                    backdropFilter:
                      "blur(10px)",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <small className="text-light opacity-50">
                        Total Expenses
                      </small>

                      <h3 className="fw-bold mt-2 mb-1 text-danger">
                        {formatCurrency(
                          summary.expense
                        )}
                      </h3>

                      <small className="text-light opacity-50">
                        Money spent
                      </small>
                    </div>

                    <div
                      className="rounded-3 p-2"
                      style={{
                        background:
                          "rgba(239, 68, 68, 0.14)",
                      }}
                    >
                      <TrendingDownIcon />
                    </div>
                  </div>
                </div>
              </Col>

              <Col md={6} xl={3}>
                <div
                  className="h-100 rounded-4 p-4"
                  style={{
                    background:
                      "rgba(255,255,255,0.045)",
                    border:
                      "1px solid rgba(255,255,255,0.07)",
                    backdropFilter:
                      "blur(10px)",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <small className="text-light opacity-50">
                        Net Savings
                      </small>

                      <h3 className="fw-bold mt-2 mb-1">
                        {formatCurrency(
                          summary.savings
                        )}
                      </h3>

                      <small className="text-light opacity-50">
                        Income minus expenses
                      </small>
                    </div>

                    <div
                      className="rounded-3 p-2"
                      style={{
                        background:
                          "rgba(86, 180, 255, 0.14)",
                      }}
                    >
                      <SavingsIcon />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            {/* --------------------------------------------
                FILTER / VIEW TOOLBAR
            --------------------------------------------- */}
            <div
              className="rounded-4 p-3 p-md-4 mb-4"
              style={{
                background:
                  "rgba(255,255,255,0.035)",
                border:
                  "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <Row className="g-3 align-items-end">
                <Col md={4}>
                  <Form.Label className="text-light opacity-75 small">
                    Period
                  </Form.Label>

                  <Form.Select
                    value={frequency}
                    onChange={
                      handleChangeFrequency
                    }
                    style={{
                      background:
                        "#171b2c",
                      color: "#fff",
                      border:
                        "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <option value="7">
                      Last Week
                    </option>

                    <option value="30">
                      Last Month
                    </option>

                    <option value="365">
                      Last Year
                    </option>

                    <option value="custom">
                      Custom
                    </option>
                  </Form.Select>
                </Col>

                <Col md={4}>
                  <Form.Label className="text-light opacity-75 small">
                    Transaction Type
                  </Form.Label>

                  <Form.Select
                    value={type}
                    onChange={handleSetType}
                    style={{
                      background:
                        "#171b2c",
                      color: "#fff",
                      border:
                        "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <option value="all">
                      All
                    </option>

                    <option value="expense">
                      Expense
                    </option>

                    <option value="credit">
                      Income
                    </option>
                  </Form.Select>
                </Col>

                <Col md={4}>
                  <div className="d-flex gap-2 justify-content-md-end">
                    <Button
                      variant="outline-light"
                      className={`rounded-3 ${
                        view ===
                        "table"
                          ? "active"
                          : ""
                      }`}
                      onClick={
                        handleTableClick
                      }
                    >
                      <FormatListBulletedIcon fontSize="small" />
                    </Button>

                    <Button
                      variant="outline-light"
                      className={`rounded-3 ${
                        view ===
                        "chart"
                          ? "active"
                          : ""
                      }`}
                      onClick={
                        handleChartClick
                      }
                    >
                      <BarChartIcon fontSize="small" />
                    </Button>

                    <Button
                      variant="outline-secondary"
                      className="rounded-3"
                      onClick={
                        handleReset
                      }
                    >
                      Reset
                    </Button>
                  </div>
                </Col>
              </Row>

              {frequency ===
                "custom" && (
                <Row className="g-3 mt-2">
                  <Col md={3}>
                    <Form.Label className="text-light opacity-75 small">
                      Start Date
                    </Form.Label>

                    <DatePicker
                      selected={
                        startDate
                      }
                      onChange={
                        handleStartChange
                      }
                      selectsStart
                      startDate={
                        startDate
                      }
                      endDate={
                        endDate
                      }
                      className="form-control"
                      placeholderText="Select start date"
                    />
                  </Col>

                  <Col md={3}>
                    <Form.Label className="text-light opacity-75 small">
                      End Date
                    </Form.Label>

                    <DatePicker
                      selected={
                        endDate
                      }
                      onChange={
                        handleEndChange
                      }
                      selectsEnd
                      startDate={
                        startDate
                      }
                      endDate={
                        endDate
                      }
                      minDate={
                        startDate
                      }
                      className="form-control"
                      placeholderText="Select end date"
                    />
                  </Col>
                </Row>
              )}
            </div>

            {/* --------------------------------------------
                CONTENT AREA
            --------------------------------------------- */}
            <div
              id="recent-transactions"
              className="rounded-4 p-3 p-md-4"
              style={{
                background:
                  "rgba(255,255,255,0.035)",
                border:
                  "1px solid rgba(255,255,255,0.07)",
                minHeight: "350px",
                scrollMarginTop:
                  "90px",
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold mb-1 text-white">
                    {view ===
                    "table"
                      ? "Recent Transactions"
                      : "Spending Analytics"}
                  </h4>

                  <p className="text-light opacity-50 mb-0 small">
                    Monitor your financial activity
                    at a glance.
                  </p>
                </div>

                <span
                  className="px-3 py-2 rounded-pill small"
                  style={{
                    background:
                      "rgba(124,92,255,0.14)",
                    color:
                      "#b8a8ff",
                  }}
                >
                  {
                    transactions.length
                  }{" "}
                  transactions
                </span>
              </div>

              <div
                id="analytics-section"
                style={{
                  scrollMarginTop:
                    "100px",
                }}
              >
                {view ===
                "table" ? (
                  <TableData
                    data={
                      transactions
                    }
                    user={cUser}
                  />
                ) : (
                  <Analytics
                    transactions={
                      transactions
                    }
                    user={cUser}
                  />
                )}
              </div>
            </div>

            {/* --------------------------------------------
                ADD TRANSACTION MODAL
            --------------------------------------------- */}
            <Modal
              show={show}
              onHide={handleClose}
              centered
              contentClassName="border-0"
            >
              <div
                style={{
                  background:
                    "#111524",
                  color: "#fff",
                  borderRadius:
                    "18px",
                  border:
                    "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <Modal.Header
                  closeButton
                  closeVariant="white"
                  style={{
                    borderBottom:
                      "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <Modal.Title className="fw-bold">
                    Add Transaction
                  </Modal.Title>
                </Modal.Header>

                <Modal.Body className="p-4">
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Title
                      </Form.Label>

                      <Form.Control
                        name="title"
                        type="text"
                        placeholder="e.g. Grocery shopping"
                        value={
                          values.title
                        }
                        onChange={
                          handleChange
                        }
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        Amount
                      </Form.Label>

                      <Form.Control
                        name="amount"
                        type="number"
                        placeholder="Enter amount"
                        value={
                          values.amount
                        }
                        onChange={
                          handleChange
                        }
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        Category
                      </Form.Label>

                      <Form.Select
                        name="category"
                        value={
                          values.category
                        }
                        onChange={
                          handleChange
                        }
                      >
                        <option value="">
                          Choose...
                        </option>

                        <option value="Groceries">
                          Groceries
                        </option>

                        <option value="Rent">
                          Rent
                        </option>

                        <option value="Salary">
                          Salary
                        </option>

                        <option value="Tip">
                          Tip
                        </option>

                        <option value="Food">
                          Food
                        </option>

                        <option value="Medical">
                          Medical
                        </option>

                        <option value="Utilities">
                          Utilities
                        </option>

                        <option value="Entertainment">
                          Entertainment
                        </option>

                        <option value="Transportation">
                          Transportation
                        </option>

                        <option value="Other">
                          Other
                        </option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        Description
                      </Form.Label>

                      <Form.Control
                        type="text"
                        name="description"
                        placeholder="Enter description"
                        value={
                          values.description
                        }
                        onChange={
                          handleChange
                        }
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        Transaction Type
                      </Form.Label>

                      <Form.Select
                        name="transactionType"
                        value={
                          values.transactionType
                        }
                        onChange={
                          handleChange
                        }
                      >
                        <option value="">
                          Choose...
                        </option>

                        <option value="credit">
                          Income
                        </option>

                        <option value="expense">
                          Expense
                        </option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        Date
                      </Form.Label>

                      <Form.Control
                        type="date"
                        name="date"
                        value={
                          values.date
                        }
                        onChange={
                          handleChange
                        }
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>

                <Modal.Footer
                  style={{
                    borderTop:
                      "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <Button
                    variant="secondary"
                    onClick={
                      handleClose
                    }
                    className="rounded-3"
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={
                      handleSubmit
                    }
                    className="border-0 rounded-3 px-4"
                    style={{
                      background:
                        "linear-gradient(90deg, #7c5cff, #4da5ff)",
                    }}
                  >
                    Save Transaction
                  </Button>
                </Modal.Footer>
              </div>
            </Modal>

            <ToastContainer />
          </Container>
        )}
      </main>
    </div>
  );
};

export default Home;