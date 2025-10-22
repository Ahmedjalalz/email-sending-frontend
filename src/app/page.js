"use client";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page() {
  const [form, setForm] = useState({
    to: "",
    subject: "",
    message: "",
    repeat: 1,
    attachment: null,
  });

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("No file chosen");

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (id === "attachment") {
      setForm({ ...form, attachment: files[0] });
      setFileName(files[0] ? files[0].name : "No file chosen");
    } else {
      setForm({ ...form, [id]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("to", form.to);
    formData.append("subject", form.subject);
    formData.append("message", form.message);
    formData.append("repeat", form.repeat);
    if (form.attachment) formData.append("attachment", form.attachment);

    try {
      for (let i = 1; i <= form.repeat; i++) {
        const res = await fetch('https://https://similar-cornelle-ahmedjalal-8bdad1e9.koyeb.app/send-email', {

          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setProgress(i);
      }

      toast.success("✅ All emails sent successfully!");
    } catch (err) {
      toast.error("❌ Failed to send email.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[90%] m-auto mt-5 border-2 border-[#E2E8F0] rounded-md flex flex-col p-5 bg-white">
      <h1 className="text-2xl font-semibold">Compose Email</h1>
      <p className="text-gray-600">Create your email content and attach files</p>

      <form onSubmit={handleSubmit} className="flex flex-col py-8 gap-3">
        <label htmlFor="to" className="font-semibold">
          To
        </label>
        <input
          type="email"
          id="to"
          className="text-[0.85rem] border-2 border-[#E2E8F0] h-9 w-full rounded-md p-3"
          placeholder="receivermail@example.com"
          value={form.to}
          onChange={handleChange}
          required
        />

        <label htmlFor="subject" className="font-semibold">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          className="text-[0.85rem] border-2 border-[#E2E8F0] h-9 w-full rounded-md p-3"
          placeholder="Subject of your mail"
          value={form.subject}
          onChange={handleChange}
          required
        />

        <label htmlFor="message" className="font-semibold">
          Body
        </label>
        <textarea
          id="message"
          className="text-[0.85rem] border-2 border-[#E2E8F0] w-full min-h-60 rounded-md p-3"
          placeholder="Type your mail here..."
          value={form.message}
          onChange={handleChange}
          required
        ></textarea>

        <label htmlFor="repeat" className="font-semibold">
          Repeat
        </label>
        <input
          type="number"
          id="repeat"
          className="text-[0.85rem] border-2 border-[#E2E8F0] h-9 w-full rounded-md p-3"
          placeholder="1"
          value={form.repeat}
          onChange={handleChange}
          min="1"
        />

        {/* Styled File Upload */}
        <label htmlFor="attachment" className="font-semibold">
          Attachment (optional)
        </label>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="attachment"
            className="bg-[hsl(222,47%,11%)] text-white text-sm px-4 py-2 rounded-md cursor-pointer hover:bg-[hsl(222,47%,17%)] transition w-fit"
          >
            📎 Choose File
            <input
              type="file"
              id="attachment"
              className="hidden"
              accept=".pdf,.jpg,.png,.docx"
              onChange={handleChange}
            />
          </label>
          <p className="text-gray-500 text-sm italic">{fileName}</p>
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex flex-col items-center mt-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-blue-600 font-medium mt-2">
              Sending emails... {progress}
            </p>
          </div>
        ) : (
          <button
            type="submit"
            className="bg-[hsl(222,47%,11%)] hover:bg-[hsl(222,47%,17%)] text-white p-2 w-40 rounded-md transition mt-4"
          >
            Send Email
          </button>
        )}
      </form>

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
}
