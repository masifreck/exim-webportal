import { TextField } from "@mui/material";

export default function CustomTextInput({
  label,
  value,
  onChange,
  name,
  type = "text"
}) {
  return (
    <TextField
      fullWidth
      label={label}
      type={type}
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      sx={{ mb: 2 }}
    />
  );
}