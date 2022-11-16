import DashboardLayout from "../../common/DashboardLayout";
import React from "react";
import {
  MainPagesFooterPart,
  MainPagesTopPart,
  NoDataFount,
  PageInfo,
} from "../../common/common";
import { FaInfoCircle } from "react-icons/fa";
import { useForm } from "react-hook-form";

const ReportBody = ({
  title,
  getOrderbyDate,
  setLimit,
  orders,
  count,
  limit,
  page,
  setPage,
}) => {
  const { handleSubmit, register } = useForm();

  //total amount;
  let total = 0;

  return (
    <DashboardLayout>
      <div className="dashboard-home-container">
        <PageInfo title={title} type="View" icon={<FaInfoCircle />} />

        <div className="container">
          <div className="date-picker">
            <form onSubmit={handleSubmit(getOrderbyDate)}>
              <input
                {...register("start_date", { required: true })}
                type="date"
              />
              <input
                {...register("end_date", { required: true })}
                type="date"
              />
              <button className="btn active">Search</button>
            </form>
          </div>
          <MainPagesTopPart setLimit={setLimit} />

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>INVOICE</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.length ? (
                orders.map((item, i) => {
                  total += item.total;
                  return (
                    <React.Fragment key={i}>
                      <tr>
                        <td
                          className={`sn-item ${
                            i % 2 === 0 ? "bg-[#f1f1f1]" : "bg-[#f9f9f9]"
                          }`}
                        >
                          <span>{item.id}</span>
                        </td>
                        <td>{item.created_at.slice(0, 10)}</td>
                        <td>{item.invoice_id}</td>
                        <td>{item.total}</td>
                      </tr>
                      {orders.length - 1 === i && (
                        <tr>
                          <td colSpan={4}>
                            <div className="flex justify-end pr-5 text-yellow-700">
                              <b>Grand Total: {total} BDT</b>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <NoDataFount colSpan={4} />
              )}
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

export default ReportBody;
