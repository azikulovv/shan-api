import 'dotenv/config'
import { app } from './app'

const PORT = Number(process.env.SHANYRAQ_PORT) || 5000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
