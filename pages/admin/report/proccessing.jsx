import { FaInfoCircle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import React from "react";
import DashboardLayout from "../../../components/admin/common/DashboardLayout";

const DProccessing = () => {
  const { handleSubmit, register } = useForm();
  async function onsubmit(data) {
    console.log(data);
  }

  const data = [
    {
      sn: 1,
      date: "March 20, 2022",
      invoice: "INV-2022032072801",
      total: 2000,
    },
    {
      sn: 2,
      date: "March 20, 2022",
      invoice: "INV-2022032072801",
      total: 2000,
    },
    {
      sn: 3,
      date: "March 20, 2022",
      invoice: "INV-2022032072801",
      total: 2000,
    },
    {
      sn: 4,
      date: "March 20, 2022",
      invoice: "INV-2022032072801",
      total: 2000,
    },
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-home-container">
        <div className="page-info">
          <div className="icon">
            <FaInfoCircle />
          </div>
          <div>
            <h3>Processing Report</h3>
            <p>View Processing Report from here</p>
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
            <div>
              <input type="text" placeholder="Search" />
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>SN</th>
                <th>DATE</th>
                <th>INVOICE</th>
                <th>TOTAL</th>
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
                    >
                      <span>{item.sn}</span>
                    </td>
                    <td>{item.date}</td>
                    <td>{item.invoice}</td>
                    <td>{item.total}</td>
                  </tr>
                </React.Fragment>
              ))}
              <tr>
                <td colSpan={4}>
                  <div className="flex justify-end pr-5 text-yellow-700">
                    <b>Grand Total: {100} BDT</b>
                  </div>
                </td>
              </tr>
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

export default DProccessing;
