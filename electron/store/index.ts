
import db from './createStore'


console.log(db.chain.get('userStore').value())

export const getFile = () => {
    console.log('进入了');
    console.log(db.chain.get('userStore'))
}