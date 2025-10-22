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
    attachments: [],
  });

  const [loading, setLoading] = useState(false);

  // ✅ Handle input and file changes
  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (id === "attachments") {
      const newFiles = [...form.attachments, ...Array.from(files)];
      setForm({ ...form, attachments: newFiles });
    } else {
      setForm({ ...form, [id]: value });
    }
  };

  // ✅ Remove a file
  const removeFile = (index) => {
    const newFiles = [...form.attachments];
    newFiles.splice(index, 1);
    setForm({ ...form, attachments: newFiles });
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("to", form.to);
    formData.append("subject", form.subject);
    formData.append("message", form.message);
    formData.append("repeat", form.repeat);

    form.attachments.forEach((file) => {
      formData.append("attachments", file);
    });

    try {
      const res = await fetch(
        "https://similar-cornelle-ahmedjalal-8bdad1e9.koyeb.app/send-email",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success(data.message || "✅ All emails sent successfully!");
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
        <label htmlFor="to" className="font-semibold">To</label>
        <input
          type="email"
          id="to"
          className="text-[0.85rem] border-2 border-[#E2E8F0] h-9 w-full rounded-md p-3"
          placeholder="receivermail@example.com"
          value={form.to}
          onChange={handleChange}
          required
        />

        <label htmlFor="subject" className="font-semibold">Subject</label>
        <input
          type="text"
          id="subject"
          className="text-[0.85rem] border-2 border-[#E2E8F0] h-9 w-full rounded-md p-3"
          placeholder="Subject of your mail"
          value={form.subject}
          onChange={handleChange}
          required
        />

        <label htmlFor="message" className="font-semibold">Body</label>
        <textarea
          id="message"
          className="text-[0.85rem] border-2 border-[#E2E8F0] w-full min-h-60 rounded-md p-3"
          placeholder="Type your mail here..."
          value={form.message}
          onChange={handleChange}
          required
        ></textarea>

        <label htmlFor="repeat" className="font-semibold">Repeat</label>
        <input
          type="number"
          id="repeat"
          className="text-[0.85rem] border-2 border-[#E2E8F0] h-9 w-full rounded-md p-3"
          value={form.repeat}
          onChange={handleChange}
          min="1"
        />

        {/* Attachments */}
        <label htmlFor="attachments" className="font-semibold">
          Attachments (optional)
        </label>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="attachments"
            className="bg-[hsl(222,47%,11%)] text-white text-sm px-4 py-2 rounded-md cursor-pointer hover:bg-[hsl(222,47%,17%)] transition w-fit"
          >
            📎 Choose Files
            <input
              type="file"
              id="attachments"
              className="hidden"
              accept=".pdf,.jpg,.png,.docx,.txt"
              multiple
              onChange={handleChange}
            />
          </label>

          {form.attachments.length > 0 ? (
            <ul className="text-sm text-gray-700 border p-2 rounded-md bg-gray-50">
              {form.attachments.map((file, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center border-b last:border-none py-1"
                >
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="text-red-500 hover:text-red-700 text-xs"
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm italic">No files selected</p>
          )}
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex flex-col items-center mt-4">
            <div className="w-10 h-10 border-4 border-[hsl(222,47%,11%)] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[hsl(222,47%,11%)] font-medium mt-2">
              Sending emails...
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
