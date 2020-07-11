export const httpType = {
  Number: (x: any): number => parseInt(x, 10),
  String: (x: any): string | undefined =>
    x === undefined ? undefined : `${x}`,
  Boolean: (x: any): boolean => Boolean(x),
  Array: (x: any): Array<any> => x,
  Object: (x: any): object => x,
  File: (x: any): Express.Multer.File => x
};
