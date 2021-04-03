import { TranslatePipe } from "../Components/Pipes/TranslatePipe";

describe("TranslatePipe", () => {
  it("create an instance", () => {
    const pipe = new TranslatePipe();
    expect(pipe).toBeTruthy();
  });
});
