export const FORK_RELEASE_REPOSITORY = 'dhia336/TwigAnimate';

export function getReleaseRepository(value = process.env.TWIGANIMATE_RELEASE_REPOSITORY) {
  if (value !== FORK_RELEASE_REPOSITORY) {
    throw new Error(`Set TWIGANIMATE_RELEASE_REPOSITORY=${FORK_RELEASE_REPOSITORY} to explicitly enable fork release publishing.`);
  }
  return value;
}
