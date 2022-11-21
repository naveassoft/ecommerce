import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsFillBagCheckFill, BsHandbag } from "react-icons/bs";
import { GiWorld } from "react-icons/gi";
import { MdOutlineLocalShipping } from "react-icons/md";
import useStore from "../../context/useStore";
import { Amount } from "../common/common";

const Report = () => {
  const [report, setReport] = useState(null);
  const store = useStore();

  useEffect(() => {
    (async function () {
      const { data, error } = await store?.fetchData(
        `/api/dashboard?report=true`
      );
      if (data) {
        setReport(data);
      } else store?.setAlert({ msg: error, type: "error" });
    })();
  }, []);

  return (
    <div className="report_wrapper">
      <div className="bg-[#17A2B8]">
        <div className="flex items-center">
          <GiWorld />
        </div>
        <div>
          <Link href="/admin/product">
            <h3>TOTAL PRODUCTS</h3>
            <p className="text-2xl font-semibold">{report?.total_product}</p>
            <p>see all product</p>
          </Link>
        </div>
      </div>
      <div className="bg-[#6f42c1]">
        <div className="flex items-center">
          <BsHandbag />
        </div>
        <div>
          <h3>TOTAL SALES</h3>
          <p className="text-2xl font-semibold">
            <Amount page="dashboard" value={report?.total_sale} />
          </p>
          <p>24% higher yesterday</p>
        </div>
      </div>
      <div className="bg-[#1CAF9A]">
        <div className="flex items-center">
          <BsFillBagCheckFill />
        </div>
        <div>
          <h3>TODAY'S ORDER</h3>
          <p className="text-2xl font-semibold">{report?.todaysOrder}</p>
          <p>2% higher yesterday</p>
        </div>
      </div>
      <div className="bg-[#0866C6]">
        <div className="flex items-center">
          <MdOutlineLocalShipping />
        </div>
        <div>
          <h3>PENDING ORDER</h3>
          <p className="text-2xl font-semibold">{report?.pendingOrder}</p>
          <p>See the orders</p>
        </div>
      </div>
      <div className="bg-[#c62408a5]">
        <div className="flex items-center">
          <MdOutlineLocalShipping />
        </div>
        <div>
          <h3>CANCELED ORDER</h3>
          <p className="text-2xl font-semibold">{report?.canceledOrder}</p>
          <p>24% higher yesterday</p>
        </div>
      </div>
      <div className="bg-[#c69608d7]">
        <div className="flex items-center">
          <MdOutlineLocalShipping />
        </div>
        <div>
          <h3>LOW STOCK PRODUCT</h3>
          <p className="text-2xl font-semibold">{report?.lowStockProduct}</p>
          <p>24% higher yesterday</p>
        </div>
      </div>
      <div className="bg-[#18c608cd]">
        <div className="flex items-center">
          <MdOutlineLocalShipping />
        </div>
        <div>
          <h3>TOP SOLD PRODUCT</h3>
          <p className="text-2xl font-semibold">{report?.topSoldProduct}</p>
          <p>24% higher yesterday</p>
        </div>
      </div>
      <div className="bg-[#1CAF9A]">
        <div className="flex items-center">
          <MdOutlineLocalShipping />
        </div>
        <div>
          <h3>TOTAL VANDORS</h3>
          <p className="text-2xl font-semibold">{report?.totalVandor}</p>
          <p>24% higher yesterday</p>
        </div>
      </div>
    </div>
  );
};

export default Report;
