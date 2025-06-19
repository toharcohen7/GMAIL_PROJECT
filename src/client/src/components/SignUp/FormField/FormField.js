import React from 'react';

function FormField({
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
  options,
  ...rest
}) {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      {type === "select" ? (
        <select
          className={`form-control input-hover-effect ${error ? "is-invalid" : ""}`}
          name={name}
          value={value}
          onChange={onChange}
          {...rest}
        >
          <option value="">Select {label}</option>
          {options.map((opt, index) => (
            <option key={index} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          className={`form-control input-hover-effect ${error ? "is-invalid" : ""}`}
          name={name}
          value={value}
          onChange={onChange}
          {...rest}
        />
      )}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}

export default FormField;
