import DashboardLayout from "../../../components/admin/common/DashboardLayout";
import { HiMinusCircle, HiPlusCircle } from "react-icons/hi";
import useStore from "../../../components/context/useStore";
import { RiProductHuntFill } from "react-icons/ri";
import React, { useState } from "react";
import {
  DocumentHandler,
  MainPagesFooterPart,
  MainPagesTopPart,
  PageInfo,
} from "../../../components/admin/common/common";

const Products = () => {
  const [showAction, setShowAction] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [products, setProducts] = useState(null);
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
      name: "Baby Walker",
      image: "/assets/product.jpg",
      price: 2000,
      stock: 5,
    },
    {
      sn: 2,
      name: "Baby Walker",
      image: "/assets/product.jpg",
      price: 2000,
      stock: 5,
    },
    {
      sn: 3,
      name: "Baby Walker",
      image: "/assets/product.jpg",
      price: 2000,
      stock: 5,
    },
    {
      sn: 4,
      name: "Baby Walker",
      image: "/assets/product.jpg",
      price: 2000,
      stock: 5,
    },
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-home-container">
        <PageInfo title="Product" type="View" icon={<RiProductHuntFill />} />

        <div className="container">
          <MainPagesTopPart
            addLink="/admin/product/addproduct"
            setLimit={setLimit}
          />

          <table>
            <thead>
              <tr>
                <th>SN</th>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
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
                    <td>
                      <img
                        className="h-5 object-contain"
                        src={item.image}
                        alt=""
                      />
                    </td>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>{item.stock}</td>
                  </tr>
                  {showAction === i && (
                    <DocumentHandler
                      colSpan={4}
                      editpage={`/admin/product/editproduct?id=${item.id}`}
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
            showingData={products?.length || 0}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Products;
