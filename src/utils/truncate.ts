export const truncateString = (str: string, maxSize: number = 256)  =>{
  if (str.length <= maxSize) return str;
  return  str.slice(0, maxSize) + '...'
}
