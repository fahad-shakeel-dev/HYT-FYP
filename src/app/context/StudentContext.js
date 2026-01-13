
// "use client";

// import { createContext, useContext, useState, useEffect } from "react";

// const StudentContext = createContext();

// export function StudentProvider({ children }) {
//   const [studentData, setStudentData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchStudentData = async () => {
//     try {
//       console.log("Fetching student data from /api/parent/me");
//       const response = await fetch("/api/parent/me", {
//         method: "GET",
//         credentials: "include",
//       });
//       console.log("Response status:", response.status);
//       if (response.ok) {
//         const data = await response.json();
//         console.log("Fetched student data:", data);
//         setStudentData(data);
//       } else {
//         console.error("Failed to fetch student data:", await response.text());
//         setStudentData(null);
//       }
//     } catch (error) {
//       console.error("Error fetching student data:", error);
//       setStudentData(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStudentData();
//   }, []);

//   return (
//     <StudentContext.Provider value={{ studentData, loading, setStudentData, fetchStudentData }}>
//       {children}
//     </StudentContext.Provider>
//   );
// }

// export function useStudent() {
//   return useContext(StudentContext);
// }



"use client"
import { createContext, useContext, useState, useEffect } from "react"

const StudentContext = createContext()

export function StudentProvider({ children }) {
  const [studentData, setStudentData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const fetchStudentData = async () => {
    try {
      console.log("Fetching student data from /api/parent/me")

      // Check if we have a token in localStorage or cookies
      const token = localStorage.getItem("token") || getCookie("token")

      if (!token) {
        console.log("No token found, user not authenticated")
        setStudentData(null)
        setIsAuthenticated(false)
        setLoading(false)
        return
      }

      const response = await fetch("/api/parent/me", {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log("Response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("Fetched student data:", data)
        setStudentData(data)
        setIsAuthenticated(true)
      } else {
        const errorText = await response.text()
        console.error("Failed to fetch student data:", errorText)

        // If unauthorized, clear token and redirect to login
        if (response.status === 401) {
          localStorage.removeItem("token")
          deleteCookie("token")
          setIsAuthenticated(false)
          // Redirect to login page
          if (typeof window !== "undefined") {
            window.location.href = "/login"
          }
        }
        setStudentData(null)
      }
    } catch (error) {
      console.error("Error fetching student data:", error)
      setStudentData(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  // Helper function to get cookie
  const getCookie = (name) => {
    if (typeof document === "undefined") return null
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(";").shift()
    return null
  }

  // Helper function to delete cookie
  const deleteCookie = (name) => {
    if (typeof document !== "undefined") {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    }
  }

  // Login function
  const login = (token, userData) => {
    localStorage.setItem("token", token)
    setStudentData(userData)
    setIsAuthenticated(true)
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem("token")
    deleteCookie("token")
    setStudentData(null)
    setIsAuthenticated(false)
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
  }

  useEffect(() => {
    fetchStudentData()
  }, [])

  return (
    <StudentContext.Provider
      value={{
        studentData,
        loading,
        isAuthenticated,
        setStudentData,
        fetchStudentData,
        login,
        logout,
      }}
    >
      {children}
    </StudentContext.Provider>
  )
}

export function useStudent() {
  const context = useContext(StudentContext)
  if (!context) {
    throw new Error("useStudent must be used within a StudentProvider")
  }
  return context
}
