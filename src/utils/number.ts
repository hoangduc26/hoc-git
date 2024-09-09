/* eslint-disable eqeqeq */
/* eslint-disable consistent-return */
export const convertQuantityCollection = (suryoValue, suuryouFormatCd) => {
    let newStr = '';
    let count = 0;
    let str = '';
    let suryo;
    let suryoDecimal = ',';
    if (suryoValue !== '' && suryoValue != null) {
        if (suuryouFormatCd === 3) {
            suryo = parseFloat(suryoValue).toFixed(1);
        } else if (suuryouFormatCd === 4) {
            suryo = parseFloat(suryoValue).toFixed(2);
        } else if (suuryouFormatCd === 5) {
            suryo = parseFloat(suryoValue).toFixed(3);
        } else if (suuryouFormatCd === 1) {
            suryoDecimal = '';
            // console.log(suryoDecimal, 'suryoDecimal');
            if (parseInt(suryoValue, 10) === 0) {
                suryo = '';
            } else {
                suryo = Math.round(suryoValue);
            }
        } else if (suuryouFormatCd === 2) {
            suryoDecimal = '';
            suryo = Math.round(suryoValue);
        }
        str = String(suryo);
        if (str === 'NaN' || str === 'undefined') {
            //   $('#text' + idValue).val('');
            // eslint-disable-next-line no-param-reassign
            suryoValue = '';
            return suryoValue;
        }
        if (str.indexOf('.') !== -1) {
            suryoDecimal = str.substring(str.indexOf('.'));
            suryo = '';
        }
        if (str.indexOf('-') === 0) {
            // eslint-disable-next-line no-param-reassign
            suryo = '';
        } else {
            // eslint-disable-next-line no-lonely-if
            if (str.indexOf('.') === -1) {
                for (let i = str.length - 1; i >= 0; i -= 1) {
                    if (count % 3 === 0 && count !== 0) {
                        newStr = `${str.charAt(i)},${newStr}`;
                    } else {
                        newStr = str.charAt(i) + newStr;
                    }
                    count += 1;
                }
                str = newStr;
            }
            for (let i = str.indexOf('.') - 1; i >= 0; i -= 1) {
                if (count % 3 === 0 && count !== 0) {
                    newStr = `${str.charAt(i)},${newStr}`;
                } else {
                    newStr = str.charAt(i) + newStr;
                }
                count += 1;
            }
            const newVal = newStr + suryoDecimal;
            return newVal;
        }
    }
};

export function convertQuantityCarryIn(suryoValue, formatQuantityCd) {
    let newStr = '';
    let count = 0;
    let str = '';
    let suryo;
    let suryoDecimal = '';
    if (suryoValue != '' && suryoValue != null) {
        if (Number(formatQuantityCd) == 3) {
            suryo = parseFloat(suryoValue).toFixed(1);
        } else if (Number(formatQuantityCd) == 4) {
            suryo = parseFloat(suryoValue).toFixed(2);
        } else if (Number(formatQuantityCd) == 5) {
            suryo = parseFloat(suryoValue).toFixed(3);
        } else if (Number(formatQuantityCd) == 1) {
            // eslint-disable-next-line radix
            if (parseInt(suryoValue) == 0) {
                suryo = '';
            } else {
                suryo = Math.round(suryoValue);
            }
        } else if (Number(formatQuantityCd) == 2) {
            suryo = Math.round(suryoValue);
        }

        str = String(suryo);

        if (str == 'NaN') {
            return '';
        }

        if (str.indexOf('.') != -1) {
            suryoDecimal = str.substring(str.indexOf('.'));
        }
        if (str.indexOf('-') == 0) {
            return '';
        }
        if (str.indexOf('.') == -1) {
            for (let i = str.length - 1; i >= 0; i -= 1) {
                if (count % 3 == 0 && count != 0) {
                    newStr = `${str.charAt(i)},${newStr}`;
                } else {
                    newStr = str.charAt(i) + newStr;
                }
                count += 1;
            }
            str = newStr;
        } else {
            for (let i = str.indexOf('.') - 1; i >= 0; i -= 1) {
                if (count % 3 == 0 && count != 0) {
                    newStr = `${str.charAt(i)},${newStr}`;
                } else {
                    newStr = str.charAt(i) + newStr;
                }
                count += 1;
            }
        }
        return newStr + suryoDecimal;
    }
    return '';
}

export const convertPackageQuantity = (suryoValue, suuryouFormatCd = 1) => {
    let newStr = '';
    let count = 0;
    let str = '';
    let suryo;
    let suryoDecimal = ',';
    if (suryoValue !== '' && suryoValue != null) {
        if (suuryouFormatCd === 3) {
            suryo = parseFloat(suryoValue).toFixed(1);
        } else if (suuryouFormatCd === 4) {
            suryo = parseFloat(suryoValue).toFixed(2);
        } else if (suuryouFormatCd === 5) {
            suryo = parseFloat(suryoValue).toFixed(3);
        } else if (suuryouFormatCd === 1) {
            suryoDecimal = '';
            // console.log(suryoDecimal, 'suryoDecimal');
            if (parseInt(suryoValue, 10) === 0) {
                suryo = '';
            } else {
                suryo = Math.round(suryoValue);
            }
        } else if (suuryouFormatCd === 2) {
            suryoDecimal = '';
            suryo = Math.round(suryoValue);
        }
        str = String(suryo);
        if (str === 'NaN' || str === 'undefined') {
            //   $('#text' + idValue).val('');
            // eslint-disable-next-line no-param-reassign
            suryoValue = '';
            return suryoValue;
        }
        if (str.indexOf('.') !== -1) {
            suryoDecimal = str.substring(str.indexOf('.'));
            suryo = '';
        }
        if (str.indexOf('-') === 0) {
            // eslint-disable-next-line no-param-reassign
            suryo = '';
        } else {
            // eslint-disable-next-line no-lonely-if
            if (str.indexOf('.') === -1) {
                for (let i = str.length - 1; i >= 0; i -= 1) {
                    if (count % 3 === 0 && count !== 0) {
                        newStr = `${str.charAt(i)},${newStr}`;
                    } else {
                        newStr = str.charAt(i) + newStr;
                    }
                    count += 1;
                }
                str = newStr;
            }
            for (let i = str.indexOf('.') - 1; i >= 0; i -= 1) {
                if (count % 3 === 0 && count !== 0) {
                    newStr = `${str.charAt(i)},${newStr}`;
                } else {
                    newStr = str.charAt(i) + newStr;
                }
                count += 1;
            }
            const newVal = newStr + suryoDecimal;
            return newVal;
        }
    }
};