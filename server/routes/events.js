const expres = require("express")
const router = express.Router()

router.post("/events", async (req, res) => {
      const results = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.TICKET_MASTER_API_KEY}`)
      const data = await results.json()

      console.log(data)
})