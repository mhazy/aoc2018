const R = require("ramda");
const util = require("./util");

const GuardEventStrings = {
  BEGINS_SHIFT: "shift",
  FALLS_ASLEEP: "asleep",
  WAKES_UP: "up"
};

const eventTimePattern = /^\[(\d+)-(\d+)-(\d+)\s(\d+):(\d+)\]\s(.+)$/;

const eventTypePattern = RegExp(
  `(${Object.values(GuardEventStrings).join("|")})$`
);

const guardShiftEventPattern = /^Guard #(\d+)/;

const formatInput = R.pipe(
  R.trim,
  R.split(/\n/g)
);

const parseEventTypeString = event => {
  const [, type] = R.match(eventTypePattern, event);

  if (type === GuardEventStrings.BEGINS_SHIFT) {
    const [, guard] = R.match(guardShiftEventPattern, event);
    return {
      type: GuardEventStrings.BEGINS_SHIFT,
      guard
    };
  }

  return {
    type
  };
};

const processEventString = eventString => {
  const eventData = R.match(eventTimePattern, eventString);
  const [, year, month, day, hour, minute, eventTypeString] = eventData;

  const event = parseEventTypeString(eventTypeString);

  return {
    year: Number(year),
    month: Number(month),
    day: Number(day),
    hour: Number(hour),
    minute: Number(minute),
    event
  };
};

// Events are assumed to be sorted and shift starts/sleep are paired appropariately
const processEvents = events => {
  let i = 0;
  let guardData = {};
  let currentGuard, sleepStartMin, sleepEndMin;

  while (i < events.length) {
    const eventData = processEventString(events[i]);
    if (eventData.event.type === GuardEventStrings.BEGINS_SHIFT) {
      currentGuard = eventData.event.guard;
      if (guardData[currentGuard] === undefined) {
        guardData[currentGuard] = {
          id: Number(currentGuard),
          minutesAsleep: 0,
          minutes: {}
        };
      }
    } else if (eventData.event.type === GuardEventStrings.FALLS_ASLEEP) {
      // Nap Started
      sleepStartMin = eventData.minute;
    } else if (eventData.event.type === GuardEventStrings.WAKES_UP) {
      // Nap Over
      sleepEndMin = eventData.minute;
      for (let i = sleepStartMin; i < sleepEndMin; i++) {
        if (guardData[currentGuard].minutes[i] === undefined) {
          guardData[currentGuard].minutes[i] = 0;
        }

        guardData[currentGuard].minutes[i] =
          guardData[currentGuard].minutes[i] + 1;
        guardData[currentGuard].minutesAsleep =
          guardData[currentGuard].minutesAsleep + 1;
      }
      if (sleepEndMin < sleepStartMin) {
        console.log("Uh Oh");
      }
    }
    i = i + 1;
  }

  return guardData;
};

const solvePartOne = guardData => {
  // Which guard sleeps this most?
  const guard = Object.values(guardData).reduce(
    (acc, val) =>
      acc === null || val.minutesAsleep > acc.minutesAsleep ? val : acc,
    null
  );

  // Puts minutes into buckets by their occurance count, sorts 'em, and grabs
  const mostFrequentMinute = R.pipe(
    R.toPairs,
    R.sort((a, b) => b[1] - a[1]),
    R.head,
    ([minute]) => Number(minute)
  )(guard.minutes);

  return guard.id * mostFrequentMinute;
};

const solvePartTwo = guardData => {
  let minuteOccurences = {};
  let i, j, k;
  const guards = Object.values(guardData);
  for (i = 0; i < guards.length; i++) {
    const minutes = Object.keys(guards[i].minutes);

    for (j = 0; j < minutes.length; j++) {
      if (minuteOccurences[minutes[j]] === undefined) {
        minuteOccurences[minutes[j]] = [];
      }
      const occurences = guards[i].minutes[minutes[j]];
      for (k = 0; k < occurences; k++) {
        minuteOccurences[minutes[j]].push(guards[i].id);
      }
    }
  }

  return R.pipe(
    R.mapObjIndexed((val, key) => {
      // Group
      const occurrences = R.pipe(
        R.groupWith(R.equals),
        R.sort((a, b) => b.length - a.length),
        R.map(val => {
          return {
            guard: R.head(val),
            count: val.length
          };
        }),
        R.head
      )(val);

      return {
        minute: Number(key),
        ...occurrences
      };
    }),
    R.values,
    R.sortBy(R.prop("count")),
    R.last,
    R.pick(["minute", "guard"]),
    R.values,
    R.apply(R.multiply)
  )(minuteOccurences);
};

// Input is pre-sorted
util
  .loadFile("./inputs/day04")
  .then(formatInput)
  .then(processEvents)
  .then(guardData => {
    const answerOne = solvePartOne(guardData);
    const answerTwo = solvePartTwo(guardData);
    console.log(`Day 4, part 1: ${answerOne}`);
    console.log(`Day 4, part 2: ${answerTwo}`);
  });
