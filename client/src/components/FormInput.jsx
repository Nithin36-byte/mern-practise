function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error
}) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>

      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? "input-error" : ""}
      />

      {error && <small className="error-text">{error}</small>}
    </div>
  );
}

export default FormInput;