import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import useStore from "../../../components/context/useStore";
import React, { useEffect, useReducer, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import {
  MainPagesFooterPart,
  MainPagesTopPart,
  NoDataFount,
  PageInfo,
} from "../../../components/admin/common/common";

const initialState = {
  normal: true,
  date: false,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "normal":
      return { normal: true, date: null };
    case "date":
      return {
        normal: false,
        date: { start_date: action.start_date, end_date: action.end_date },
      };
    default:
      return { normal: true, date: null };
  }
};

const DCancel = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { handleSubmit, register } = useForm();
  const [orders, setOrders] = useState(null);
  const [limit, setLimit] = useState(5);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const store = useStore();

  //get orders ;
  async function getAllOrder() {
    const { data, error } = await store?.fetchData(
      `/api/order?status=canceled&limit=${limit}&page=${page}`
    );
    if (data) {
      setOrders(data.data);
      setCount(data.count);
    } else {
      store?.setAlert({ msg: error, type: "error" });
    }
  }
  useEffect(() => {
    getAllOrder();
  }, []); //till

  //get order by date;
  async function getOrderbyDate(payload) {
    const { data, error } = await store?.fetchData(
      `/api/order?date=true&status=canceled&start=${payload.start_date}&end=${payload.end_date}&limit=${limit}&page=${page}`
    );
    if (data) {
      setOrders(data.data);
      setCount(data.count);
      dispatch({
        type: "date",
        start_date: payload.start_date,
        end_date: payload.end_date,
      });
    } else {
      dispatch("normal");
      store?.setAlert({ msg: error, type: "error" });
    }
  }

  //pagination;
  useEffect(() => {
    if (state.date) {
      getOrderbyDate(state.date);
    } else {
      getAllOrder();
    }
  }, [page, limit]);
  //total amount;
  let total = 0;

  return (
    <DashboardLayout>
      <div className="dashboard-home-container">
        <PageInfo title="Sales Report" type="View" icon={<FaInfoCircle />} />

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

export default DCancel;
