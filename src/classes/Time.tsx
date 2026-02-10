// Creating a simpler constructor for Time objects used throughout the app
// to take advantage of Date methods but avoid dealing with years, months, days, timezones, etc.
class Time extends Date {
  constructor(hrs: number, mins: number, secs: number, millisecs: number) {
    super(Date.UTC(1970, 0, 1, hrs, mins, secs, millisecs)); // Year, Month (0-indexed), Day, Hour, Minute, Second, Millisecond
  }
}

export default Time;
