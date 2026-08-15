import React, { useEffect, useState } from "react";
import {
  Navbar,
  Nav,
  Button,
  Container,
  Modal,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LockResetIcon from "@mui/icons-material/LockReset";
import LogoutIcon from "@mui/icons-material/Logout";

import axios from "axios";
import "./style.css";

const Header = ({ onAddTransaction }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [showAccount, setShowAccount] = useState(false);
  const [showPasswordModal, setShowPasswordModal] =
    useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordLoading, setPasswordLoading] =
    useState(false);

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error(
          "Error reading user data:",
          error
        );
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const openPasswordModal = () => {
    setShowAccount(false);
    setShowPasswordModal(true);
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const submitPasswordChange = async (e) => {
    e.preventDefault();

    if (!user?._id) {
      alert("User information not found. Please login again.");
      return;
    }

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      alert("Please fill in all password fields.");
      return;
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      alert("New passwords do not match.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert(
        "New password must be at least 6 characters."
      );
      return;
    }

    try {
      setPasswordLoading(true);

      const { data } = await axios.put(
        "http://localhost:5000/api/auth/change-password",
        {
          userId: user._id,
          currentPassword:
            passwordData.currentPassword,
          newPassword:
            passwordData.newPassword,
        }
      );

      if (data.success === true) {
        alert("Password changed successfully.");
        closePasswordModal();
      } else {
        alert(
          data.message ||
            "Unable to change password."
        );
      }
    } catch (error) {
      console.error(
        "Password change error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Unable to change password."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <>
      <Navbar
        expand="lg"
        className="spendwise-navbar"
      >
        <Container
          fluid
          className="px-3 px-md-4 px-lg-5"
        >
          {/* BRAND */}
          <Navbar.Brand
            onClick={() => navigate("/")}
            className="spendwise-brand"
            style={{ cursor: "pointer" }}
          >
            <div className="brand-icon">
              S
            </div>

            <div>
              <div className="brand-name">
                SpendWise
              </div>

              <div className="brand-subtitle">
                Personal Finance
              </div>
            </div>
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="spendwise-navbar"
            className="spendwise-toggler"
          />

          <Navbar.Collapse id="spendwise-navbar">
            <Nav className="ms-auto align-items-lg-center gap-lg-3">

              {/* ADD TRANSACTION */}
              {user && (
                <Button
                  className="header-add-btn"
                  onClick={onAddTransaction}
                >
                  <AddCircleOutlineIcon fontSize="small" />

                  <span>
                    Add Transaction
                  </span>
                </Button>
              )}

              {user ? (
                <div className="d-flex align-items-center gap-3">

                  {/* ACCOUNT */}
                  <button
                    type="button"
                    className="user-profile user-profile-button"
                    onClick={() =>
                      setShowAccount(!showAccount)
                    }
                  >
                    <AccountCircleIcon className="profile-icon" />

                    <div className="profile-info">
                      <span className="profile-name">
                        {user.name ||
                          user.username ||
                          "User"}
                      </span>

                      <span className="profile-label">
                        Personal Account
                      </span>
                    </div>
                  </button>

                  {/* LOGOUT */}
                  <Button
                    className="logout-btn"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>

                </div>
              ) : (
                <Button
                  className="login-btn"
                  onClick={handleLogin}
                >
                  Login
                </Button>
              )}

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ACCOUNT MENU */}
      {showAccount && user && (
        <div className="account-menu">

          <div className="account-menu-header">
            <AccountCircleIcon />

            <div>
              <strong>
                {user.name || "User"}
              </strong>

              <span>
                {user.email}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="account-menu-item"
            onClick={openPasswordModal}
          >
            <LockResetIcon />

            <span>
              Change Password
            </span>
          </button>

          <button
            type="button"
            className="account-menu-item account-menu-logout"
            onClick={handleLogout}
          >
            <LogoutIcon />

            <span>
              Logout
            </span>
          </button>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      <Modal
        show={showPasswordModal}
        onHide={closePasswordModal}
        centered
      >
        <div className="password-modal">

          <Modal.Header
            closeButton
            closeVariant="white"
          >
            <Modal.Title>
              Change Password
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>

            <Form
              onSubmit={
                submitPasswordChange
              }
            >

              <Form.Group className="mb-3">
                <Form.Label>
                  Current Password
                </Form.Label>

                <Form.Control
                  type="password"
                  name="currentPassword"
                  value={
                    passwordData.currentPassword
                  }
                  onChange={
                    handlePasswordChange
                  }
                  placeholder="Enter current password"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  New Password
                </Form.Label>

                <Form.Control
                  type="password"
                  name="newPassword"
                  value={
                    passwordData.newPassword
                  }
                  onChange={
                    handlePasswordChange
                  }
                  placeholder="Enter new password"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Confirm New Password
                </Form.Label>

                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={
                    passwordData.confirmPassword
                  }
                  onChange={
                    handlePasswordChange
                  }
                  placeholder="Confirm new password"
                />
              </Form.Group>

              <div className="password-modal-actions">

                <Button
                  variant="secondary"
                  type="button"
                  onClick={
                    closePasswordModal
                  }
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="password-save-btn"
                  disabled={
                    passwordLoading
                  }
                >
                  {passwordLoading
                    ? "Changing..."
                    : "Change Password"}
                </Button>

              </div>

            </Form>

          </Modal.Body>
        </div>
      </Modal>
    </>
  );
};

export default Header;