const fs = require('fs');
const { Op } = require('sequelize');
const mkdirP = require('mkdirp');
const AllModels = require('../services/model.service');
 
exports.checkRequiredParameter = (requiredParam, paramObj = {}) => {
  if (!(requiredParam instanceof Array)) {
    throw Error('Required parametrs must be an array');
  }
  let isMissingParam = false;
  let message = [];
  const objKeys = Object.keys(paramObj);
  requiredParam.forEach((key) => {
    if (!(objKeys.includes(key))) {
      isMissingParam = true;
      message.push(`${key} is Required.`);
    }
    if (objKeys.includes(key) && (paramObj[key] === undefined || paramObj[key] === '')) {
      isMissingParam = true;
      message.push(`Value of : '${key}' is required.`);
    }
  });
  if (isMissingParam) {
    message = message.join(',');
  }
  return { isMissingParam, message };
};
exports.getBaseDirectory = () => {
  const dir = './public/uploads/';
  if (!fs.existsSync(dir)) {
    mkdirP.sync(dir);
  }
  return dir;
};
exports.randString = async (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};