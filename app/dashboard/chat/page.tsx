// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import styles from "./styles.module.css";
// import { AiOutlineSend } from "react-icons/ai";  // Import send icon

// export default function ChatSection() {
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);  // For handling loading state
//   const [error, setError] = useState<string | null>(null);  // For handling errors

//   const sendMessage = async () => {
//     if (message.trim()) {
//       setLoading(true);
//       try {
//         const response = await fetch('https://api.gemini.com/v1/models/gemini-1.5/generate', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': Bearer ${process.env.NEXT_PUBLIC_API_KEY}, // Use API key from env file
//           },
//           body: JSON.stringify({ message: message }),
//         });

//         // Log response for debugging
//       const responseText = await response.text();
//       console.log('Response:', responseText);

//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }

//         const data = await response.json();
//         setMessages([...messages, message]); // Add message to chat

//         setMessage(""); // Clear input field
//       } catch (error) {
//         setError('An error occurred while sending the message.');
//       } finally {
//         setLoading(false); // End loading state
//       }
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <aside className={styles.sidebar}>
//         <div className="flex items-center mb-6">
//           <img src="/logo.png" alt="MultiGen AI Logo" className="h-8 w-8 mr-2" />
//           <h1 className="text-2xl font-bold text-white">MultiGen AI</h1>
//         </div>
//         <ul className={styles.sidebarMenu}>
//           <li className={styles.sidebarMenuItem}>
//             <Link href="/dashboard">Home</Link>
//           </li>
//           <li className={styles.sidebarMenuItem}>
//             <Link href="/history">History</Link>
//           </li>
//           <li className={styles.sidebarMenuItem}>
//             <Link href="/settings">Settings</Link>
//           </li>
//         </ul>
//       </aside>
//       <main className={styles.mainContent}>
//         <div className={styles.titleWithIcon}>
//           <img src="/chat.png" alt="Chat Icon" className={styles.titleIcon} />
//           <h1 className={styles.title}>Chat Section</h1>
//         </div>
//         <p className={styles.subtitle}>Chat with our AI.</p>
//         <div className={styles.chatBox}>
//           <div className={styles.messages}>
//             {messages.length === 0 && (
//               <div className={styles.placeholder}>
//                 <p>No messages yet.</p>
//               </div>
//             )}
//             {messages.map((msg, index) => (
//               <div key={index} className={styles.message}>
//                 {msg}
//               </div>
//             ))}
//           </div>
//           <div className={styles.controls}>
//             <input
//               type="text"
//               placeholder="Type your message here..."
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               className={styles.input}
//             />
//             <button
//               onClick={sendMessage}
//               className={styles.button}
//               disabled={loading} // Disable button while loading
//             >
//               <AiOutlineSend size={20} />
//               {loading ? 'Sending...' : 'Send'}
//             </button>
//           </div>
//           {error && <p className={styles.error}>{error}</p>} {/* Display error message */}
//         </div>
//       </main>
//     </div>
//   );
// }

// -----------------------------------------------------------------------------------------------------------------------------------

"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./styles.module.css";
import { AiOutlineSend } from "react-icons/ai";
import ReactMarkdown from "react-markdown";

export default function ChatSection() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async () => {
    if (message.trim()) {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/send-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const data = await response.json();

        if (data.response) {
          setMessages((prevMessages) => [
            ...prevMessages,
            `**You:** ${message}`,
            `**AI:** ${data.response}`,
          ]);
        } else {
          throw new Error("Invalid response from API");
        }

        setMessage(""); // Clear input
      } catch (error) {
        setError("An error occurred while sending the message.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className="flex items-center mb-6">
          <img src="/logo.png" alt="MultiGen AI Logo" className="h-8 w-8 mr-2" />
          <h1 className="text-2xl font-bold text-white">MultiGen AI</h1>
        </div>
        <ul className={styles.sidebarMenu}>
          <li className={styles.sidebarMenuItem}>
            <Link href="/dashboard">Home</Link>
          </li>
          <li className={styles.sidebarMenuItem}>
            <Link href="/history">History</Link>
          </li>
          <li className={styles.sidebarMenuItem}>
            <Link href="/settings">Settings</Link>
          </li>
        </ul>
      </aside>
      <main className={styles.mainContent}>
        <div className={styles.titleWithIcon}>
          <img src="/chat.png" alt="Chat Icon" className={styles.titleIcon} />
          <h1 className={styles.title}>Chat Section</h1>
        </div>
        <p className={styles.subtitle}>Chat with our AI.</p>
        <div className={styles.chatBox}>
          <div className={styles.messages}>
            {messages.length === 0 && (
              <div className={styles.placeholder}>
                <p>No messages yet.</p>
              </div>
            )}
            {messages.map((msg, index) => (
              <div key={index} className={styles.message}>
                <ReactMarkdown>{msg}</ReactMarkdown>
              </div>
            ))}
          </div>
          <div className={styles.controls}>
            <input
              type="text"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={styles.input}
            />
            <button
              onClick={sendMessage}
              className={styles.button}
              disabled={loading}
            >
              <AiOutlineSend size={20} />
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
          {error && <p className={styles.error}>{error}</p>}
        </div>
      </main>
    </div>
  );
}
