import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import CircularProgressBar from "../../components/CircularProgressBar";
import LineProgressBar from "../../components/LineProgressBar";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const Analytics = ({ transactions = [] }) => {
  const totalTransactions = transactions.length;

  const incomeTransactions = transactions.filter(
    (item) => item.transactionType === "credit"
  );

  const expenseTransactions = transactions.filter(
    (item) => item.transactionType === "expense"
  );

  const totalIncomeCount = incomeTransactions.length;
  const totalExpenseCount = expenseTransactions.length;

  const totalIncomePercent =
    totalTransactions > 0
      ? (totalIncomeCount / totalTransactions) * 100
      : 0;

  const totalExpensePercent =
    totalTransactions > 0
      ? (totalExpenseCount / totalTransactions) * 100
      : 0;

  const totalTurnover = transactions.reduce(
    (acc, transaction) => acc + Number(transaction.amount || 0),
    0
  );

  const totalTurnoverIncome = incomeTransactions.reduce(
    (acc, transaction) => acc + Number(transaction.amount || 0),
    0
  );

  const totalTurnoverExpense = expenseTransactions.reduce(
    (acc, transaction) => acc + Number(transaction.amount || 0),
    0
  );

  const turnoverIncomePercent =
    totalTurnover > 0
      ? (totalTurnoverIncome / totalTurnover) * 100
      : 0;

  const turnoverExpensePercent =
    totalTurnover > 0
      ? (totalTurnoverExpense / totalTurnover) * 100
      : 0;

  const categories = [
    "Groceries",
    "Rent",
    "Salary",
    "Tip",
    "Food",
    "Medical",
    "Utilities",
    "Entertainment",
    "Transportation",
    "Other",
  ];

  const colors = {
    Groceries: "#a78bfa",
    Rent: "#60a5fa",
    Salary: "#34d399",
    Tip: "#22d3ee",
    Food: "#f472b6",
    Medical: "#fb923c",
    Utilities: "#84cc16",
    Entertainment: "#c084fc",
    Transportation: "#38bdf8",
    Other: "#f87171",
  };

  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

  return (
    <Container fluid className="px-0">
      <Row className="g-3">
        {/* TOTAL TRANSACTIONS */}
        <Col lg={3} md={6}>
          <div className="analytics-card h-100">
            <div className="analytics-card-header">
              <span>Total Transactions</span>
              <strong>{totalTransactions}</strong>
            </div>

            <div className="analytics-card-body">
              <div className="analytics-stat income-stat">
                <div>
                  <span>Income</span>
                  <strong>
                    <ArrowDropUpIcon />
                    {totalIncomeCount}
                  </strong>
                </div>

                <CircularProgressBar
                  percentage={totalIncomePercent.toFixed(0)}
                  color="#34d399"
                />
              </div>

              <div className="analytics-divider" />

              <div className="analytics-stat expense-stat">
                <div>
                  <span>Expense</span>
                  <strong>
                    <ArrowDropDownIcon />
                    {totalExpenseCount}
                  </strong>
                </div>

                <CircularProgressBar
                  percentage={totalExpensePercent.toFixed(0)}
                  color="#f87171"
                />
              </div>
            </div>
          </div>
        </Col>

        {/* TOTAL TURNOVER */}
        <Col lg={3} md={6}>
          <div className="analytics-card h-100">
            <div className="analytics-card-header">
              <span>Total Turnover</span>
              <strong>{formatCurrency(totalTurnover)}</strong>
            </div>

            <div className="analytics-card-body">
              <div className="analytics-money-row income-stat">
                <div>
                  <span>Income</span>
                  <strong>
                    <ArrowDropUpIcon />
                    {formatCurrency(totalTurnoverIncome)}
                  </strong>
                </div>

                <CircularProgressBar
                  percentage={turnoverIncomePercent.toFixed(0)}
                  color="#34d399"
                />
              </div>

              <div className="analytics-divider" />

              <div className="analytics-money-row expense-stat">
                <div>
                  <span>Expense</span>
                  <strong>
                    <ArrowDropDownIcon />
                    {formatCurrency(totalTurnoverExpense)}
                  </strong>
                </div>

                <CircularProgressBar
                  percentage={turnoverExpensePercent.toFixed(0)}
                  color="#f87171"
                />
              </div>
            </div>
          </div>
        </Col>

        {/* CATEGORYWISE INCOME */}
        <Col lg={3} md={6}>
          <div className="analytics-card h-100">
            <div className="analytics-card-header">
              <span>Categorywise Income</span>
            </div>

            <div className="analytics-progress-body">
              {categories.map((category) => {
                const income = incomeTransactions
                  .filter(
                    (transaction) => transaction.category === category
                  )
                  .reduce(
                    (acc, transaction) =>
                      acc + Number(transaction.amount || 0),
                    0
                  );

                const incomePercent =
                  totalTurnover > 0
                    ? (income / totalTurnover) * 100
                    : 0;

                if (income <= 0) return null;

                return (
                  <div key={category} className="analytics-progress-item">
                    <div className="analytics-progress-title">
                      <span>{category}</span>
                      <span>{formatCurrency(income)}</span>
                    </div>

                    <LineProgressBar
                      label=""
                      percentage={incomePercent.toFixed(0)}
                      lineColor={colors[category]}
                    />
                  </div>
                );
              })}

              {totalIncomeCount === 0 && (
                <div className="analytics-empty">
                  No income data available.
                </div>
              )}
            </div>
          </div>
        </Col>

        {/* CATEGORYWISE EXPENSE */}
        <Col lg={3} md={6}>
          <div className="analytics-card h-100">
            <div className="analytics-card-header">
              <span>Categorywise Expenses</span>
            </div>

            <div className="analytics-progress-body">
              {categories.map((category) => {
                const expense = expenseTransactions
                  .filter(
                    (transaction) => transaction.category === category
                  )
                  .reduce(
                    (acc, transaction) =>
                      acc + Number(transaction.amount || 0),
                    0
                  );

                const expensePercent =
                  totalTurnover > 0
                    ? (expense / totalTurnover) * 100
                    : 0;

                if (expense <= 0) return null;

                return (
                  <div key={category} className="analytics-progress-item">
                    <div className="analytics-progress-title">
                      <span>{category}</span>
                      <span>{formatCurrency(expense)}</span>
                    </div>

                    <LineProgressBar
                      label=""
                      percentage={expensePercent.toFixed(0)}
                      lineColor={colors[category]}
                    />
                  </div>
                );
              })}

              {totalExpenseCount === 0 && (
                <div className="analytics-empty">
                  No expense data available.
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Analytics;