import {LowSync} from 'lowdb'
import lodashId from 'lodash-id'
import lodash from 'lodash-es'
import {DataFileSync } from 'lowdb/node'
import YAML from 'yaml'
import {app} from "electron";
import path from 'path'

lodash.mixin(lodashId)

const DEFAULT_DATA = {
  userStore: [{ aa: 11, id: 1}],
  i18nStore: {}
}

const storePath = path.join(app.getPath('userData'), 'electron-local-data.yml')

// Extend Low class with a new `chain` field
class LowWithLodash<T> extends LowSync<T> {
  chain: lodash.ExpChain<this['data']> = lodash.chain(this).get('data')
}

const adapter = new DataFileSync<typeof DEFAULT_DATA>(storePath, {
  parse: YAML.parse,
  stringify: YAML.stringify
})

const db = new LowWithLodash(adapter, DEFAULT_DATA)
db.read()
// db._.mixin(lodashId)
db.chain.get('userStore').insert({aa: 11}).value()
db.write()



export default db
