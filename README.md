# ls-date
A little javascript library with some usefull functions for dates and to handle Brazilian holydays

### Enums and Variables

```javascript
// boolean: default false
// Used to know if it is to consider HolyFriday holyday, because some places do not consider as a holyday
ls_date.useHolyFriday;

// All months of the year
ls_date.months: {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11
};

// All days of week
ls_date.daysOfWeek: {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6
};

// All Brazil States
ls_date.states: {
    AC: 'AC',
    AL: 'AL',
    AM: 'AM',
    AP: 'AP',
    BA: 'BA',
    CE: 'CE',
    DF: 'DF',
    ES: 'ES',
    GO: 'GO',
    MA: 'MA',
    MG: 'MG',
    MS: 'MS',
    MT: 'MT',
    PA: 'PA',
    PB: 'PB',
    PE: 'PE',
    PI: 'PI',
    PR: 'PR',
    RJ: 'RJ',
    RN: 'RN',
    RO: 'RO',
    RR: 'RR',
    RS: 'RS',
    SC: 'SC',
    SE: 'SE',
    SP: 'SP',
    TO: 'TO'
};
```

### Methods

```javascript
// Set the dates of the National Elections to be considered in the validations
ls_date.setElectionDays(firstRound:Date, secondRound:Date); // Array of holydays add

// Add a new holyday do be considered in the validations
ls_date.addLocalHolyday(date:Date, name:string); // Array of holydays add

// Clear all the holydays that was add manualy
ls_date.clearLocalHolyday(); // void

// Used to check if the date is on weekend
ls_date.isWeekend(date:Date); // true or false

// Used to check if the date is a Brazilian workday (not a weekdend or holyday)
// options: { 
//    date:Date, 
//    state:enum of states (use: ls_date.states sample: ls_date.states.SP for São Paulo) 
// }
ls_date.isWorkday(options); // true or false

// Used to check if the date is a Brazilian holyday
// options: { 
//    date:Date, 
//    state:enum of states (use: ls_date.states sample: ls_date.states.SP for São Paulo) 
// }
ls_date.isHolyday(options); // true or false

// Used to get the next Brazilian holyday based on date passed on options
// options: { 
//    date:Date, 
//    state:enum of states (use: ls_date.states sample: ls_date.states.SP for São Paulo) 
// }
ls_date.getNextHolyday(options); // Date

// Used to get all the Brazilian holydays of the year based on the date passed
// options: { 
//    date:Date, 
//    state:enum of states (use: ls_date.states sample: ls_date.states.SP for São Paulo) 
// }
ls_date.getAllHolydaysOfTheYear(options); // Date

// Used to format a date to a specific format
// format: Format string. Sample: 'dd/MM/yyyy HH:mm:ss'
ls_date.toFormatString(date:Date, format:String); // String

// Used to get the date but in the first minute of the day
ls_date.startOfDay(date:Date); // Date

// Used to get the date but in the last minute of the day
ls_date.endOfDay(date:Date); // Date

// Used to get the las day of month based on the date passed
ls_date.lastDayOfMonth(date:Date); // Date
```

### Use as Date extension method

```javascript
// Used to check if the date is on weekend
new Date().isWeekend(); // true or false

// Used to check if the date is a Brazilian holyday
// state:enum of states (use: ls_date.states sample: ls_date.states.SP for São Paulo)
new Date().isHolyday(state) // true or false

// Used to check if the date is a Brazilian workday (not a weekdend or holyday) based on the state passed
// state:enum of states (use: ls_date.states sample: ls_date.states.SP for São Paulo)
new Date().isWorkday(state) // true or false

// Used to get the next Brazilian holyday based on the date and state passed
// state:enum of states (use: ls_date.states sample: ls_date.states.SP for São Paulo)
new Date().getNextHolyday(state) // Date

// Used to get all Brazilian holydays based on the date and state passed
// state:enum of states (use: ls_date.states sample: ls_date.states.SP for São Paulo)
new Date().getAllHolydaysOfTheYear(state) // Array of Dates

// Used to get the last day of month based on the date passed
new Date().lastDayOfMonth(state) // Date

// Used to format a date in a specific format
// format: Format string. Sample: 'dd/MM/yyyy HH:mm:ss'
new Date().toFormatString(format:String); String

// Used to get the date but in the first minute of the day
new Date().startOfDay(); // Date

// Used to get the date but in the last minute of the day
new Date().endOfDay(); // Date
```

### Contribute

Just open Pull Requests on `develop` branch, open issues or just mail me: [leandro.simoes@outlook.com](mailto:leandro.simoes@outlook.com)
