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

  afterAll( async () => {
    await prisma.$disconnect()
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

    const response = await supertest(app).get(`/recommendations/${createdRec.id}`)
    
    expect(response.status).toBe(200)
    expect(response.body).not.toBeUndefined()
    expect(response.body.id).toBe(createdRec.id)
  })

  it("GET /recommendations/random should return random recommendation", async () => {
    const response = await supertest(app).get("/recommendations/random")

    expect(response.status).toBe(200)
    expect(response.body).not.toBeUndefined()
  })

  it("GET /recommendations/top/:amount should return x(amount) recommendations ordered by score", async () => {
    const response = await supertest(app).get("/recommendations/top/2")

    expect(response.status).toBe(200)
    expect(response.body.length).toBe(2)
    expect(response.body[0].score).toBeGreaterThan(response.body[1].score)
  })

  it("POST /recommendations should create new recommendation", async () => {
    const response = await supertest(app).post("/recommendations").send(
      {name: "midnight city", youtubeLink: "https://www.youtube.com/watch?v=dX3k_QDnzHE"}
    )

    const createdRec = await prisma.recommendation.findUnique({
      where : {name: "midnight city"}
    })

    expect(response.status).toBe(201)
    expect(createdRec).not.toBeNull()
  })

  it("POST /recommendations/:id/upvote should increase score value on referred rec", async () => {
    const createdRec = await prisma.recommendation.create({
      data: {name: "Stressed Out", youtubeLink: "https://www.youtube.com/watch?v=pXRviuL6vMY"}
    })

    const response = await supertest(app).post(`/recommendations/${createdRec.id}/upvote`)

    const votedRec = await prisma.recommendation.findUnique({
      where: {name: createdRec.name}
    })

    expect(response.status).toBe(200)
    expect(votedRec.score).toBe(createdRec.score + 1)
  })

  it("POST /recommendations/:id/downvote should decrease score value on referred rec", async () => {
    const createdRec = await prisma.recommendation.create({
      data: {name: "Runaway", youtubeLink: "https://www.youtube.com/watch?v=d_HlPboLRL8s"}
    })

    const response = await supertest(app).post(`/recommendations/${createdRec.id}/downvote`)

    const votedRec = await prisma.recommendation.findUnique({
      where: {name: createdRec.name}
    })

    expect(response.status).toBe(200)
    expect(votedRec.score).toBe(createdRec.score - 1)
  })
})