import { jest } from "@jest/globals"
import { recommendationService } from "../../src/services/recommendationsService.js"
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js"
import * as errors from "../../src/utils/errorUtils.js"

describe("recommendation service test suit", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  it("POST /recomendations should throw conflict given not unique rec name", () => {
    const testRec = {id: 1, name: "midnight city", youtubeLink: "https://www.youtube.com/watch?v=dX3k_QDnzHE", score: 1}

    jest.spyOn(recommendationRepository, "findByName").mockResolvedValue(testRec)

    expect( async () => {
      await recommendationService.insert(testRec)
    }).rejects.toEqual(errors.conflictError("Recommendations names must be unique"))
  })

  it("GET /recommendations/random should throw not_found when there are no recs", () => {
    const mockedMathValue = 0.5

    jest.spyOn(Math, "random").mockReturnValue(mockedMathValue)
    jest.spyOn(recommendationRepository, "findAll").mockResolvedValue([])

    expect( async () => {
      await recommendationService.getRandom()
    }).rejects.toEqual(errors.notFoundError())
  })

  it("POST /recommendations/:id/upvote should throw not_found given invalid ID", () => {
    const testID = 1

    jest.spyOn(recommendationRepository, "find").mockResolvedValue(null)

    expect( async () => {
      await recommendationService.upvote(testID) 
    }).rejects.toEqual(errors.notFoundError())
  })

  it("POST /recommendations/:id/downvote should throw not_found given invalid ID", () => {
    const testID = 1

    jest.spyOn(recommendationRepository, "find").mockResolvedValue(null)

    expect( async () => {
      await recommendationService.downvote(testID) 
    }).rejects.toEqual(errors.notFoundError())
  })

  it("POST /recommendations/:id/downvote should remove recommendation whenever its score reaches -6", async () => {
    const testRec = {
      id: 1, 
      name: "Spanish Sahara", 
      youtubeLink: "https://www.youtube.com/watch?v=eYoINidnLRQ", 
      score: -6
    }

    jest.spyOn(recommendationRepository, "find").mockResolvedValue(testRec)
    jest.spyOn(recommendationRepository, "updateScore").mockResolvedValue(testRec)

    const removalFunction = jest.spyOn(recommendationRepository, "remove").mockResolvedValue(null)
    await recommendationService.downvote(1)

    expect(removalFunction).toHaveBeenCalledTimes(1)
  })

  it("getScoreFilter should return lte given a number bigger than 0.7", () => {
    const random = 0.8
    expect(recommendationService.getScoreFilter(random)).toBe('lte')
  })

  it("getByScore should return all recommendations that matches parameters", async () => {
    const testRec = {id: 1, name: "midnight city", youtubeLink: "https://www.youtube.com/watch?v=dX3k_QDnzHE", score: 15} 
    
    jest.spyOn(recommendationRepository, "findAll").mockResolvedValue([testRec])

    const recommendations = await recommendationService.getByScore('gt')

    expect(recommendations).toBeTruthy()
  })
})