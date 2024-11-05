export default function PasswordInputBox({ label, onChange, placeholder }) {
  return (
    <div>
      <div className="text-sm font-medium text-left py-2">{label}</div>
      <input
        className="w-full px-2 py-1 border"
        type="password"
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
}
