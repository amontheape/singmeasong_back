import supertest from 'supertest'
import app from '../../src/app.js'
import { prisma } from '../../src/database.js'

describe("app test suit - integration", () => {
  beforeEach( async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations;`

    await prisma.recommendation.createMany({
      data: [
        {name: "Innerbloom", youtubeLink: "https://www.youtube.com/watch?v=Tx9zMFodNtA", score: 1 },
        {name: "Won't get lost", youtubeLink: "https://www.youtube.com/watch?v=xW0Eorfq-vQ", score: 2},
        {name: "Don't you worry child", youtubeLink: "https://www.youtube.com/watch?v=1y6smkh6c-0", score: 3}
      ]
    })
  })

  it("GET /recommendations should list all recommendations", async () => {
    const response = await supertest(app).get("/recommendations")

    expect(response.status).toBe(200)
    expect(response.body.length).toBeGreaterThan(0)
  })
  
  it("GET /recommendations/:id should return single referred recommendation", async () => {
    const createdRec = await prisma.recommendation.create({
      data: {name: "Dua Lipa : Tiny Desk", youtubeLink: "https://www.youtube.com/watch?v=F4neLJQC1_E"}
    })

    const response = await supertest(app).get(`/recommendation/${createdRec.id}`)
    
    expect(response.status).toBe(200)
    expect(response.body).not.toBeUndefined()
    expect(response.body.id).toBe(createdRec.id)
  })
})