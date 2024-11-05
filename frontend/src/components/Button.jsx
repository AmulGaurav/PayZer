export default function Button({ disabled, label, onClick }) {
  return (
    <button
      className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 disabled:bg-gray-600"
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
