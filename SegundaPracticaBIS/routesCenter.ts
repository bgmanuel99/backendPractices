// @ts-ignore
import { Router } from "https://deno.land/x/oak@v6.3.1/mod.ts"
// @ts-ignore
import { getStatus } from "./controllers/status.ts"
// @ts-ignore
import { putCars } from "./controllers/putCars.ts"
// @ts-ignore
import { postJourney } from "./controllers/postJourney.ts"
// @ts-ignore
import { postDropoff } from "./controllers/dropoff.ts"
// @ts-ignore
import { postLocate } from "./controllers/locate.ts"

const router = new Router()

router.get("/status", getStatus)
router.put("/cars", putCars)
router.post("/journey", postJourney)
router.post("/dropoff/:ID", postDropoff)
router.post("/locate/:ID", postLocate)

export { router as default }