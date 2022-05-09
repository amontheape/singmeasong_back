import { jest } from "@jest/globals"
import { prisma } from '../../src/database.js'
import { recommendationService } from "../../src/services/recommendationsService.js"
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js"
import * as errors from "../../src/utils/errorUtils.js"

describe("recommendation service test suit", () => {
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
})