import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useStore from "../../../components/context/useStore";
import Link from "next/link";
import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import { PageInfo } from "../../../components/admin/common/common";

const AdCategory = () => {
  const { handleSubmit, register, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const store = useStore();

  async function onsubmit(data) {
    setLoading(true);
    if (!store.user) return;

    data.image = data.image[0];
    data.user_id = store.user.id;
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    //save data;
    const { error, message } = await store?.addOrEditData(
      "/api/category",
      formData,
      "POST"
    );
    if (!error) {
      store?.setAlert({ msg: message, type: "success" });
      reset();
    } else {
      store?.setAlert({ msg: message, type: "error" });
    }
    setLoading(false);
  }

  return (
    <DashboardLayout>
      <section>
        <PageInfo title="Category" type="Add" />
        <div className="add-form">
          <form onSubmit={handleSubmit(onsubmit)}>
            <div>
              <label>View Priority</label>
              <input
                {...register("priority", { required: true })}
                defaultValue={1}
                required
                type="number"
                placeholder="Piority"
              />
            </div>
            <div>
              <label>Category Name </label>
              <input
                {...register("name", { required: true })}
                required
                type="text"
                placeholder="Category Name"
              />
            </div>
            <div>
              <label>Category Description </label>
              <textarea
                {...register("description", { required: true })}
                rows={5}
                required
                type="text"
                placeholder="Category Description"
              />
            </div>
            <div>
              <label style={{ marginLeft: 0, marginBottom: 0 }}>Image </label>
              <input
                {...register("image", { required: true })}
                required
                type="file"
              />
            </div>
            <div className="flex justify-between">
              <button
                disabled={loading}
                type="submit"
                className="btn active text-sm"
              >
                SAVE
              </button>
              <Link href="/admin/home">
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

export default AdCategory;
