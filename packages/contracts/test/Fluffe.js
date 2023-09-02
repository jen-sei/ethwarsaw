const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Fluffe", function () {
  it("should work", async function () {
    const f = await ethers.getContractFactory("Fluffe");
    const c = await f.deploy();

    await c.addURI("1.com");
    await c.addURI("2.com");
    expect(await c.uris(0)).to.equal("1.com");
    expect(await c.uris(1)).to.equal("2.com");

    const owner = await c.owner();
    const ownerSigner = await ethers.getSigner(owner);

    const signers = await ethers.getSigners();
    const userSigner = signers[1];
    expect(userSigner.address).not.to.equal(owner);

    const mintMessage = ethers.solidityPacked(
      ["address", "uint256", "uint256"],
      [userSigner.address, 123, 1]
    );
    const sig = ownerSigner.signMessage(ethers.getBytes(mintMessage));
    await c.connect(userSigner).mint(userSigner.address, 123, 1, sig);
  });
});
