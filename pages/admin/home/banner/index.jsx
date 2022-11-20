import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaEdit, FaHome, FaTrash } from "react-icons/fa";
import { HiMinusCircle, HiPlusCircle } from "react-icons/hi";
import {
  DocumentHandler,
  MainPagesFooterPart,
  MainPagesTopPart,
  NoDataFount,
  PageInfo,
} from "../../../../components/admin/common/common";
import DashboardLayout from "../../../../components/admin/common/DashboardLayout";
import { menuAnimation } from "../../../../components/admin/components/SidebarMenu";
import useStore from "../../../../components/context/useStore";

const DBanner = () => {
  const [showAction, setShowAction] = useState(-1);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState(null);
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
          `/api/banner?home=true&limit=${limit}&page=${page}`
        );
        if (data) {
          setBanner(data.data);
          setCount(data.count);
        } else store?.setAlert({ msg: error, type: "error" });
      }
    })();
  }, [update, limit, page]);

  async function deleteBanner(id, image) {
    if (!store.user) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("user_id", store.user.id);
    formData.append("id", id);
    formData.append("image", image);
    const { error, message } = await store?.deleteData(`/api/banner`, formData);
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
        <PageInfo title="Baner" type="View" />

        <div className="container">
          <MainPagesTopPart
            addLink="/admin/home/banner/adbanner"
            setLimit={setLimit}
          />

          <table>
            <thead>
              <tr>
                <td>ID</td>
                <td>CATEGORY</td>
                <td>SUB CATEGORY</td>
                <td>IMAGE</td>
              </tr>
            </thead>
            <tbody>
              {banner && banner.length ? (
                banner.map((item, i) => (
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
                      <td>{item.category_name}</td>
                      <td>{item.sub_category_name}</td>
                      <td>
                        <img
                          className="h-5"
                          src={`/assets/${item.image}`}
                          alt=""
                        />
                      </td>
                    </tr>
                    {showAction === i && (
                      <DocumentHandler
                        colSpan={4}
                        deleteHandler={() => deleteBanner(item.id, item.image)}
                        editpage={`/admin/home/banner/editbanner?id=${item.id}`}
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
            showingData={banner?.length || 0}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DBanner;
