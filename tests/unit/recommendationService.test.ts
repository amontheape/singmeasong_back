import { jest } from "@jest/globals"
import { recommendationService } from "../../src/services/recommendationsService.js"
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js"
import * as errors from "../../src/utils/errorUtils.js"

describe("recommendation service test suit", () => {
  it("GET /recommendations/random should throw not_found when there are no recs", () => {
    jest.spyOn(Math, "random").mockReturnValue(1)
    jest.spyOn(recommendationRepository, "findAll").mockResolvedValue([])

    expect( async () => {
      await recommendationService.getRandom()
    }).rejects.toEqual(errors.notFoundError())
  })
})