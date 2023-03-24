<script lang="ts" setup>
import type { YApiOptions } from './types'
import { YAPI_KEY, DEFAULT_OPTIONS } from './constants'
import { getItem, setItem, transformOptions } from './utils'

const { message } = useMessage() 
const options = ref<YApiOptions>(DEFAULT_OPTIONS)

onMounted(async () => {
  const opts = await getItem<YApiOptions>(YAPI_KEY)
  if (opts) {
    transformOptions(opts)
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

    <LabelTitle>url</LabelTitle>
    <el-input v-model="options.matchRe" />
    <LabelTitle>lang</LabelTitle>
    <el-radio-group v-model="options.lang">
      <el-radio label="ts">ts</el-radio>
      <el-radio label="js">js</el-radio>
    </el-radio-group>

    <LabelTitle>comment</LabelTitle>
    <el-switch v-model="options.comment" />

    <LabelTitle>not contain query key</LabelTitle>
    <KeyTag v-model="options.queryNotContain" />

    <LabelTitle>extract path</LabelTitle>
    <el-input v-model="options.responseExtractPath" />

    <div class="mt-4">
      <el-button type="primary" @click="onSave">save</el-button>
    </div>
  </div>
</template>