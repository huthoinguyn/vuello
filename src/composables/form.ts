import {reactive} from 'vue'

export default function useForm(fields: any) {
  return reactive<{
    fields: any
    propressing: boolean
    error: any
    submit: Function
  }>({
    fields,
    propressing: false,
    error: null,
    async submit(callback: Function) {
      if (this.propressing) return

      this.propressing = true
      this.error = null

      try {
        await callback(this.fields)
      } catch (e) {
        this.error = e
      }
      this.propressing = false
    }
  })
}
