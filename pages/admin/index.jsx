import React from "react";
import { FaHome } from "react-icons/fa";
import { GiWorld } from "react-icons/gi";
import { MdOutlineLocalShipping } from "react-icons/md";
import { BsFillBagCheckFill, BsHandbag } from "react-icons/bs";
import DashboardLayout from "../../components/admin/common/DashboardLayout";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="dashboar-wrapper">
        <div className="page-info items-center">
          <div className="icon">
            <FaHome />
          </div>
          <div>
            <h3>Dashboard</h3>
          </div>
        </div>

        <div className="report_wrapper">
          <div className="bg-[#17A2B8]">
            <div className="flex items-center">
              <GiWorld />
            </div>
            <div>
              <h3>TOTAL PRODUCTS</h3>
              <p className="text-2xl font-semibold">590</p>
              <p>24% higher previous month</p>
            </div>
          </div>
          <div className="bg-[#6f42c1]">
            <div className="flex items-center">
              <BsHandbag />
            </div>
            <div>
              <h3>TODAY's SALES</h3>
              <p className="text-2xl font-semibold">$329,291</p>
              <p>24% higher yesterday</p>
            </div>
          </div>
          <div className="bg-[#1CAF9A]">
            <div className="flex items-center">
              <BsFillBagCheckFill />
            </div>
            <div>
              <h3>TODAY'S ORDER</h3>
              <p className="text-2xl font-semibold">220</p>
              <p>2% higher yesterday</p>
            </div>
          </div>
          <div className="bg-[#0866C6]">
            <div className="flex items-center">
              <MdOutlineLocalShipping />
            </div>
            <div>
              <h3>PENDING ORDER</h3>
              <p className="text-2xl font-semibold">20</p>
              <p>See the orders</p>
            </div>
          </div>
          <div className="bg-[#c62408a5]">
            <div className="flex items-center">
              <MdOutlineLocalShipping />
            </div>
            <div>
              <h3>CANCELED ORDER</h3>
              <p className="text-2xl font-semibold">20</p>
              <p>24% higher yesterday</p>
            </div>
          </div>
          <div className="bg-[#c69608d7]">
            <div className="flex items-center">
              <MdOutlineLocalShipping />
            </div>
            <div>
              <h3>LOW STOCK PRODUCT</h3>
              <p className="text-2xl font-semibold">20</p>
              <p>24% higher yesterday</p>
            </div>
          </div>
          <div className="bg-[#18c608cd]">
            <div className="flex items-center">
              <MdOutlineLocalShipping />
            </div>
            <div>
              <h3>TOP SOLD PRODUCT</h3>
              <p className="text-2xl font-semibold">20</p>
              <p>24% higher yesterday</p>
            </div>
          </div>
          <div className="bg-[#1CAF9A]">
            <div className="flex items-center">
              <MdOutlineLocalShipping />
            </div>
            <div>
              <h3>TOTAL VANDORS</h3>
              <p className="text-2xl font-semibold">20</p>
              <p>24% higher yesterday</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
