// // 生成随机的变量名和函数名
// export function generateName(length=18) {
//   const characters =
//     "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_";
//   let name = "";
//   // 生成随机名称，确保不以数字开头，可以包含字母、数字和下划线
//   do {
//     name =
//       characters.charAt(Math.floor(Math.random() * characters.length)) +
//       Math.random()
//         .toString(36)
//         .substring(2, length + 1)
//         .replace(/[^a-zA-Z0-9_]/g, "");
//   } while (/^[0-9]/.test(name));
//   return name;
// }

export function generateName(str: string) {
  const hexString = str
    .split("")
    .map((char) => char.charCodeAt(0).toString(16))
    .join("");
  return "0x" + hexString;
}
