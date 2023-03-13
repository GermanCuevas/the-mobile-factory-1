import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../state/user";
import { Box, Button, TextField, Typography } from "@mui/material";
import { cartProducts, loginProducts } from "../../state/products";

export const Login = (user) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userLog = await axios.post(
        "http://localhost:3001/users/login",
        { email, password },
        { withCredentials: true }
      );
      
      localStorage.setItem("user", JSON.stringify(userLog.data));
      dispatch(setUser(userLog.data));
      const userCarrito = await axios.get(`http://localhost:3001/carrito/${userLog.data.id}`)
      if (typeof userCarrito.data !== "string") {
        dispatch(loginProducts(userCarrito.data));
      }
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("error login");
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Box sx={{ width: "25%" }}>
          <form onSubmit={handleSubmit}>
            <Typography
              variant="h4"
              align="center"
              style={{ marginBottom: "3rem" }}
            >
              Login
            </Typography>
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ marginBottom: "1rem" }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ marginBottom: "1rem" }}
            />
            <Button variant="contained" type="submit" fullWidth>
              Login
            </Button>
          </form>
        </Box>
      </Box>
    </>
  );
};
