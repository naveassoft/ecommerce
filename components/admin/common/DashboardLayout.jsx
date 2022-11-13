import { AnimatePresence, motion } from "framer-motion";
import SidebarMenu from "../components/SidebarMenu";
import { FaBars, FaSearch } from "react-icons/fa";
import { useState } from "react";
import { AiOutlineClear } from "react-icons/ai";
import { useRouter } from "next/router";
import Link from "next/link";
import { menus } from "../../../services/admin/menus";

const DashboardLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const router = useRouter();

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
          {menus.map((route, index) => {
            if (route.subRoutes) {
              return (
                <SidebarMenu
                  key={index}
                  setIsOpen={setIsOpen}
                  route={route}
                  showAnimation={showAnimation}
                  isOpen={isOpen}
                />
              );
            }

            return (
              <Link
                href={route.path}
                key={index}
                className={`link ml-[2px] ${
                  router.pathname === route.path ? "active" : ""
                }`}
              >
                <div className="text-xl">{route.icon}</div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      variants={showAnimation}
                      initial="hidden"
                      animate="show"
                      exit="hidden"
                      className="link_text"
                    >
                      {route.name}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
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

      <motion.div
        className="admin-header"
        animate={{
          paddingLeft: isOpen ? "260px" : "80px",
          transition: {
            duration: 0.5,
          },
        }}
      >
        <div className="header-wrapper">
          <div className="relative">
            <input type="text" placeholder="Search" />
            <div className="absolute right-3 text-gray-500 top-2/4 -translate-y-2/4">
              <FaSearch />
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-gray-500">Navieasoft LTD</p>
            <div className="relative">
              <img className="h-10 w-10 rounded-full" src="/user.png" alt="" />
              <div className="h-2 w-2 rounded-3xl bg-green-600 absolute right-1 bottom-1"></div>
            </div>
          </div>
        </div>
      </motion.div>
      <main className="dashboard">
        {children}
        <p className="my-7 text-gray-400 text-sm">
          Copyright © 2022 All Rights Reserved.
        </p>
      </main>
    </div>
  );
};

export default DashboardLayout;
