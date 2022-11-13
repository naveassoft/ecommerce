import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiFillEyeInvisible } from "react-icons/ai";
import { FaEye, FaUsers } from "react-icons/fa";
import { PageInfo } from "../../../components/admin/common/common";
import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import useStore from "../../../components/context/useStore";

const EditVandor = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { handleSubmit, register } = useForm();
  const [loading, setLoading] = useState(false);
  const [vandor, setVandor] = useState(null);
  const store = useStore();
  const router = useRouter();

  useEffect(() => {
    if (router.query.id) {
      (async function () {
        const { data, error } = await store?.fetchData(
          `/api/vandor?id=${router.query.id}`
        );
        if (data) setVandor(data[0]);
        else {
          store?.setAlert({ msg: error, type: "error" });
          router.push("/admin/home/vandor");
        }
      })();
    }
  }, [router.query.id]);

  async function onsubmit(data) {
    if (!vandor) return;

    setLoading(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    //save data;
    const { error, message } = await store?.addOrEditData(
      `/api/vandor?id=${vandor.id}`,
      formData,
      "PUT"
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
        <PageInfo title="Vendor" type="Edit" icon={<FaUsers />} />

        <div className="add-form">
          <form onSubmit={handleSubmit(onsubmit)}>
            <div>
              <label>Vandor Name </label>
              <input
                {...register("name")}
                defaultValue={vandor?.name}
                type="text"
                placeholder="Vandor Name"
              />
            </div>
            <div>
              <label>Vandor Email </label>
              <input
                {...register("email")}
                type="email"
                defaultValue={vandor?.email}
                readOnly
                placeholder="Vandor Email"
              />
            </div>
            <div>
              <label>Shop Name</label>
              <input
                {...register("shop_name")}
                type="text"
                defaultValue={vandor?.shop_name}
                placeholder="Shop Name"
              />
            </div>
            <div>
              <label>Trad Liecence</label>
              <input
                {...register("trad_liecence")}
                type="text"
                defaultValue={vandor?.trad_liecence}
                placeholder="Trad Liecence"
              />
            </div>
            <div>
              <label>Shop Location</label>
              <input
                {...register("shop_location")}
                type="text"
                defaultValue={vandor?.shop_location}
                placeholder="Shop Location"
              />
            </div>
            <div className="relative">
              <label>Password</label>
              <input
                {...register("password")}
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

            <div className="flex justify-between">
              <button type="submit" className="btn active text-sm">
                UPDATE
              </button>
              <Link href="/admin/vandor">
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

export default EditVandor;
