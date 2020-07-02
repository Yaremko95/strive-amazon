const fs = require("fs-extra");
const uniqid = require("uniqid");
const { begin } = require("xmlbuilder");

const readJSON = async (path) => {
  let json = await fs.readJson(path);
  return json;
};

const writeJSON = async (path, data) => {
  let jsonArray = await fs.readJson(path);
  jsonArray = [...jsonArray, { ...data, _id: uniqid(), createdAt: new Date() }];
  let write = await fs.writeJson(path, jsonArray);
  return jsonArray;
};

const updateData = async (path, id, data) => {
  let json = await fs.readJson(path);

  const updatedData = json.map(
    (item) => (item._id === id && { ...data, _id: id }) || item
  );

  let write = await fs.writeJson(path, updatedData);
  return updatedData;
};
const removeData = async (path, key, value) => {
  let json = await fs.readJson(path);
  const filtered = json.filter((item) => item[key] !== value);
  const write = fs.writeJson(path, filtered);
  return filtered;
};

const buildXML = (value1, value2) => {
  const xml = begin({ version: "1.0", encoding: "utf-8" })
    .ele("soap:Envelope", {
      "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
      "xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/",
    })
    .ele("soap:Body")
    .ele("Add", { xmlns: "http://tempuri.org/" })
    .ele("intA")
    .text(value1)
    .up()
    .ele("intB")
    .text(value2)
    .end();
  return xml;
};

module.exports = { readJSON, writeJSON, updateData, removeData, buildXML };
