import { causes } from "jssip/lib/Constants"

interface JSSIPSessionFailed {
  originator: string
  message: string
  cause: causes
}
