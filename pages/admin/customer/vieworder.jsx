import React from "react";
import { useForm } from "react-hook-form";
import { FaShippingFast } from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import DashboardLayout from "../../../components/admin/common/DashboardLayout";

const ViewOrder = () => {
  const { handleSubmit, register } = useForm();
  const status = ["processing", "shipping", "delivered", "canceled"];
  function onSubmit(data) {}

  const data = [
    {
      sn: 1,
      image: "/assets/product.jpg",
      name: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Delectus, atque! Nobis temporibus reiciendis ad accusamus labore earum veritatis culpa fugit.",
      price: 2000,
      qty: 1,
      total: 2000,
    },
    {
      sn: 2,
      image: "/assets/product.jpg",
      name: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Delectus, atque! Nobis temporibus reiciendis ad accusamus labore earum veritatis culpa fugit.",
      price: 2000,
      qty: 1,
      total: 2000,
    },
  ];

  return (
    <DashboardLayout>
      <section>
        <div className="page-info">
          <div className="icon">
            <FaShippingFast />
          </div>
          <div>
            <h3>Detail of Order</h3>
            <p>View Detail of Order from here</p>
          </div>
        </div>
        <div className="order-deatils-container">
          <p className="text-gray-500 bg-gray-100 p-2 rounded-t w-fit">
            Order Shipments
          </p>
          <section className="wrapper">
            <div className="icons-wrapper">
              <div>
                <div>
                  <GiCheckMark />
                </div>
                <p>Processing</p>
              </div>
              <div>
                <div>
                  <GiCheckMark />
                </div>
                <p>Shipping</p>
              </div>
              <div>
                <div>
                  <GiCheckMark />
                </div>
                <p>Delivered</p>
              </div>
            </div>
            <div className="bg-[#C53600] h-6"></div>
            <div className="order-info">
              <div className="flex gap-2 items-center">
                <div>
                  <img
                    className="object-contain h-14"
                    src="/shop-logo.png"
                    alt="logo"
                  />
                </div>
                <p className="leading-5">
                  Amirastore <br /> Banasree,Rampura Dhaka <br /> 01677052152
                  <br />
                  safihealth123@gmail.com
                </p>
              </div>
              <div>
                <h3 className="text-center text-xl font-medium">INVOICE</h3>
                <hr />
                <p>
                  November 8, 2022 <br /> INV-2022032072801
                </p>
              </div>
            </div>
            <div className="shipping-info">
              <div>
                <h3>SHIP TO</h3>
                <hr />
                <p>
                  Abc <br /> hurairaha8249@gmail.com <br /> 01636141891 <br />{" "}
                  asds
                </p>
              </div>
              <div>
                <h3>BILL TO</h3>
                <hr />
                <p>
                  Abc <br /> hurairaha8249@gmail.com <br /> 01636141891 <br />{" "}
                  asds
                </p>
              </div>
            </div>
            <div className="px-2">
              <table>
                <thead>
                  <tr>
                    <td>SN</td>
                    <td>Image</td>
                    <td>Product Name</td>
                    <td>Price</td>
                    <td>Qty</td>
                    <td>Total</td>
                  </tr>
                </thead>
                <tbody>
                  {data.map((product) => (
                    <tr key={product.sn}>
                      <td>{product.sn}</td>
                      <td>
                        <img
                          className="h-14 object-contain w-16"
                          src={product.image}
                          alt="img"
                        />
                      </td>
                      <td className="text-[#0866C6]">{product.name}</td>
                      <td className="text-red-500">${product.price}</td>
                      <td>{product.qty}</td>
                      <td className="text-red-500">${product.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="total-calc-wrapper">
                <div>
                  <div>
                    <h4>Sub Total</h4>
                    <p className="text-red-500">$4000</p>
                  </div>
                  <div>
                    <h4>Tax</h4>
                    <p className="text-red-500">$30</p>
                  </div>
                  <div>
                    <h4>Shipping & Handling</h4>
                    <p className="text-red-500">$400</p>
                  </div>
                  <div>
                    <h4>Grand Total</h4>
                    <p className="text-red-500">$6000</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#C53600] h-2 mb-8 mt-5"></div>
              <div className="flex justify-end mb-5">
                <button className="btn">Print</button>
              </div>
            </div>
          </section>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="my-5 px-7 text-gray-500"
          >
            <div className="flex gap-5 items-center">
              <label htmlFor="status">Update Status</label>
              <select {...register("status")} className="w-[85%]" name="status">
                {status.map((st, i) => (
                  <option key={i} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-3 flex justify-center">
              <button className="px-10 py-2 bg-green-500 text-white rounded text-sm">
                Update
              </button>
            </div>
          </form>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default ViewOrder;
