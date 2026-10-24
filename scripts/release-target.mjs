export const FORK_RELEASE_REPOSITORY = 'dhia336/StykAnimate-App';

export function getReleaseRepository(value = process.env.STYK_RELEASE_REPOSITORY) {
  if (value !== FORK_RELEASE_REPOSITORY) {
    throw new Error(`Set STYK_RELEASE_REPOSITORY=${FORK_RELEASE_REPOSITORY} to explicitly enable fork release publishing.`);
  }
  return value;
}
