import React, { useState } from "react";
import { useForm } from "react-hook-form";

const login = () => {
  const { handleSubmit, register } = useForm();
  const [login, setLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(data) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        console.log(result);
      } else throw result;
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  }

  return (
    <div className="bg-[#1D2939] min-h-screen overflow-auto relative">
      <div className="login-container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <h3>
              <span>[</span> Navieasoft LTD <span>]</span>
            </h3>
            <h4>{login ? "Sign In" : "Sign Up"}</h4>
          </div>
          <div className="space-y-4">
            {!login && (
              <input
                {...register("name", { required: true })}
                required
                type="text"
                placeholder="Enter your name"
              />
            )}

            <input
              {...register("email", { required: true })}
              required
              type="text"
              placeholder="Enter your email"
            />
            <input
              {...register("password", { required: true })}
              required
              type="password"
              placeholder="Enter your password"
            />
            <button type="button">
              <p className="pl-3 text-blue-400">Forgot Your Password?</p>
            </button>
          </div>
          <div>
            {error && <p className="text-red-400 mb-2">{error}</p>}
            <button
              disabled={loading}
              type="submit"
              className="btn active w-full"
            >
              {login ? "Sign in" : "Sign up"}
            </button>
          </div>
        </form>
        <div>
          <p className="text-center my-5">---------- Or ---------</p>
          <button type="button" className="btn social-btn">
            <img className="h-8" src="/google.png" alt="" />
            <span>Google</span>
          </button>
          <button type="button" className="btn social-btn mt-3">
            <img className="h-8" src="/facebook.png" alt="" />
            <span>Facebook</span>
          </button>
        </div>
        <div className="flex gap-2 justify-center mt-4">
          <p className="text-gray-600">
            {login ? "Not yet a member" : "Already have a acount"}?
          </p>
          <button
            onClick={() => setLogin((prev) => !prev)}
            type="button"
            className="text-[#17A2B8]"
          >
            {login ? " Sign Up" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default login;
