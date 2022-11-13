import { menuAnimation } from "../../../components/admin/components/SidebarMenu";
import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import { HiMinusCircle, HiPlusCircle } from "react-icons/hi";
import { FaEye, FaTrash } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { AiTwotoneCustomerService } from "react-icons/ai";
import Link from "next/link";

const DOrder = () => {
  const [showAction, setShowAction] = useState(-1);
  const { handleSubmit, register } = useForm();
  async function onsubmit(data) {
    console.log(data);
  }
  function handleAction(i) {
    setShowAction((prev) => {
      if (prev === i) return -1;
      else return i;
    });
  }

  const data = [
    {
      sn: 1,
      date: "March 20, 2022",
      order: "OR-2022032072801",
      invoice: "INV-2022032072801",
      name: "Abc",
      status: "Processing",
    },
    {
      sn: 2,
      date: "March 20, 2022",
      order: "OR-2022032072801",
      invoice: "INV-2022032072801",
      name: "Abc",
      status: "Processing",
    },
    {
      sn: 3,
      date: "March 20, 2022",
      order: "OR-2022032072801",
      invoice: "INV-2022032072801",
      name: "Abc",
      status: "Processing",
    },
    {
      sn: 4,
      date: "March 20, 2022",
      order: "OR-2022032072801",
      invoice: "INV-2022032072801",
      name: "Abc",
      status: "Processing",
    },
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-home-container">
        <div className="page-info">
          <div className="icon">
            <AiTwotoneCustomerService />
          </div>
          <div>
            <h3>Order Information</h3>
            <p>View Order Information from here</p>
          </div>
        </div>
        <div className="container">
          <div className="date-picker">
            <form onSubmit={handleSubmit(onsubmit)}>
              <input
                {...register("start-date", { required: true })}
                type="date"
              />
              <input
                {...register("end-date", { required: true })}
                type="date"
              />
              <button className="btn active">Search</button>
            </form>
          </div>
          <div className="flex justify-between mb-3">
            <div className="flex gap-3 items-center">
              <select>
                <option value="10">10</option>
                <option value="10">25</option>
                <option value="10">50</option>
                <option value="10">100</option>
              </select>
              <p>items/page</p>
            </div>
            <div className="flex gap-3 items-center">
              <p className="font-medium">Filter Order:</p>
              <select>
                <option value="">ALL</option>
                <option value="processing">Processing</option>
                <option value="shipping">Shipping</option>
                <option value="deliverd">Deliverd</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>SN</th>
                <th>DATE</th>
                <th>ORDER</th>
                <th>INVOICE</th>
                <th>NAME</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => (
                <React.Fragment key={i}>
                  <tr>
                    <td
                      className={`sn-item ${
                        i % 2 === 0 ? "bg-[#f1f1f1]" : "bg-[#f9f9f9]"
                      }`}
                      onClick={() => handleAction(i)}
                    >
                      {showAction !== i ? <HiPlusCircle /> : <HiMinusCircle />}
                      <span>{item.sn}</span>
                    </td>
                    <td>{item.date}</td>
                    <td>{item.order}</td>
                    <td>{item.invoice}</td>
                    <td>{item.name}</td>
                    <td>{item.status}</td>
                  </tr>
                  {showAction === i && (
                    <tr>
                      <td colSpan={6}>
                        <AnimatePresence>
                          <motion.div
                            variants={menuAnimation}
                            initial="hidden"
                            animate="show"
                            exit="hidden"
                            className="flex gap-5 items-center border-x"
                          >
                            <p className="font-bold text-gray-600">Action</p>
                            <div className="flex gap-2">
                              <Link href="/admin/customer/view-order/3">
                                <FaEye className="text-orange-400 w-5" />
                              </Link>
                              <FaTrash className="text-red-500" />
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between mt-6">
            <p className="text-sm">Showing 1 to 10 of 12 entries</p>
            <div className="flex gap-1">
              <button disabled className="btn">
                Previous
              </button>
              <button className="btn active">1</button>
              <button className="btn">Next</button>
            </div>
          </div>
        </div>
        <p className="my-7 text-gray-400 text-sm">
          Copyright © 2022 All Rights Reserved.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default DOrder;
