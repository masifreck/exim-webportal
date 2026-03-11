import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export default function CustomDropdown({
  label,
  name,
  value,
  options,
  onChange
}) {
  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel>{label}</InputLabel>

      <Select
        label={label}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
      >
        {options.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}