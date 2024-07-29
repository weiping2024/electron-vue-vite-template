import db from "./createStore";

export const getFile = () => {
  console.log("进入了");
  console.log(db.chain.get("userStore"));
};
