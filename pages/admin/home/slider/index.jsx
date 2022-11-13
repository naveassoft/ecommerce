import { HiMinusCircle, HiPlusCircle } from "react-icons/hi";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../../components/admin/common/DashboardLayout";
import useStore from "../../../../components/context/useStore";
import {
  DocumentHandler,
  MainPagesFooterPart,
  MainPagesTopPart,
  NoDataFount,
  PageInfo,
} from "../../../../components/admin/common/common";

const DSlider = () => {
  const [showAction, setShowAction] = useState(-1);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [slider, setSlider] = useState(null);
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
          `/api/slider?home=true&limit=${limit}&skip=${page}`
        );
        if (data) {
          setSlider(data.data);
          setCount(data.count);
        } else store?.setAlert({ msg: error, type: "error" });
      }
    })();
  }, [update, page, limit]);

  async function deleteSlider(id, image) {
    setLoading(true);
    const { error, message } = await store?.deleteData(
      `/api/slider?id=${id}&image=${image}`
    );
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
        <PageInfo title="Slider" type="View" />

        <div className="container">
          <MainPagesTopPart
            addLink="/admin/home/slider/addslider"
            setLimit={setLimit}
          />

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>IMAGE</th>
                <th>CATEGORY</th>
              </tr>
            </thead>
            <tbody>
              {slider && slider.length ? (
                slider.map((item, i) => (
                  <React.Fragment key={i}>
                    <tr>
                      <td
                        onClick={() => handleAction(i)}
                        className={`flex items-center gap-1 py-7 px-5 ${
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
                      <td>
                        <img
                          className="h-5"
                          src={`/assets/${item.image}`}
                          alt=""
                        />
                      </td>
                      <td>{item.category_name}</td>
                    </tr>
                    {showAction === i && (
                      <DocumentHandler
                        colSpan={3}
                        editpage={`/admin/home/slider/editslider?id=${item.id}`}
                        loading={loading}
                        deleteHandler={() => deleteSlider(item.id, item.image)}
                      />
                    )}
                  </React.Fragment>
                ))
              ) : (
                <NoDataFount colSpan={3} />
              )}
            </tbody>
          </table>
          <MainPagesFooterPart
            count={count}
            limit={limit}
            page={page}
            setPage={setPage}
            showingData={slider?.length || 0}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DSlider;
