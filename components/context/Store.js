import { useEffect, useState } from "react";

const Store = () => {
  const [alert, setAlert] = useState({ msg: "", type: "" });
  const [user, setUser] = useState(null);
  const [redirect, setRedirect] = useState("/");
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  //manage user;
  useEffect(() => {
    // transfers sessionStorage from one tab to another
    const manageUserSession = function (event) {
      if (!event) {
        event = window.event;
      } // ie suq
      if (!event.newValue) return; // do nothing if no value to work with
      if (event.key == "getSessionStorage") {
        // another tab asked for the sessionStorage -> send it
        localStorage.setItem("sessionStorage", JSON.stringify(sessionStorage));
        // the other tab should now have it, so we're done with it.
        localStorage.removeItem("sessionStorage"); // <- could do short timeout as well.
      } else if (event.key == "sessionStorage" && !sessionStorage.length) {
        // another tab sent data <- get it
        const data = JSON.parse(event.newValue);
        for (const key in data) {
          sessionStorage.setItem(key, data[key]);
        }
        if (data.token) setToken(data.token);
      }
    };
    // listen for changes to localStorage
    if (window.addEventListener) {
      window.addEventListener("storage", manageUserSession, false);
    } else {
      window.attachEvent("onstorage", manageUserSession);
    }

    // Ask other tabs for session storage (this is ONLY to trigger event)
    if (!sessionStorage.length) {
      localStorage.setItem("getSessionStorage", "token");
      localStorage.removeItem("getSessionStorage", "token");
    }
    return () => {
      window.removeEventListener("storage", manageUserSession);
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (token) {
          const res = await fetch(`/api/login?token=${token}`);
          const result = await res.json();
          if (res.ok) {
            setUser(result.user);
            sessionStorage.setItem("token", result.token);
          } else throw result;
        }
      } catch (error) {
        setUser(null);
        sessionStorage.removeItem("token");
      }
      setLoading(false);
    })();
  }, [token]);

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

  async function deleteData(url, formData) {
    try {
      const res = await fetch(url, {
        method: "DELETE",
        body: formData,
      });
      const result = await res.json();
      if (res.ok) return { error: false, message: result.message };
      else throw result;
    } catch (error) {
      return { error: true, message: error.message };
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
    user,
    setUser,
    redirect,
    setRedirect,
    loading,
  };
};

export default Store;
