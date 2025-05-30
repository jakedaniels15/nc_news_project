const db = require("../../db/connection");
const format = require('pg-format');
const { commentData } = require("../data/test-data");

const convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

function createLookupObject(array, keyName, valueName) {
  const refObj = {};
  array.forEach((object) => {
    const key = object[keyName];
    const value = object[valueName];
    refObj[key] = value;
  });
  return refObj;
}

module.exports = { convertTimestampToDate, createLookupObject };
