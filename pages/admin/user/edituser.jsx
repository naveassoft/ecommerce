import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiFillEyeInvisible } from "react-icons/ai";
import { FaEye, FaUser } from "react-icons/fa";
import DashboardLayout from "../../../components/admin/common/DashboardLayout";

const EditUser = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { handleSubmit, register } = useForm();

  function onsubmit(data) {
    console.log(data);
  }

  return (
    <DashboardLayout>
      <section>
        <div className="page-info">
          <div className="icon">
            <FaUser />
          </div>
          <div>
            <h3>Edit User Information</h3>
            <p>Edit User Information from here</p>
          </div>
        </div>
        <div className="add-form">
          <form onSubmit={handleSubmit(onsubmit)}>
            <div>
              <label>User Name </label>
              <input
                {...register("name", { required: true })}
                required
                type="text"
                placeholder="User Name"
              />
            </div>
            <div>
              <label>Email </label>
              <input
                {...register("email", { required: true })}
                required
                type="email"
                placeholder="Email"
              />
            </div>
            <div>
              <label style={{ marginLeft: 0, marginBottom: 0 }}>
                User profile
              </label>
              <input
                {...register("profile", { required: true })}
                required
                type="file"
              />
            </div>
            <div className="relative">
              <label>Password</label>
              <input
                {...register("password", { required: true })}
                required
                type={showPassword ? "text" : "password"}
                placeholder="Password"
              />
              <button
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-11"
              >
                {showPassword ? <AiFillEyeInvisible /> : <FaEye />}
              </button>
            </div>
            <div>
              <label>Confirm Password</label>
              <input
                {...register("confirm_password", { required: true })}
                required
                type="password"
                placeholder="Confirm Password"
              />
            </div>

            <div className="flex justify-between">
              <button type="submit" className="btn active text-sm">
                CREATE
              </button>
              <Link href="/admin/user">
                <button
                  type="button"
                  className="btn text-sm"
                  style={{ backgroundColor: "#dc3545", color: "#fff" }}
                >
                  CANCEL
                </button>
              </Link>
            </div>
          </form>
        </div>
        <p className="my-7 text-gray-400 text-sm">
          Copyright © 2022 All Rights Reserved.
        </p>
      </section>
    </DashboardLayout>
  );
};

export default EditUser;
