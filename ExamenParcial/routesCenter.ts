// @ts-ignore
import { Router } from "https://deno.land/x/oak@v6.3.1/mod.ts"
// @ts-ignore
import { getStatus } from "./controllers/getStatus.ts"
// @ts-ignore
import { postClient } from "./controllers/postClient.ts"
// @ts-ignore
import { postProduct } from "./controllers/postProduct.ts"
// @ts-ignore
import { postInvoice } from "./controllers/postInvoice.ts"
// @ts-ignore
import { getInvoice } from "./controllers/getInvoice.ts"

const router = new Router()

router.get("/status", getStatus)
router.post("/client", postClient)
router.post("/product", postProduct)
router.post("/invoice", postInvoice)
router.get("/invoice/:ID", getInvoice)

export { router as default }