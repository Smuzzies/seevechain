import React from 'react'
import { Fragment } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import QRCode from 'qrcode.react'
import { useLocalStorage } from 'lib/storageHooks'

import { getVerticalScrollParent } from 'lib/DOMHelpers'
import useAppState from 'lib/appState'
import { setPathname } from 'lib/location'
import useToggle from 'lib/useToggleHook'
import { locationToGroupMap, allRoutes } from 'lib/router'
import { locationToChartMap } from 'lib/router'

import Dropdown from 'components/Dropdown'
import CopyButton from 'components/CopyButton'
import Modal from 'components/Modal'
import Icon from 'components/Icon'
import ContractGroupPage from 'components/ContractGroupPage'
import useForceUpdate from 'lib/useForceUpdateHook'
import useWindowEventListener from 'lib/useWindowEventListenerHook'

import './index.sass'

export default function PageModal({ setVisibility, open }) {
  const [donateVisible, showDonate, hideDonate, toggleDonate] = useToggle(false) // eslint-disable-line
  const forcePageUpdate = useForceUpdate()
  const donateRef = useRef()

  useWindowEventListener('popstate', () => {
    if (!allRoutes.includes(window.location.pathname)) setVisibility(false)
    forcePageUpdate()
  })

  const [storedChartPath, setStoredChartPath] = useLocalStorage()
  let matchingChart = locationToChartMap[window.location.pathname]
  const matchingGroup = locationToGroupMap[window.location.pathname]

  useEffect(() => {
    if (matchingGroup) return
    if (!matchingChart) {
      setPathname(storedChartPath || '/burn')
    }
    if (
      matchingChart &&
      window.location.pathname !== storedChartPath
    ) {
      setStoredChartPath(window.location.pathname)
    }
  }, [window.location.pathname, matchingGroup])

  const CurrentChart = (
    matchingChart ||
    locationToChartMap[storedChartPath] ||
    locationToChartMap['/burn']
  ).component

  return <Modal {...{
    open,
    setVisibility: value => {
      if (open) setPathname('/')
      setVisibility(value)
    },
    className: "PageModal",
  }}>
    <Icon
      size="xl"
      type="left-chevron"
      className="PageModal-backButton"
      onClick={() => { window.history.back() }}
    />
    <Prices />
    <Dropdown {...{
      placeholder: matchingGroup,
      value: matchingGroup ? undefined : (storedChartPath || '/burn'),
      options: Object.keys(locationToChartMap).map(key => ({
        value: key,
        display: locationToChartMap[key].title,
      })),
      onChange: value => {
        setStoredChartPath(value)
        setPathname(value)
        forcePageUpdate()
      },
      fullWidth: true,
    }} />
    {locationToGroupMap[window.location.pathname]
      ? <ContractGroupPage />
      : <CurrentChart {...{forcePageUpdate}}/>
    }
    <Donate {...{ toggleDonate, donateRef, donateVisible }} />
  </Modal>
}

function Donate({ toggleDonate, donateRef, donateVisible }) {
  return <Fragment>
    <div  {...{
      className: 'PageModal-donate',
      ref: donateRef,
      onClick: () => {
        toggleDonate()
        window.setTimeout(
          () => {
            if (!donateVisible && donateRef.current) {
              const scrollParent = getVerticalScrollParent(donateRef.current)
              scrollParent.scrollTop = scrollParent.scrollHeight
            }
          },
          0
        )
      },
    }} >
      Support the Better Collective Team&nbsp;
      <Icon type={donateVisible ? 'down-chevron' : 'right-chevron'} />
    </div>
    {donateVisible &&
      <div className="PageModal-donateWrapper">
        <div className="PageModal-address">
          <input value="0x9b1732D8b2E29397879483Bf9aD38EC75bBAEB20" />
          <CopyButton copyValue="0x9b1732D8b2E29397879483Bf9aD38EC75bBAEB20" />
        </div>
        <div className="PageModal-currencyMessage">
          Send VET, VTHO, or any VIP180 token
        </div>
        <QRCode
          className="PageModal-qrCode"
          value="0x9b1732D8b2E29397879483Bf9aD38EC75bBAEB20"
          size={128}
          bgColor="#ffffff"
          fgColor="#182024"
          level="L"
          includeMargin={false}
          renderAs="svg"
        />
      </div>
    }
  </Fragment>
}

function Prices() {
  const prices = useAppState(s => s.prices); // Ensure this is fetching the updated prices correctly

  // Check if prices are available to avoid errors on initial render
  if (!prices || !prices.vet || !prices.vtho) {
      return <div>Loading prices...</div>;
  }

  return <div className="PageModal-prices">
    <span>
      VET
      <span className="PageModal-prices-price">${prices.vet.toFixed(5)}</span> {/* Ensure this reflects how prices are structured */}
    </span>
    <span className="PageModal-prices-middle">
      VTHO/VET
      <span className="PageModal-prices-price PageModal-prices-middle-price">
        {(prices.vtho / prices.vet).toFixed(4)} {/* Ensure calculation is correct based on how prices are stored */}
      </span>
    </span>
    <span>
      VTHO
      <span className="PageModal-prices-price">${prices.vtho.toFixed(5)}</span> {/* Adjust as needed */}
    </span>
  </div>
}

function ServerTime() {
  const serverTime = useAppState(s => s.serverTime)
  return <div>
    Server time: {serverTime} (UTC+2)
  </div>
}
