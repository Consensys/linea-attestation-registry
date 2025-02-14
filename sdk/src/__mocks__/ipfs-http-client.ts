export const create = jest.fn().mockReturnValue({
  add: jest.fn().mockResolvedValue({ path: "mockHash" }),
});
