export const textFormatter = (text: string) => {
  const newStr = text.split('-').join(' ');

  return newStr;
};
