const { expect } = require("chai");

describe("CharityChain", function () {
  async function campaignFixture() {
    const [admin, organization, donor] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("CharityChain");
    const charity = await Contract.deploy();
    await charity.verifyOrganization(organization.address, true);
    const deadline = (await ethers.provider.getBlock("latest")).timestamp + 3600;
    await charity.connect(organization).createCampaign(ethers.parseEther("10"), deadline, "ipfs://campaign-proof");
    return { charity, admin, organization, donor };
  }

  it("lets verified organizations create campaigns and receive donations", async function () {
    const { charity, organization, donor } = await campaignFixture();
    await expect(() => charity.connect(donor).donate(1, { value: ethers.parseEther("1") }))
      .to.changeEtherBalances([donor, organization], [ethers.parseEther("-1"), ethers.parseEther("1")]);
    expect((await charity.campaigns(1)).raisedAmount).to.equal(ethers.parseEther("1"));
  });

  it("blocks donations while paused and permits the organization to close a campaign", async function () {
    const { charity, organization, donor } = await campaignFixture();
    await charity.connect(organization).pauseCampaign(1);
    await expect(charity.connect(donor).donate(1, { value: ethers.parseEther("1") })).to.be.revertedWith("Campaign unavailable");
    await charity.connect(organization).closeCampaign(1);
    expect((await charity.campaigns(1)).active).to.equal(false);
  });
});
