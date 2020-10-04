/* eslint-disable jest/expect-expect */
/* eslint react/jsx-props-no-spreading: off, @typescript-eslint/ban-ts-comment: off */
import Enzyme from "enzyme"
import Adapter from "enzyme-adapter-react-16"

Enzyme.configure({ adapter: new Adapter() })
jest.useFakeTimers()

describe("Run Test suite", () => {
  it("run test suite", () => {})
})
