export const removeDuplicate = (data: any) => {
  return data.filter(
    (element: any, index: any, self: any) => self.indexOf(element) === index
  );
};
