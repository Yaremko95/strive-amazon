const fs = require("fs-extra");
const pdfMakePrinter = require("pdfmake/src/printer");
const uniqid = require("uniqid");
const { begin } = require("xmlbuilder");
const { createCanvas, loadImage } = require("canvas");

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

const generatePdf = async (content) => {
  const fonts = {
    Courier: {
      normal: "Courier",
      bold: "Courier-Bold",
      italics: "Courier-Oblique",
      bolditalics: "Courier-BoldOblique",
    },
    Helvetica: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
    Times: {
      normal: "Times-Roman",
      bold: "Times-Bold",
      italics: "Times-Italic",
      bolditalics: "Times-BoldItalic",
    },
    Symbol: {
      normal: "Symbol",
    },
    ZapfDingbats: {
      normal: "ZapfDingbats",
    },
  };

  const printer = new pdfMakePrinter(fonts);
  const doc = await printer.createPdfKitDocument(content);
  return doc;
};

const getImage = async (url, size) => {
  return loadImage(url)
    .then((image) => {
      const canvas = createCanvas(size, size);
      let ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0);
      return canvas.toDataURL();
    })
    .catch((e) => console.log(e));
};

module.exports = {
  readJSON,
  writeJSON,
  updateData,
  removeData,
  buildXML,
  generatePdf,
  getImage,
};
