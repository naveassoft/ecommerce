import Link from "next/link";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { RiProductHuntFill } from "react-icons/ri";
import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import TextEditor from "../../../components/admin/common/TextEditor";

const EditProduct = () => {
  const description = useRef(null);
  const { handleSubmit, register } = useForm();

  async function onSubmit(data) {}

  const inputs = [
    {
      name: "name",
      label: "Product Name",
      type: "text",
      required: true,
    },
    {
      name: "brand",
      label: "Brand Name",
      type: "text",
      required: true,
    },
    {
      name: "sku",
      label: "SKU",
      type: "text",
      required: true,
    },
    {
      name: "price",
      label: "Product sale price",
      type: "number",
      required: true,
    },
    {
      name: "prev_price",
      label: "Product previous price",
      type: "number",
      required: false,
    },
    {
      name: "tax",
      label: "Tax",
      type: "number",
      required: false,
    },
    {
      name: "stock",
      label: "Product Stock",
      type: "number",
      required: true,
    },
  ];

  return (
    <DashboardLayout>
      <div>
        <div className="page-info">
          <div className="icon">
            <RiProductHuntFill />
          </div>
          <div>
            <h3>Edit Product Information</h3>
            <p>View Edit Product Information from here</p>
          </div>
        </div>
        <div className="add-form">
          <form onSubmit={handleSubmit(onSubmit)}>
            {inputs.map((item, i) => (
              <div key={i}>
                <label>{item.label}</label>
                <input
                  {...register(item.name, { required: item.required })}
                  required={item.required}
                  type={item.type}
                  placeholder={item.label}
                />
              </div>
            ))}
            <div>
              <label>Keywords</label>
              <input
                {...register("keyword")}
                type="text"
                placeholder="Give input like a | b | c"
              />
            </div>
            <div>
              <label>Product Category</label>
              <select
                className="w-full"
                required
                {...register("category", { required: true })}
              >
                <option value="">select</option>
              </select>
            </div>
            <div>
              <label>Product Sub Category</label>
              <select
                className="w-full"
                required
                {...register("sub_category", { required: true })}
              >
                <option value="">select</option>
              </select>
            </div>

            <div>
              <label>Short Description</label>
              <textarea
                {...register("shortf_descriptionh", { required: true })}
                placeholder="Short Description"
                rows="6"
              />
            </div>
            <div>
              <label>Description</label>
              <TextEditor editorRef={description} />
            </div>

            {/* main image */}
            <div className="flex gap-5 items-center">
              <div>
                <label style={{ marginLeft: 0, marginBottom: 0 }}>
                  Main Image
                </label>
                <input
                  {...register("main_img", { required: true })}
                  required
                  type="file"
                />
              </div>
              <div>
                <img className="h-16" src="/assets/product.jpg" alt="" />
              </div>
            </div>

            {/* features image */}
            <div className="flex gap-5 items-center">
              <div>
                <label style={{ marginLeft: 0, marginBottom: 0 }}>
                  Features Images
                </label>
                <input {...register("features_img")} multiple type="file" />
              </div>
              <div>
                <img className="h-16" src="/assets/product.jpg" alt="" />
              </div>
            </div>

            {/* action buttons */}
            <div className="flex justify-between">
              <button type="submit" className="btn active text-sm">
                CREATE
              </button>
              <Link href="/admin/product">
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
      </div>
    </DashboardLayout>
  );
};

export default EditProduct;
