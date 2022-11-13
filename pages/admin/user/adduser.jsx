import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiFillEyeInvisible } from "react-icons/ai";
import { FaEye, FaUser } from "react-icons/fa";
import { PageInfo } from "../../../components/admin/common/common";
import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import useStore from "../../../components/context/useStore";

const AddUser = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { handleSubmit, register } = useForm();
  const [loading, setLoading] = useState(false);
  const store = useStore(null);

  async function onsubmit(data) {
    if (data.password.length < 6) {
      return store?.setAlert({
        msg: "Give at least 6 charecters for password",
        type: "info",
      });
    } else if (data.password !== data.confirm_password) {
      return store?.setAlert({
        msg: "Please Check your password carefully",
        type: "info",
      });
    } else delete data.confirm_password;
    setLoading(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    //save data;
    const { error, message } = await store?.addOrEditData(
      "/api/user",
      formData,
      "POST"
    );
    if (!error) {
      store?.setAlert({ msg: message, type: "success" });
    } else {
      store?.setAlert({ msg: message, type: "error" });
    }
    setLoading(false);
  }

  return (
    <DashboardLayout>
      <section>
        <PageInfo title="User" type="Add" icon={<FaUser />} />

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
            <div className="relative">
              <label>Password</label>
              <input
                {...register("password", { required: true })}
                required
                type={showPassword ? "text" : "password"}
                placeholder="Password"
              />
              <button
                type="button"
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
            <div>
              <label style={{ marginLeft: 0, marginBottom: 0 }}>
                User profile
              </label>
              <input {...register("profile")} type="file" />
            </div>

            <div className="flex justify-between">
              <button type="submit" className="btn active text-sm">
                SAVE
              </button>
              <Link href="/admin/user">
                <button
                  type="button"
                  className="btn text-sm"
                  style={{ backgroundColor: "#dc3545", color: "#fff" }}
                >
                  GO BACK
                </button>
              </Link>
            </div>
          </form>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default AddUser;
