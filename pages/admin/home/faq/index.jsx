import DashboardLayout from "../../../../components/admin/common/DashboardLayout";
import useStore from "../../../../components/context/useStore";
import { HiMinusCircle, HiPlusCircle } from "react-icons/hi";
import React, { useEffect, useState } from "react";
import {
  DocumentHandler,
  MainPagesFooterPart,
  MainPagesTopPart,
  NoDataFount,
  PageInfo,
} from "../../../../components/admin/common/common";

const DFAQ = () => {
  const [showAction, setShowAction] = useState(-1);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [faq, setFaq] = useState(null);
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
  useEffect(() => {
    (async function () {
      if (store) {
        const { data, error } = await store?.fetchData(
          `/api/faq?home=true&limit=${limit}&skip=${page}`
        );
        if (data) {
          setFaq(data.data);
          setCount(data.count);
        } else store?.setAlert({ msg: error, type: "error" });
      }
    })();
  }, [update, limit, page]);

  async function deleteFaq(id) {
    setLoading(true);
    const { error, message } = await store?.deleteData(`/api/faq?id=${id}`);
    if (!error) {
      store?.setAlert({ msg: message, type: "success" });
      setUpdate((prev) => !prev);
    } else {
      store?.setAlert({ msg: message, type: "error" });
    }
    setLoading(false);
  }

  return (
    <DashboardLayout>
      <div className="dashboard-home-container">
        <PageInfo title="FAQ" type="View" />

        <div className="container">
          <MainPagesTopPart
            addLink="/admin/home/faq/addfaq"
            setLimit={setLimit}
          />

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>QUESTION</th>
              </tr>
            </thead>
            <tbody>
              {faq && faq.length ? (
                faq.map((item, i) => (
                  <React.Fragment key={i}>
                    <tr>
                      <td
                        onClick={() => handleAction(i)}
                        className={`flex items-center gap-1 w-20 ${
                          i % 2 === 0 ? "bg-[#f1f1f1]" : "bg-[#f9f9f9]"
                        }`}
                      >
                        {showAction !== i ? (
                          <HiPlusCircle />
                        ) : (
                          <HiMinusCircle />
                        )}
                        <span>{item.id}</span>
                      </td>
                      <td>{item.question}</td>
                    </tr>
                    {showAction === i && (
                      <DocumentHandler
                        colSpan={2}
                        deleteHandler={() => deleteFaq(item.id)}
                        editpage={`/admin/home/faq/editfaq?id=${item.id}`}
                        loading={loading}
                      />
                    )}
                  </React.Fragment>
                ))
              ) : (
                <NoDataFount colSpan={2} />
              )}
            </tbody>
          </table>
          <MainPagesFooterPart
            count={count}
            limit={limit}
            page={page}
            setPage={setPage}
            showingData={faq?.length || 0}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DFAQ;
