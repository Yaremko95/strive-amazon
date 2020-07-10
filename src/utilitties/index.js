const fsExtra = require("fs-extra");
const fs = require("fs");
const pdfMakePrinter = require("pdfmake/src/printer");
const uniqid = require("uniqid");
const { begin } = require("xmlbuilder");
const PDFDocument = require("pdfkit");
const { join } = require("path");

const readJSON = async (path) => {
  let json = await fsExtra.readJson(path);
  return json;
};

const writeJSON = async (path, data) => {
  let jsonArray = await fsExtra.readJson(path);
  jsonArray = [...jsonArray, { ...data, _id: uniqid(), createdAt: new Date() }];
  let write = await fsExtra.writeJson(path, jsonArray);
  return jsonArray;
};

const updateData = async (path, id, data) => {
  let json = await fsExtra.readJson(path);

  const updatedData = json.map(
    (item) => (item._id === id && { ...data, _id: id }) || item
  );

  let write = await fsExtra.writeJson(path, updatedData);
  return updatedData;
};
const removeData = async (path, key, value) => {
  let json = await fsExtra.readJson(path);
  const filtered = json.filter((item) => item[key] !== value);
  const write = fsExtra.writeJson(path, filtered);
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

const getPdf = async (data, callback) => {
  const doc = new PDFDocument();
  const directory = join(__dirname, `../pdfs/${data.name}.pdf`);
  const imageDirectory = join(__dirname, `../images/download.jpg`);
  doc.pipe(fs.createWriteStream(directory));

  doc.font("Helvetica").fontSize(25).text(
    `Name: ${data.name}
     Description: ${data.description}
      Price: ${data.price}
      Category: ${data.category}`,
    100,
    100
  );

  doc.image(imageDirectory, {
    fit: [250, 300],
    align: "center",
  });
  callback(doc);
};

module.exports = {
  readJSON,
  writeJSON,
  updateData,
  removeData,
  buildXML,
  getPdf,
};
