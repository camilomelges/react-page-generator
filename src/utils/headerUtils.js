export function getConcatVariables(headers) {
  const concatVariables = new Set();
  headers.forEach((header) => {
    if (header.variableToConcatInLabel) {
      concatVariables.add(header.variableToConcatInLabel);
    }
  });

  return [...concatVariables];
}