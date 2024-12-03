import React from 'react'
import { useState } from 'preact/hooks'

import useAppState from 'lib/appState'
import { locationToGroupMap } from 'lib/router'
import {
  getGroupsAndFilteredContractsFromTopContracts,
  onContractClick,
  getLabels,
} from 'lib/topContractHelpers'
import { colorSet, colorSet2, colorSet3 } from 'lib/chartHelpers'

import BarChart from 'components/BarChart'
import Spinner from 'components/Spinner'
import vimworldIcon from 'assets/vimworld_icon.jpg'
import vimworldBanner from 'assets/vimworld_banner.png'
import vulcanIcon from 'assets/vulcan_icon.png'
import vulcanBanner from 'assets/vulcan_banner.png'
import veseaIcon from 'assets/vesea_icon.png'
import veseaBanner from 'assets/vesea_banner.png'
import vseaIcon from 'assets/vsea_icon.png'
import diceBanner from 'assets/dice_banner.png'
import diceIcon from 'assets/dice_icon.png'
import vechainBanner from 'assets/vechain_banner.png'
import vechainIcon from 'assets/vet.png'
import threedablesBanner from 'assets/3dables_banner.png'
import threedablesIcon from 'assets/3dables_icon.png'
import vebetterdaoBanner from 'assets/vebetterdao.png'
import vebetterdaoIcon from 'assets/b3tr.png'
import worldofvBanner from 'assets/wov_banner.png'
import worldofvIcon from 'assets/wov.png'
import goldenempireBanner from 'assets/goldenempirebanner.png'
import goldenempireIcon from 'assets/goldenempire.png'
import squadBanner from 'assets/squadbanner.png'
import squadIcon from 'assets/squadlogo.png'
import blackvBanner from 'assets/blackvbanner.png'
import blackvIcon from 'assets/blackv.png'
import betterswapBanner from 'assets/betterswap.png'
import betterswapIcon from 'assets/betterswap.jpg'
import './index.sass'

export default function ContractGroupPage({}) {
  const [imageLoading, setImageLoading] = useState(true)
  const groupName = locationToGroupMap[window.location.pathname]
  const topContracts = useAppState(s => s.topContracts)
  if (!topContracts.length) return <div className="ContractGroupPage"><Spinner /></div>

  const { groups, filteredContracts } = getGroupsAndFilteredContractsFromTopContracts(topContracts)
  const group = groups[groupName]

  let className = 'ContractGroupPage'
  if (imageLoading) className += ' ContractGroupPage-loading'

  return <div className={className}>
    <ContractGroup {...{
      name: groupName,
      activeContracts: group.activeContracts,
      type: 'burn',
      setImageLoading,
      imageLoading,
    }} />
  </div>
}

const groupProfileProps = {
  'VIMworld': {
    banner: vimworldBanner,
    logo: vimworldIcon,
    url: 'https://vimworld.com/',
    bio: 'VIMworld is a smart NFT platform for collectibles digital characters',
  },
  'Vulcan': {
    banner: vulcanBanner,
    logo: vulcanIcon,
    url: 'https://vulcanverse.com/',
    bio: 'VulcanVerse is a virtual world set in the Greco-Roman era utilizing blockchain to enable users to own land and assets',
  },
  'VeSea': {
    banner: veseaBanner,
    logo: veseaIcon,
    url: 'https://vesea.io/',
    bio: 'VeSea is the most active NFT marketplace, Launchpad and NFT Event Ecosystem on VeChain. Buy, sell and interact with your favorite NFTs today ',
  },
  'VSEA Token': {
    banner: veseaBanner,
    logo: vseaIcon,
    url: 'https://vesea.io/',
    bio: 'VeSea is the most active NFT marketplace, Launchpad and NFT Event Ecosystem on VeChain. Buy, sell and interact with your favorite NFTs today ',
  },
  'Satoshi Dice': {
    banner: diceBanner,
    logo: diceIcon,
    url: 'https://vechainnfts.shinyapps.io/Satoshi_Dice/',
    bio: 'A fun game that serves as a mechanism for lowering the supply of $VSEA. Risk $VSEA to earn $VSEA!',
  },
  'ToolChain Partners': {
    banner: vechainBanner,
    logo: vechainIcon,
    url: 'https://www.veworld.com/home',
    bio: 'A lightweight and rapidly deployable sustainable traceability application that allows brands to record all their sustainable footprints throughout their supply chain.',
  },
  '3DAbles': {
    banner: threedablesBanner,
    logo: threedablesIcon,
    url: 'https://3dables.smuzzies.com/',
    bio: '3DAbles is a dApp that allows a collection holder in the VeChain Thor blockchain to create prestaged artwork using the NFTs the holder owns. No longer does your NFT have to remain dormant in your wallet.',
  },
  'VeBetterDAO': {
    banner: vebetterdaoBanner,
    logo: vebetterdaoIcon,
    url: 'https://vebetterdao.org/',
    bio: 'VeBetterDAO aims to take sustainability mainstream by unlocking value of collective sustainable actions. Join now and be better.',
  },
  'WorldOfV': {
    banner: worldofvBanner,
    logo: worldofvIcon,
    url: 'https://worldofv.art/',
    bio: 'World of V is the zero-fee, green NFT marketplace built on the VeChain blockchain that aims to build a safe, entertaining space for digital creators and art enthusiasts across the world. We strongly believe in the power of a community-driven, inclusive movement committed to shape a culture where environmental sustainability and accessibility are core principles.',
  },
  'The Golden Empire': {
    banner: goldenempireBanner,
    logo: goldenempireIcon,
    url: 'https://thegoldenempire.art/',
    bio: 'Play, quest, stake, and earn as you delve into the riches of the Golden Empire through stunning NFTs. Shape your journey, accumulate rewards, and become part of an evolving legacy. Join the Golden Empire, where history, innovation, and rewards unite in a golden fusion on the VeChain blockchain. Golden Empire offers an unparalleled NFT experience, blending historical intrigue with modern blockchain technology. It is an invitation to explore, learn, and grow within a community that values both past and future.',
  },
  'Turtle Labs': {
    banner: squadBanner,
    logo: squadIcon,
    url: 'https://squadvechain.art/',
    bio: 'Collect unique NFTs, engage in gamified challenges, and earn tokens as you play. Join the squad and turn your memes into a winning streak!',
  },
  'Black VeMarket': {
    banner: blackvBanner,
    logo: blackvIcon,
    url: 'https://squadvechain.art/',
    bio: 'Your premier destination for exclusive, premium-quality NFTs tailored for discerning collectors. Specializing in unique, high-end digital art and collectibles, BlackVeMarket offers an unparalleled shopping experience with curated NFT collections that emphasize sophistication and innovation. Whether you aree looking for rare digital art pieces, cutting-edge collectibles, or unique virtual assets.',
  },
  'BetterSwap': {
    banner: betterswapBanner,
    logo: betterswapIcon,
    url: 'https://swap.tbc.vet/',
    bio: 'BetterSwaps Pool2Earn initiative aims to establish a robust financial ecosystem for sustainable tokens on VeChain. Through our DEX Aggregator, users who allocate their B3TR tokens to our Liquidity Pool will receive rewards.',
  },
}

function GroupProfile({ banner, logo, url, bio, setImageLoading }){
  return <div className="ContractGroupPage-GroupProfile">
    <img
      src={banner} className="ContractGroupPage-GroupProfile-banner"
      onLoad={() => { setImageLoading(false) }}
    />
    <div className="ContractGroupPage-GroupProfile-logoContainer">
      <img src={logo} className="ContractGroupPage-GroupProfile-logo" />
    </div>
    <div className="ContractGroupPage-GroupProfile-bioAndUrl">
      <div>{bio}</div>
      <a href={url} target="_blank">{url}</a>
    </div>
  </div>
}

function ContractGroup({ name, activeContracts, setImageLoading, imageLoading }) {
  const vthoPrice = useAppState((s) => s.prices.vtho);

  // Create a new array with valid vthoBurn and usdBurned values
  const contractsWithValidValues = activeContracts.map((contract) => {
    const vthoBurn = contract.vthoBurn;
    const isValidVthoBurn = typeof vthoBurn === 'number' && isFinite(vthoBurn);
    const usdBurned = isValidVthoBurn ? vthoBurn * vthoPrice : 0;

    return {
      ...contract,
      validVthoBurn: isValidVthoBurn ? vthoBurn : 0,
      usdBurned,
    };
  });

  const burnContracts = [...contractsWithValidValues].sort((a, b) => b.validVthoBurn - a.validVthoBurn);
  const burnDataPoints = {
    labels: getLabels(burnContracts, 'validVthoBurn'),
    datasets: [{
      label: 'VTHO Burn by Contract',
      backgroundColor: colorSet,
      data: burnContracts.map(contract => contract.validVthoBurn),
    }]
  };

  const clausesContracts = [...contractsWithValidValues].sort((a, b) => b.clauses - a.clauses);
  const clausesDataPoints = {
    labels: getLabels(clausesContracts, 'clauses'),
    datasets: [{
      label: 'Clauses by Contract',
      backgroundColor: colorSet2,
      data: clausesContracts.map(contract => contract.clauses),
    }]
  };

  const usdBurnContracts = [...contractsWithValidValues].sort((a, b) => b.usdBurned - a.usdBurned);
  const usdBurnDataPoints = {
    labels: getLabels(usdBurnContracts, 'usdBurned', '$'),
    datasets: [{
      label: `USD VTHO Burn by Contract (VTHO Price: $${vthoPrice})`,
      backgroundColor: colorSet3,
      data: usdBurnContracts.map(contract => contract.usdBurned),
    }]
  };

  const profileProps = groupProfileProps[name];

  return (
    <div className="ContractGroupPage-ContractGroup">
      {imageLoading && profileProps && <Spinner />}
      {profileProps && <GroupProfile {...{ ...profileProps, setImageLoading }} />}
      <div className="ContractGroupPage-ContractGroup-header">
        {name} Contracts
      </div>
      <div
        className="ContractGroupPage-chart"
        onClick={onContractClick({ contracts: burnContracts })}
      >
        <BarChart {...{
          data: burnDataPoints,
          height: burnContracts.length * 80,
        }} />
      </div>
      <div
        className="ContractGroupPage-chart"
        onClick={onContractClick({ contracts: clausesContracts })}
      >
        <BarChart {...{
          data: clausesDataPoints,
          height: clausesContracts.length * 80,
        }} />
      </div>
      <div
        className="ContractGroupPage-chart"
        onClick={onContractClick({ contracts: usdBurnContracts })}
      >
        <BarChart {...{
          data: usdBurnDataPoints,
          height: usdBurnContracts.length * 80,
        }} />
      </div>
    </div>
  );
}