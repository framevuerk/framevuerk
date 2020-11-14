module.exports = (str) => str.split('').map((char, i) => (/[A-Z]/.test(char) && i !== 0 ? '-' : '') + char.toLowerCase()).join('');
