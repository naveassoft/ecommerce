import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiFillEyeInvisible } from "react-icons/ai";
import { FaEye, FaUsers } from "react-icons/fa";
import DashboardLayout from "../../../components/admin/common/DashboardLayout";

const EditVandor = () => {
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
            <FaUsers />
          </div>
          <div>
            <h3>Edit Vandor Information</h3>
            <p>Edit Vandor Information from here</p>
          </div>
        </div>
        <div className="add-form">
          <form onSubmit={handleSubmit(onsubmit)}>
            <div>
              <label>Vandor Name </label>
              <input
                {...register("name", { required: true })}
                required
                type="text"
                placeholder="Vandor Name"
              />
            </div>
            <div>
              <label>Vandor Email </label>
              <input
                {...register("email", { required: true })}
                required
                type="email"
                placeholder="Vandor Email"
              />
            </div>
            <div>
              <label>Shop Name</label>
              <input
                {...register("shop_name", { required: true })}
                required
                type="text"
                placeholder="Shop Name"
              />
            </div>
            <div>
              <label>Trad Liecence</label>
              <input
                {...register("trad_liecence", { required: true })}
                required
                type="text"
                placeholder="Trad Liecence"
              />
            </div>
            <div>
              <label>Shop Location</label>
              <input
                {...register("shop_location", { required: true })}
                required
                type="text"
                placeholder="Shop Location"
              />
            </div>
            <div>
              <label style={{ marginLeft: 0, marginBottom: 0 }}>
                Shop Logo{" "}
              </label>
              <input
                {...register("shop_logo", { required: true })}
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
              <Link href="/admin/vandor">
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

export default EditVandor;
