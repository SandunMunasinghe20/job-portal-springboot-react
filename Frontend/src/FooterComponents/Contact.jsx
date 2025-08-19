
export default function Contact() {
  return (
    <div className="max-w-3xl p-6 mx-auto">
      <h1 className="mb-4 text-3xl font-bold">Contact Us</h1>
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Your Message"
          className="w-full p-2 border rounded"
          rows="5"
        />
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-600 rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
}
