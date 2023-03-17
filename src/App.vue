<script lang="ts" setup>
import type { YApiOptions } from './types'
import { YAPI_KEY, DEFAULT_OPTIONS } from './constants'
import { getItem, setItem } from './utils'

const { message } = useMessage() 
const options = ref<YApiOptions>(DEFAULT_OPTIONS)

onMounted(async () => {
  const opts = await getItem<YApiOptions>(YAPI_KEY)
  if (opts) {
    options.value = opts
  }
})

const onSave = async () => {
  setItem(YAPI_KEY, options.value)
  message.success('save success!')
}
</script>

<template>
  <div class="p-4 w-100">
    <h2 class="font-bold text-6">Config</h2>

    <h3>url</h3>
    <el-input v-model="options.matchRe" />
    <h3>lang</h3>
    <el-radio-group v-model="options.lang">
      <el-radio label="ts">ts</el-radio>
      <el-radio label="js">js</el-radio>
    </el-radio-group>
    <div>
      <el-button type="primary" @click="onSave">save</el-button>
    </div>
  </div>
</template>