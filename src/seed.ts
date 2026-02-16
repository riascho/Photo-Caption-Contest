import { imageRepository } from "./repositories";

const INITIAL_IMAGES = [
  "https://as2.ftcdn.net/jpg/02/50/17/85/1000_F_250178509_ozTzYHbSHTlxARK4FvYVQ4i40p44822n.jpg",
  "https://media.gettyimages.com/id/109350684/de/foto/gesch%C3%A4ftsleute-mit-ihren-kopf-in-metall-tubing.jpg?s=2048x2048&w=gi&k=20&c=fxvo9SGNEyMg9wjj3fc9vWuc2KJI5c1DxKzOUg1WyDE=",
  "https://images.unsplash.com/photo-1507808973436-a4ed7b5e87c9?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://media.istockphoto.com/id/1582008312/photo/flooded-park-bench.jpg?s=1024x1024&w=is&k=20&c=-xGPJ_vIhTaoCDhl7PQ-MdnL2uGBtHPh81NnQuD9Z64=",
  "https://media.gettyimages.com/id/1157192647/de/foto/woman-with-blue-headphones-listening-music-hanging-on-goal.jpg?s=2048x2048&w=gi&k=20&c=34yGVD0ropQbj25h6rNhLDAfZtwnDg3PPv1tZsMj5C4=",
];

export async function seedImages(): Promise<void> {
  try {
    const existingCount = await imageRepository.count();
    if (existingCount === 0) {
      const images = INITIAL_IMAGES.map((url) =>
        imageRepository.create({ url }),
      );
      await imageRepository.save(images);
    }
  } catch (error) {
    console.error("Error seeding images:", error);
  }
}
