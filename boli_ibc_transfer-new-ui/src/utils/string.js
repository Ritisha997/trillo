export const truncateString = (string, front, back) =>
  `${string.substr(0, front)}...${string.substr(
    string.length - back,
    string.length
  )}`;


  export const trimWhiteSpaces = (data) => data.split(" ").join("");