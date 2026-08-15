import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerAPI } from "../../utils/ApiRequest";
import axios from "axios";
import "./auth.css";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

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

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password } = values;

    if (!name || !email || !password) {
      toast.error("Please fill in all fields", toastOptions);
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(registerAPI, {
        name,
        email,
        password,
      });

      if (data.success === true) {
        if (data.user) {
          const user = { ...data.user };
          delete user.password;

          localStorage.setItem("user", JSON.stringify(user));
        }

        toast.success(data.message, toastOptions);

        setTimeout(() => {
          navigate("/");
        }, 500);
      } else {
        toast.error(
          data.message || "Registration failed",
          toastOptions
        );
      }
    } catch (error) {
      console.error("Registration error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to register. Please try again.",
        toastOptions
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-glow auth-glow-one"></div>
      <div className="auth-glow auth-glow-two"></div>

      <div className="auth-card">
        <div className="auth-logo">
          <AccountBalanceWalletIcon />
        </div>

        <div className="auth-brand">SpendWise</div>

        <h1 className="auth-title">Create your account</h1>

        <p className="auth-subtitle">
          Start managing your money smarter today.
        </p>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Full name</Form.Label>

            <Form.Control
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={values.name}
              onChange={handleChange}
              className="auth-input"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>

            <Form.Control
              type="email"
              name="email"
              placeholder="Enter your email"
              value={values.email}
              onChange={handleChange}
              className="auth-input"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>

            <Form.Control
              type="password"
              name="password"
              placeholder="Create a password"
              value={values.password}
              onChange={handleChange}
              className="auth-input"
            />
          </Form.Group>

          <Button
            type="submit"
            className="auth-primary-btn w-100 mt-3"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </Form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </p>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Register;