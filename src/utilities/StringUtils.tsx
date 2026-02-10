abstract class StringUtils { 
  static removeReturnCharacter(line: string) {
    const indexOfReturn = line.indexOf("\r");
    return indexOfReturn === -1 ? line : line.substring(0,indexOfReturn);
  };

    static isLineNumber(line: string) {
    return !isNaN(Number(line)) && !isNaN(parseInt(line)) && line.indexOf(".") !== line.length - 1;
  };
};

export default StringUtils;
