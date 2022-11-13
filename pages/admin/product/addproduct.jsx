import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import { RiProductHuntFill } from "react-icons/ri";
import { useForm } from "react-hook-form";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PageInfo } from "../../../components/admin/common/common";
import useStore from "../../../components/context/useStore";
import dynamic from "next/dynamic";
const TextEditor = dynamic(
  () => import("../../../components/admin/common/TextEditor"),
  {
    ssr: false,
  }
);

const AddProduct = () => {
  const [subCategory, setSubCategory] = useState(null);
  const [category, setCategory] = useState(null);
  const { handleSubmit, register, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [showSub, setShowSub] = useState(null);
  const description = useRef(null);
  const store = useStore();

  useEffect(() => {
    (async function () {
      const { data, error } = await store?.fetchData("/api/category");
      if (data) setCategory(data);
      else store?.setAlert({ msg: error, type: "error" });
    })();
    (async function () {
      const { data, error } = await store?.fetchData("/api/subcategory");
      if (data) setSubCategory(data);
      else store?.setAlert({ msg: error, type: "error" });
    })();
  }, []);

  function handleSubCategory(id) {
    if (id) {
      const sub = subCategory?.filter((item) => item.category_id == id);
      if (sub.length) setShowSub(sub);
      else setShowSub(null);
    } else setShowSub(null);
  }

  async function onSubmit(data) {
    if (!description.current?.value) {
      return store?.setAlert({
        msg: "Please add the product description",
        type: "info",
      });
    }
    setLoading(true);
    data.category_name = category?.find(
      (item) => item.id == data.category_id
    )?.name;
    if (data.sub_category_id) {
      data.sub_category_name = subCategory?.find(
        (item) => item.id == data.sub_category_id
      )?.name;
    }
    data.description = description.current?.value;
    data.main_image = data.main_image[0];
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "features_img") {
        formData.append(key, value);
      } else {
        Array.from(value).forEach((img) => {
          formData.append("features_img", img);
        });
      }
    });

    //save data;
    const { error, message } = await store?.addOrEditData(
      "/api/product",
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
        <PageInfo title="Product" type="Add" icon={<RiProductHuntFill />} />

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
                {...register("keyword", { required: true })}
                required
                type="text"
                placeholder="Give input like a | b | c"
              />
            </div>
            <div>
              <label>Product Category</label>
              <select
                {...register("category_id", { required: true })}
                className="w-full"
                required
                onChange={(e) => handleSubCategory(e.target.value)}
              >
                <option value="">select</option>
                {category &&
                  category.length &&
                  category.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label>Product Sub Category</label>
              <select
                className="w-full"
                required={showSub}
                {...register("sub_category_id", { required: showSub })}
              >
                <option value="">select</option>
                {showSub &&
                  showSub.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label>Short Description</label>
              <textarea
                {...register("short_description", { required: true })}
                required
                placeholder="Short Description"
                rows="6"
              />
            </div>
            <div>
              <label>Description</label>
              <TextEditor editorRef={description} />
            </div>
            <div>
              <label style={{ marginLeft: 0, marginBottom: 0 }}>
                Main Image
              </label>
              <input
                {...register("main_image", { required: true })}
                required
                type="file"
              />
            </div>
            <div>
              <label style={{ marginLeft: 0, marginBottom: 0 }}>
                Features Images
              </label>
              <input
                {...register("features_img", { required: true })}
                multiple
                maxLength={5}
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
                UPDATE
              </button>
              <Link href="/admin/product">
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
      </div>
    </DashboardLayout>
  );
};

export default AddProduct;
