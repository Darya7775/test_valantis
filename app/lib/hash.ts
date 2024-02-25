import md5 from "md5";

const timestamp = new Date().toISOString().split("T")[0].replace(/-/g, '');
const md5Hash = md5(`Valantis_${timestamp}`);

export default md5Hash;
