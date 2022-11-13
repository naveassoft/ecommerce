import { menuAnimation } from "../../../components/admin/components/SidebarMenu";
import { HiMinusCircle, HiPlusCircle } from "react-icons/hi";
import { AnimatePresence, motion } from "framer-motion";
import { FaEdit, FaTrash, FaUsers } from "react-icons/fa";
import React, { useState } from "react";
import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import Link from "next/link";

const Vandor = () => {
  const [showAction, setShowAction] = useState(-1);
  function handleAction(i) {
    setShowAction((prev) => {
      if (prev === i) return -1;
      else return i;
    });
  }
  const data = [
    {
      sn: 1,
      type: "Vador",
      name: "Md Kader",
      email: "kader@gmail.com",
    },
    {
      sn: 2,
      type: "Vador",
      name: "Md Kader",
      email: "kader@gmail.com",
    },
    {
      sn: 3,
      type: "Vador",
      name: "Md Kader",
      email: "kader@gmail.com",
    },
    {
      sn: 4,
      type: "Vador",
      name: "Md Kader",
      email: "kader@gmail.com",
    },
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-home-container">
        <div className="page-info">
          <div className="icon">
            <FaUsers />
          </div>
          <div>
            <h3>Vendor Information</h3>
            <p>View Vendor Information from here</p>
          </div>
        </div>
        <div className="container">
          <div className="flex justify-end mb-3">
            <Link href="/admin/vandor/addvandor">
              <button className="red-btn">
                <span>New</span> <HiPlusCircle />
              </button>
            </Link>
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
            <div>
              <input type="text" placeholder="Search" />
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>SN</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>TYPE</th>
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
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.type}</td>
                  </tr>
                  {showAction === i && (
                    <tr>
                      <td colSpan={4}>
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
                              <Link href="/admin/vandor/editvandor">
                                <FaEdit className="text-orange-400" />
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

export default Vandor;
