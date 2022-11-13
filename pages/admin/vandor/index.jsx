import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import useStore from "../../../components/context/useStore";
import { HiMinusCircle, HiPlusCircle } from "react-icons/hi";
import { FaUsers } from "react-icons/fa";
import React, { useState } from "react";
import {
  DocumentHandler,
  MainPagesFooterPart,
  MainPagesTopPart,
  PageInfo,
} from "../../../components/admin/common/common";

const Vandor = () => {
  const [showAction, setShowAction] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [filtered, setfiltered] = useState("");
  const [user, setUser] = useState(null);
  const [limit, setLimit] = useState(5);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const store = useStore();

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
        <PageInfo title="Vendor" type="View" icon={<FaUsers />} />

        <div className="container">
          <MainPagesTopPart
            addLink="/admin/vandor/addvandor"
            setLimit={setLimit}
          />

          <table>
            <thead>
              <tr>
                <th>ID</th>
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
                    <DocumentHandler
                      colSpan={4}
                      editpage={`/admin/vandor/editvandor?id=2`}
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
            showingData={0}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Vandor;
