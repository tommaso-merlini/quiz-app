import Replicate from "replicate";

const replicate = new Replicate({
  auth: "r8_MRNLIsZeiP4t5fKrf6RJBwt6DFlUcj646UC69", //TODO:
});

export async function embed(text: string) {
  const output = await replicate.run(
    "andreasjansson/clip-features:75b33f253f7714a281ad3e9b28f63e3232d583716ef6718f2e46641077ea040a",
    {
      input: {
        inputs: text,
      },
    },
  );
  return output;
}
