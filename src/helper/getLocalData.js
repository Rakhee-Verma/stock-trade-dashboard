function getLocalData(type, key, data = null) {
  if (type === "get") {
    const localData = JSON.parse(localStorage.getItem(key)) || [];
    return localData;
  }
  if (type === "set") {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

export default getLocalData;

export const getTimeFrame = (timeFrame) => {
  let interval = "5min";
  let outputsize = 30;
  switch (timeFrame) {
    case "1D":
      interval = "5min";
      outputsize = 80; // About 1 day
      break;
    case "1W":
      interval = "1h";
      outputsize = 120; // About 1 week
      break;
    case "1M":
      interval = "1day";
      outputsize = 30;
      break;
    case "3M":
      interval = "1week";
      outputsize = 12;
      break;
    default:
      interval = "1day";
      outputsize = 30;
  }
  return { interval, outputsize };
};
