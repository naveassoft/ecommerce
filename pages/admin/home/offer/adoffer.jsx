import DashboardLayout from "../../../../components/admin/common/DashboardLayout";
import { PageInfo } from "../../../../components/admin/common/common";
import useStore from "../../../../components/context/useStore";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import Link from "next/link";

const AdOffer = () => {
  const { handleSubmit, register, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const store = useStore();

  async function onsubmit(data) {
    if (!store.user) return;
    setLoading(true);
    data.user_id = store.user.id;
    data.image = data.image[0];
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    //save data;
    const { error, message } = await store?.addOrEditData(
      "/api/offer",
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
        <PageInfo title="Special Offer" type="Add" />

        <div className="add-form">
          <form onSubmit={handleSubmit(onsubmit)}>
            <div>
              <label>View Priority</label>
              <input
                {...register("priority", { required: true })}
                defaultValue={1}
                required
                type="number"
                placeholder="Priority"
              />
            </div>
            <div>
              <label>Title </label>
              <input
                {...register("title", { required: true })}
                required
                type="text"
                placeholder="Title"
              />
            </div>
            <div>
              <label>Product Link </label>
              <input
                {...register("product_link", { required: true })}
                required
                type="url"
                placeholder="Product link"
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
              <Link href="/admin/home/offer">
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

export default AdOffer;
