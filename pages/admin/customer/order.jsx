import { menuAnimation } from "../../../components/admin/components/SidebarMenu";
import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import { HiMinusCircle, HiPlusCircle } from "react-icons/hi";
import { FaEye, FaTrash } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { AiTwotoneCustomerService } from "react-icons/ai";
import Link from "next/link";
import {
  DocumentHandler,
  MainPagesFooterPart,
  MainPagesTopPart,
  PageInfo,
} from "../../../components/admin/common/common";
import useStore from "../../../components/context/useStore";

const DOrder = () => {
  const [showAction, setShowAction] = useState(-1);
  const { handleSubmit, register } = useForm();
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [filtered, setfiltered] = useState("");
  const [orders, setOrders] = useState(null);
  const [limit, setLimit] = useState(5);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const store = useStore();

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

  const filterOpt = [
    { txt: "Processing", value: "processing" },
    { txt: "shipping", value: "Shipping" },
    { txt: "deliverd", value: "Deliverd" },
    { txt: "canceled", value: "Canceled" },
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-home-container">
        <PageInfo
          title="Order"
          icon={<AiTwotoneCustomerService />}
          type="View"
        />

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
          <MainPagesTopPart
            setFilter={setfiltered}
            filterOpt={filterOpt}
            setLimit={setLimit}
          />

          <table>
            <thead>
              <tr>
                <th>ID</th>
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
                    <DocumentHandler
                      colSpan={6}
                      editpage={`/admin/cutomer/order?id=${2}`}
                      deleteHandler={() => console.log("click")}
                      loading={loading}
                    />
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <MainPagesFooterPart
            count={count}
            limit={limit}
            page={page}
            setPage={setPage}
            showingData={orders?.length || 0}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DOrder;
