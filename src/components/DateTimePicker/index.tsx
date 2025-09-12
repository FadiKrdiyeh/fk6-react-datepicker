import React, { useState } from "react";
import moment, { type Moment } from "moment-hijri";
// import 'moment/locale/en-gb'
import "moment-hijri";

export interface DateTimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  calendar?: "gregorian" | "hijri";
  format?: string;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = (props) => {
  const initial = props.value
    ? moment(
      props.value,
      props.format ||
      (props.calendar === "hijri" ? "iYYYY/iMM/iDD" : undefined)
    )
    : moment();

  const [date, setDate] = useState<Moment>(initial);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const m =
      props.calendar === "hijri" ? moment(val, "iYYYY/iMM/iDD") : moment(val);

    if (m.isValid()) {
      setDate(m);
      props.onChange?.(
        m.format(
          props.format ||
          (props.calendar === "hijri" ? "iYYYY/iMM/iDD" : "YYYY-MM-DD HH:mm")
        )
      );
    }
  };

  return (
    <div className="datetime-picker">
      <input
        type="text"
        value={date.format(props.format || (props.calendar === "hijri" ? "iYYYY/iMM/iDD" : "YYYY-MM-DD HH:mm"))}
        onChange={handleChange}
      />
    </div>
  );
};
