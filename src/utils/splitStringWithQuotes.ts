export const splitStringWithQuotes = function (inputString: string): string[] {
  const regex = /"[^"]+"|\S+/g
  const result = inputString?.match(regex)?.map(str => str.replace(/^"(.*)"$/, '$1')) || []
  return result
}
