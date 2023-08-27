import React, { useEffect, useState } from "react";
import {
  auth,
  logInWithEmailAndPassword,
  signUpEmailAndPassword,
} from "../auth";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import Container from "../components/Container";

function Register() {
  const [user, loading, error] = useAuthState(auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegisterPage, setRegisterPage] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    setEmail("");
    setPassword("");
    setName("");
  }, [isRegisterPage]);

  if (user) {
    return <Navigate to="/plans" />;
  }
  const register = async () => {
    const response = await signUpEmailAndPassword(name, email, password);
    if (response.success) {
      navigate("/plans");
    } else {
      console.log(response.message);
    }
  };
  const login = async () => {
    const response = await logInWithEmailAndPassword(email, password);
    if (response.success) {
      navigate("/plans");
    } else {
      console.log(response.message);
    }
  };

  return (
    <Container className="bg-[#204c94] flex justify-center items-center">
      <div className="flex flex-col p-9 py-10 bg-white  min-w-[350px] rounded-xl gap-4">
        {isRegisterPage ? (
          <>
            <h3 className="w-full text-center font-medium ">Create Account</h3>
            <FieldHolder label={"Name"}>
              <input
                type="text"
                placeholder="Enter Name"
                className="border-[1.5px] p-2 border-gray-300 rounded-md px-3 text-sm"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </FieldHolder>
            <FieldHolder label={"Email"}>
              <input
                type="email"
                placeholder="Enter Email"
                className="border-[1.5px] p-2 border-gray-300 rounded-md px-3 text-sm"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </FieldHolder>
            <FieldHolder label={"Password"}>
              <input
                type="password"
                placeholder="Enter Password"
                className="border-[1.5px] p-2 border-gray-300 rounded-md px-3 text-sm"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </FieldHolder>
            <button
              className="bg-[#204c94] w-full p-2 text-white rounded-md"
              onClick={register}
            >
              Sign up
            </button>
            <p className="w-full text-center">
              Already have an account?{" "}
              <span
                className="text-[#204c94] cursor-pointer font-medium "
                onClick={() => setRegisterPage(false)}
              >
                Login
              </span>
            </p>
          </>
        ) : (
          <>
            <h3 className="w-full text-center font-medium ">
              Login to your account
            </h3>
            <FieldHolder label={"Email"}>
              <input
                type="email"
                placeholder="Enter Email"
                className="border-[1.5px] p-2 border-gray-300 rounded-md px-3 text-sm"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </FieldHolder>
            <FieldHolder label={"Password"}>
              <input
                type="password"
                placeholder="Enter Password"
                className="border-[1.5px] p-2 border-gray-300 rounded-md px-3 text-sm"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </FieldHolder>
            <button
              className="bg-[#204c94] w-full p-2 text-white rounded-md"
              onClick={login}
            >
              Login
            </button>
            <p className="w-full text-center">
              New to MyApp?{" "}
              <span
                className="text-[#204c94] cursor-pointer font-medium "
                onClick={() => setRegisterPage(true)}
              >
                Sign Up
              </span>
            </p>
          </>
        )}
      </div>
    </Container>
  );
}

export default Register;

const FieldHolder = ({ className, label, children }) => {
  return (
    <div className={"flex flex-col gap-1 " + className}>
      <label className="text-xs font-medium" htmlFor="name">
        {label}
      </label>
      {children}
    </div>
  );
};
