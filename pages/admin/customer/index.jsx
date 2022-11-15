import { menuAnimation } from "../../../components/admin/components/SidebarMenu";
import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import { HiMinusCircle, HiPlusCircle } from "react-icons/hi";
import { AiTwotoneCustomerService } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import {
  DocumentHandler,
  MainPagesFooterPart,
  MainPagesTopPart,
  NoDataFount,
  PageInfo,
} from "../../../components/admin/common/common";
import useStore from "../../../components/context/useStore";

const AllCustomer = () => {
  const [showAction, setShowAction] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [limit, setLimit] = useState(5);
  const [update, setUpdate] = useState(false);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const store = useStore();

  //get user ;
  useEffect(() => {
    (async function () {
      const { data, error } = await store?.fetchData(
        `/api/order?customer=true&limit=${limit}&page=${page}`
      );
      if (data) {
        setCustomer(data.data);
        setCount(data.count);
      } else {
        setCustomer([]);
        store?.setAlert({ msg: error, type: "error" });
      }
    })();
  }, [update, limit, page]); //till

  function handleAction(i) {
    setShowAction((prev) => {
      if (prev === i) return -1;
      else return i;
    });
  }

  return (
    <DashboardLayout>
      <div className="dashboard-home-container">
        <PageInfo
          title="Customer"
          type="View"
          icon={<AiTwotoneCustomerService />}
        />

        <div className="container">
          <MainPagesTopPart setLimit={setLimit} />

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>JOIN</th>
              </tr>
            </thead>
            <tbody>
              {customer && customer.length ? (
                customer.map((item, i) => (
                  <React.Fragment key={i}>
                    <tr>
                      <td
                        className={`sn-item ${
                          i % 2 === 0 ? "bg-[#f1f1f1]" : "bg-[#f9f9f9]"
                        }`}
                        onClick={() => handleAction(i)}
                      >
                        {showAction !== i ? (
                          <HiPlusCircle />
                        ) : (
                          <HiMinusCircle />
                        )}
                        <span>{item.id}</span>
                      </td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.joined_at.slice(0, 10)}</td>
                    </tr>
                    {showAction === i && (
                      <DocumentHandler
                        colSpan={4}
                        editpage={`/admin/customer/viewcustomer?id=2`}
                        title="view"
                        loading={loading}
                      />
                    )}
                  </React.Fragment>
                ))
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
            showingData={customer?.length || 0}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AllCustomer;
