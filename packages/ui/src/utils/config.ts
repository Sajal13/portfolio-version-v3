export const textFormatter = (text: string) => {
  const newStr = text.split('-').join(' ');

  return newStr;
};

export const textTrimmer = (text: string, length: number = 20) => {
  if (text.length > length) {
    return `${text.slice(0, 20)}...`;
  } else {
    return text;
  }
};
