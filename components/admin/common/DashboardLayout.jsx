import { AnimatePresence, motion } from "framer-motion";
import { menus, vendorMenu } from "../../../services/admin/menus";
import { AiOutlineClear } from "react-icons/ai";
import useStore from "../../context/useStore";
import { FaBars } from "react-icons/fa";
import { useRouter } from "next/router";
import { useState } from "react";
import Header from "./Header";
import Menus from "./Menus";

const DashboardLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const router = useRouter();
  const store = useStore();

  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
    show: {
      opacity: 1,
      width: "auto",
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div>
      <motion.div
        className="sidebar"
        animate={{
          width: isOpen ? "250px" : "64px",
          transition: {
            duration: 0.5,
          },
        }}
      >
        <div className="top_section">
          {isOpen && (
            <AnimatePresence>
              <motion.h1 className="admin-logo">NAVIEASOFT LTD</motion.h1>
            </AnimatePresence>
          )}

          <div className="text-xl cursor-pointer">
            <FaBars onClick={toggle} />
          </div>
        </div>
        <section className="menus-wrapper">
          {store.user && store.user.user_role === "owner" ? (
            <Menus
              isOpen={isOpen}
              menus={menus}
              setIsOpen={setIsOpen}
              showAnimation={showAnimation}
            />
          ) : store.user && /vendor|staff/.test(store.user.user_role) ? (
            <Menus
              isOpen={isOpen}
              menus={vendorMenu}
              setIsOpen={setIsOpen}
              showAnimation={showAnimation}
            />
          ) : null}
          <div
            onClick={() => window.location.reload()}
            className="link ml-[3px]"
          >
            <div className="icon">
              <AiOutlineClear />
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  variants={showAnimation}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="link_text"
                >
                  Cache Clear
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </motion.div>

      <Header isOpen={isOpen} />
      <main className="dashboard">
        {children}
        <p className="my-7 text-gray-400 text-sm print:hidden">
          Copyright © 2022 All Rights Reserved.
        </p>
      </main>
    </div>
  );
};

export default DashboardLayout;
