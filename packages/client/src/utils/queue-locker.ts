export const createQueueLocker = () => {
  let lastPromise: Promise<void> = Promise.resolve()

  return <T>(fn: () => T | Promise<T>): Promise<T> => {
    const resultPromise = lastPromise.then(() => fn())
    lastPromise = resultPromise.then(
      () => {},
      () => {},
    )
    return resultPromise
  }
}
