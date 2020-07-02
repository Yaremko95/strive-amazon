const fs = require('fs-extra')
const uniqid = require('uniqid')

const readJSON =  async (path) => {
    let  json= await fs.readJson(path)
    return json;
}

const writeJSON = async (path, data) => {

    let jsonArray = await fs.readJson(path)
    jsonArray = [...jsonArray, {...data, _id:uniqid(), createdAt:new Date()}]
    let write = await fs.writeJson(path, jsonArray)
    return jsonArray
}

const updateData = async(path, id, data) => {
    let  json=  await fs.readJson(path);

    const updatedData = json.map(
        (item) =>
            (item._id === id && { ...data, _id: id }) || item
    );

    let write = await fs.writeJson(path, updatedData)
    return updatedData

}
const removeData = async (path, key,  value) => {
    let  json=  await fs.readJson(path);
    const filtered = json.filter((item) => item[key] !== value);
    const write = fs.writeJson(path, filtered)
    return filtered
}


module.exports = {readJSON, writeJSON, updateData, removeData}