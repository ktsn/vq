window.Velocity = function(...args) {
  velocityStub.__stub.args = args;
};

function velocityStub() {
  velocityStub.__stub = {
    args: []
  };

  return velocityStub.__stub;
}

export default velocityStub;
