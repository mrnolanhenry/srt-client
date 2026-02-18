abstract class StringUtils { 
  static removeReturnCharacter(line: string) {
    const indexOfReturn = line.indexOf("\r");
    return indexOfReturn === -1 ? line : line.substring(0,indexOfReturn);
  };

  static isLineNumber(line: string) {
    return !isNaN(Number(line)) && !isNaN(parseInt(line)) && line.indexOf(".") !== line.length - 1;
  };

  static removeStartAndEndChars (line: string, startChar: string, endChar: string): string {
    // TODO: Test whether this trimEnd isn't causing some unexpected side effects
    let newLine = line.trimEnd();
    const indexOfStartChar = line.indexOf(startChar);
    const indexOfEndChar = line.indexOf(endChar);
    if (indexOfStartChar == 0) {
      if (indexOfEndChar !=-1) {
          newLine = newLine.substring(indexOfEndChar + 2, newLine.length);
      }
      else {
          newLine = "";
      }
    }
    else if (indexOfStartChar != -1) {
      if (indexOfEndChar !=-1) {
          newLine = newLine.substring(0, indexOfStartChar) + newLine.substring(indexOfEndChar + 2, newLine.length);
      }
      else {
          newLine = newLine.substring(0, indexOfStartChar);
      }
    }
    else if (indexOfStartChar == -1 && indexOfEndChar !=-1) {
      newLine = newLine.substring(indexOfEndChar + 2, newLine.length);
    }
    return newLine;
  };
};

export default StringUtils;
