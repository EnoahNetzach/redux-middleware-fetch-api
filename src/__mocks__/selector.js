const selector = (...args) => selector.implementation(...args)
selector.implementation = () => ({
  some: () => selector.someReturn,
})
selector.someReturn = false

export default selector
