// "use client"

// import { motion } from "framer-motion";
// import { useState, useEffect } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { LucideArrowLeft, LucideCheckCircle, LucideXCircle } from "lucide-react";
// import Link from "next/link";

// export default function VerifyEmail() {
//   const [message, setMessage] = useState("Verifying your email...");
//   const [isError, setIsError] = useState(false);
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   useEffect(() => {
//     const verifyEmail = async () => {
//       const token = searchParams.get("token");
//       const role = searchParams.get("role") || "teacher";

//       if (!token) {
//         setMessage("Invalid or missing token");
//         setIsError(true);
//         return;
//       }

//       try {
//         const response = await fetch(
//           `/api/${role === "student" ? "student" : "teacher"}/verify-email?token=${token}`,
//           { method: "GET" }
//         );

//         if (response.ok) {
//           setMessage("Email verified successfully!");
//           setTimeout(() => {
//             router.push(`${role === "student" ? "/student" : "/teacher"}?message=Email%20verified%20successfully`);
//           }, 2000);
//         } else {
//           const data = await response.json();
//           setMessage(data.message || "Something went wrong. Please try again.");
//           setIsError(true);
//         }
//       } catch (error) {
//         setMessage("Something went wrong. Please try again.");
//         setIsError(true);
//       }
//     };

//     verifyEmail();
//   }, [searchParams, router]);

//   const container = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: { staggerChildren: 0.1 },
//     },
//   };

//   const item = {
//     hidden: { y: 20, opacity: 0 },
//     show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
//       <div className="absolute inset-0 overflow-hidden">
//         {[...Array(25)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute rounded-full bg-white/10"
//             style={{
//               width: Math.random() * 80 + 30,
//               height: Math.random() * 80 + 30,
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//             }}
//             animate={{
//               y: [0, Math.random() * 150 - 75],
//               x: [0, Math.random() * 150 - 75],
//               opacity: [0.1, 0.4, 0.1],
//               scale: [1, 1.2, 1],
//             }}
//             transition={{
//               duration: Math.random() * 15 + 15,
//               repeat: Number.POSITIVE_INFINITY,
//               repeatType: "reverse",
//             }}
//           />
//         ))}
//       </div>

//       <motion.div
//         variants={container}
//         initial="hidden"
//         animate="show"
//         className="w-full max-w-md bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-purple-500/30 relative z-10"
//       >
//         <motion.div variants={item} className="text-center mb-8">
//           <Link
//             href={searchParams.get("role") === "student" ? "/student" : "/teacher"}
//             className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4"
//           >
//             <LucideArrowLeft className="mr-2" size={20} />
//             Back to Login
//           </Link>
//           <h1 className="text-3xl font-bold text-white mb-2">Email Verification</h1>
//           <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 mx-auto rounded-full w-24"></div>
//         </motion.div>

//         <motion.div
//           variants={item}
//           className={`flex items-center justify-center p-6 rounded-xl ${
//             isError ? "bg-red-500/20 border-red-500/50 text-red-300" : "bg-green-500/20 border-green-500/50 text-green-300"
//           }`}
//         >
//           {isError ? (
//             <LucideXCircle className="mr-2" size={24} />
//           ) : (
//             <LucideCheckCircle className="mr-2" size={24} />
//           )}
//           <p className="text-center text-sm">{message}</p>
//         </motion.div>

//         {isError && (
//           <motion.p variants={item} className="text-center text-purple-200 text-sm mt-4">
//             Please try registering again or{" "}
//             <a href="mailto:support@ucp.edu.pk" className="text-blue-400 hover:text-blue-300">
//               contact support
//             </a>{" "}
//             if the issue persists.
//           </motion.p>
//         )}
//       </motion.div>
//     </div>
//   );
// }
















// 
// RES MERG CONF
"use client";

import { motion } from "framer-motion";
import { useState, useEffect, Suspense } from "react"; // Add Suspense import
import { useSearchParams, useRouter } from "next/navigation";
import { LucideArrowLeft, LucideCheckCircle, LucideXCircle } from "lucide-react";
import Link from "next/link";

// Separate component for content using useSearchParams and useRouter
function VerifyEmailContent() {
  const [message, setMessage] = useState("Verifying your email...");
  const [isError, setIsError] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      const role = searchParams.get("role") || "teacher";

      if (!token) {
        setMessage("Invalid or missing token");
        setIsError(true);
        return;
      }

      try {
        const response = await fetch(
          `/api/${role === "student" ? "student" : "teacher"}/verify-email?token=${token}`,
          { method: "GET" }
        );

        if (response.ok) {
          setMessage("Email verified successfully!");
          setTimeout(() => {
            router.push(`${role === "student" ? "/student" : "/teacher"}?message=Email%20verified%20successfully`);
          }, 2000);
        } else {
          const data = await response.json();
          setMessage(data.message || "Something went wrong. Please try again.");
          setIsError(true);
        }
      } catch (error) {
        setMessage("Something went wrong. Please try again.");
        setIsError(true);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: Math.random() * 80 + 30,
              height: Math.random() * 80 + 30,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 150 - 75],
              x: [0, Math.random() * 150 - 75],
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-md bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-purple-500/30 relative z-10"
      >
        <motion.div variants={item} className="text-center mb-8">
          <Link
            href={searchParams.get("role") === "student" ? "/student" : "/teacher"}
            className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4"
          >
            <LucideArrowLeft className="mr-2" size={20} />
            Back to Login
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Email Verification</h1>
          <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 mx-auto rounded-full w-24"></div>
        </motion.div>

        <motion.div
          variants={item}
          className={`flex items-center justify-center p-6 rounded-xl ${
            isError ? "bg-red-500/20 border-red-500/50 text-red-300" : "bg-green-500/20 border-green-500/50 text-green-300"
          }`}
        >
          {isError ? (
            <LucideXCircle className="mr-2" size={24} />
          ) : (
            <LucideCheckCircle className="mr-2" size={24} />
          )}
          <p className="text-center text-sm">{message}</p>
        </motion.div>

        {isError && (
          <motion.p variants={item} className="text-center text-purple-200 text-sm mt-4">
            Please try registering again or{" "}
            <a href="mailto:support@ucp.edu.pk" className="text-blue-400 hover:text-blue-300">
              contact support
            </a>{" "}
            if the issue persists.
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

// Wrap the content in Suspense
export default function VerifyEmail() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
