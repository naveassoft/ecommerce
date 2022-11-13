import { useState } from "react";

const Store = () => {
  const [alert, setAlert] = useState({ msg: "", type: "" });

  async function fetchData(url) {
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        if (data) return { data, error: null };
        else throw { message: "No data found" };
      } else throw data;
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  async function deleteData(url) {
    try {
      const res = await fetch(url, {
        method: "DELETE",
      });
      const result = await res.json();
      if (res.ok) return { error: false, message: result.message };
      else throw result;
    } catch (error) {
      return { error: true, message: result.message };
    }
  }

  async function addOrEditData(url, formData, method) {
    try {
      const res = await fetch(url, {
        method: method,
        body: formData,
      });
      const result = await res.json();
      if (res.ok) return { error: false, message: result.message };
      else throw result;
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  return {
    alert,
    setAlert,
    fetchData,
    deleteData,
    addOrEditData,
  };
};

export default Store;
