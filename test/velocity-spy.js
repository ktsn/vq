window.Velocity = function(...args) {
  velocityStub.__stub.push({ args });
};

function velocityStub() {
  velocityStub.__stub = [];

  return velocityStub.__stub;
}

export default velocityStub;
