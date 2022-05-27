import Head from 'next/head'
import { useEffect, useState } from 'react'
import Web3 from 'web3'
import prizeDistributorContract from '../blockchain/prizeDistributor'
import 'bulma/css/bulma.css'
import styles from '../styles/PrizeDistributor.module.css'
import Link from 'next/link';

const PrizeDistribution = () => {

    const [error, setError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    const [randomSeed, setRandomSeed] = useState('')
    const [addresses, setAddresses] = useState('')
    const [participants, setParticipants] = useState('')
    const [winnerNum, setWinnerNum] = useState('')
    const [erc20addressForRaffle, setErc20addressForRaffle] = useState('')
    const [erc20address, setErc20address] = useState('')
    const [prizeForRaffle, setPrizeForRaffle] = useState(null)
    const [prize, setPrize] = useState(null)

    const [web3, setWeb3] = useState(null)
    const [address, setAddress] = useState(null)
    const [pdContract, setPdContract] = useState(null)

    const PDContractAddress = "0xDfF4D519c31BcDC1755E1034b325Cbc3A31aEEAA"

    useEffect(() => {
        if (pdContract && address) getRandomSeedUI()
    }, [pdContract, address])

    const getRandomSeedUI = async () => {
        const tempRandomSeed = await pdContract.methods.randomWordByAddress(address).call()
        console.log(`${address} random seed is ${tempRandomSeed}`)
        setRandomSeed(tempRandomSeed)
    }

    const updateParticipants = event => {
        setParticipants(event.target.value.split(','))
        console.log("Participants: " + participants)
    }

    const updateAddresses = event => {
        setAddresses(event.target.value.split(','))
        console.log("Addresses: " + addresses)
    }

    const updatePrizeForRaffle = event => {
        setPrizeForRaffle(event.target.value)
        console.log("PrizeForRaffle: " + prizeForRaffle)
    }

    const updateWinnerNum = event => {
        setWinnerNum(event.target.value)
        console.log("WinnerNum: " + winnerNum)
    }

    const updatePrize = event => {
        setPrize(event.target.value)
        console.log("Prize: " + prize)
    }

    const updateERC20address = event => {
        setErc20address(event.target.value)
        console.log("ERC20address: " + erc20address)
    }

    const updateERC20addressForRaffle = event => {
        setErc20addressForRaffle(event.target.value)
        console.log("ERC20addressForRaffle: " + erc20addressForRaffle)
    }

    const getRandomSeed = async () => {
        try {
            await pdContract.methods.requestRandomWords().send({
                from: address,
                value: 0
            })
            setSuccessMsg(`Set random seed!`)
        } catch (err) {
            setError(err.message)
        }
    }

    const approveERC20ForRaffleHandler = async () => {
        try {
            let abi = [{ "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }]
            let contract = new web3.eth.Contract(abi, erc20addressForRaffle)
            let val = web3.utils.toWei((prizeForRaffle * winnerNum).toString(), 'ether')
            await contract.methods.approve(PDContractAddress, val).send({
                from: address
            })
            setSuccessMsg(`Approved tokens`)
        } catch (err) {
            setError(err)
        }
    }

    const approveERC20Handler = async () => {
        try {
            let abi = [{ "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }]
            let contract = new web3.eth.Contract(abi, erc20address)
            let val = web3.utils.toWei((prize * addresses.length).toString(), 'ether')
            await contract.methods.approve(PDContractAddress, val).send({
                from: address
            })
            setSuccessMsg(`Approved tokens`)
        } catch (err) {
            setError(err)
        }
    }

    const distributeERC20ToRandomWinnersHandler = async () => {
        try {
            console.log("Prize for raffle: " + prizeForRaffle)
            console.log("Winner number: " + winnerNum)
            console.log("Total value: " + prizeForRaffle * winnerNum)
            console.log("Participants: " + participants)
            await pdContract.methods.distributeERC20ToRandomAddresses(participants, winnerNum, prizeForRaffle, erc20addressForRaffle).send({
                from: address
            })
            setSuccessMsg(`Distributed!`)
        } catch (err) {
            setError(err)
        }
    }

    const distributeERC20Handler = async () => {
        try {
            let val = web3.utils.toWei(prize.toString(), 'ether')
            await pdContract.methods.distributeERC20ToAddresses(val, addresses, erc20address).send({
                from: address
            })
            setSuccessMsg(`Distributed!`)
        } catch (err) {
            setError(err)
        }
    }

    const connectWalletHandler = async () => {
        /* check if MetaMask is available */
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            try {
                /* Request wallet connect */
                await window.ethereum.request({ method: "eth_requestAccounts" })

                /* Set web3 instance */
                web3 = new Web3(window.ethereum)
                setWeb3(web3)

                /* Get list of accounts */
                const accounts = await web3.eth.getAccounts()
                setAddress(accounts[0])

                /* Change network to Rinkeby */
                await ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: web3.utils.toHex('4') }],
                })
                    .then(() => console.log('network has been set'))
                    .catch((e) => {
                        if (e.code === 4902) {
                            console.log('network is not available, add it')
                        } else {
                            console.log('could not set network')
                        }
                    })

                /* Create local contract copy */
                const pdContract = prizeDistributorContract(web3)
                setPdContract(pdContract)


            } catch (err) {
                setError(err)
            }
        } else {
            /* MetaMask not installed */
            console.log("Please install MetaMask")
        }
    }

    return (

        <div className={styles.main}>
            <Head>
                <title>ETH distribution</title>
                <meta name="description" content="Eaziest way to distribute blockchain goods for your contests/giveaways" />
            </Head>
            <nav className="navbar mt-5 mb-4 ml-0 mr-0">
                <div className="navbar-brand ml-5">
                    <h1> <div className="ml-5 mr-5"> ETH distribution </div></h1>
                </div>
                <div className={styles.DifferentDir}>
                    <Link href="/eth">
                        <a className={styles.DiffLink}>ETH</a>
                    </Link>
                </div>
                <div className={styles.DifferentDir}>
                    <Link href="/erc20">
                        <a className={styles.DiffLink}>ERC20</a>
                    </Link>
                </div>
                <div className={styles.DifferentDir}>
                    <Link href="/erc721">
                        <a className={styles.DiffLink}>ERC721</a>
                    </Link>
                </div>
                <div className={styles.DifferentDir}>
                    <Link href="/how-to">
                        <a className={styles.DiffLink}>HOW-TO</a>
                    </Link>
                </div>
                <div className="navbar-end mt-1 mr-5">
                    <button onClick={connectWalletHandler} className="button is-primary" style={{ height: 65, width: 145 }}>{address != null ? address.substring(0, 12) + "..." : "Connect wallet"}</button>
                </div>
            </nav >
            <div className="container mt-4">
                <button onClick={getRandomSeed} className="button is-primary mt-2" style={{ height: 65, width: 145 }}>{randomSeed != 0 ? `Change seed` : `Get seed`}</button>
                <p className={styles.Error}>{randomSeed != 0 ? `Your giveaway seed is ${randomSeed}` : `Get your giveaway seed before distributing to random addresses! If you have already done this, wait for confirmations (usually not more than 5 minutes).`}</p>
                <div className={styles.ChainlinkLink}>
                    <Link href="https://vrf.chain.link/rinkeby/3273"><a className={styles.ChainlinkLinkHover}>Check your confirmation process here</a></Link>
                </div>
            </div>
            <section>
                <div className="container mt-6">
                    <div className={styles.border}>
                        <div className={styles.awayFromBorder}>
                            <h2 className={styles.Variant}>Random addresses out of participants</h2>

                            <h3><div>Paste your participants CSV text here (Without spaces)</div></h3>
                            <div className="CSVInput">
                                <input onChange={updateParticipants} className="input mt-3" type="type" placeholder="0xC55CA7b3Abb59BecA63DDD4D422bC02B173dBba6,0x68A1437782411d73AF32d5Ba4d450fD9D46aA530,..." ></input>
                            </div>
                            <div className={styles.EachWinnerPrize}>
                                <h3 className="mt-3">Winner number</h3>
                                <input onChange={updateWinnerNum} className="input mt-3" type="type" placeholder="4" rows="1"></input>
                            </div>
                            <div className={styles.EachWinnerPrize}>
                                <h3 className="mt-3">What's the prize for each winner? (18 decimals)</h3>
                                <input onChange={updatePrizeForRaffle} className="input mt-3" type="type" placeholder="0.005" rows="1"></input>
                            </div>
                            <div className="ERC20AddressForRaffleInput">
                                <h3 className="mt-3">ERC20 address</h3>
                                <input onChange={updateERC20addressForRaffle} className="input mt-3" type="type" placeholder="0xfab46e002bbf0b4509813474841e0716e6730136" rows="1"></input>
                            </div>
                            <nav className="navbar mt-5 mb-4 ml-0 mr-0">
                                <div className="navbar-brand ml-5">
                                    <button onClick={approveERC20ForRaffleHandler} className="button is-primary mt-3 mb-3" style={{ height: 65, width: 290 }}>Approve ERC20</button>
                                </div>
                                <div className="navbar-end mt-1 mr-5">
                                    <button onClick={distributeERC20ToRandomWinnersHandler} className="button is-primary mt-3 mb-3" style={{ height: 65, width: 290 }}>Distribute ERC20 to addresses</button>
                                </div>

                            </nav >
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="container ml- mt-6">
                    <div className={styles.border}>
                        <div className={styles.awayFromBorder}>
                            <h2 className={styles.Variant}>Known addresses</h2>
                            <h3><div>Paste your CSV text here (Without spaces)</div></h3>
                            <div className="CSVInput">
                                <input onChange={updateAddresses} className="input mt-3" type="type" placeholder="0xC55CA7b3Abb59BecA63DDD4D422bC02B173dBba6,0x68A1437782411d73AF32d5Ba4d450fD9D46aA530,..." ></input>
                            </div>
                            <div className={styles.EachWinnerPrize}>
                                <h3 className="mt-3">What's the prize for each winner? (18 decimals)</h3>
                                <input onChange={updatePrize} className="input mt-3" type="type" placeholder="0.005" rows="1"></input>
                            </div>
                            <div className="ERC20AddressInput">
                                <h3 className="mt-3">ERC20 address</h3>
                                <input onChange={updateERC20address} className="input mt-3" type="type" placeholder="0xfab46e002bbf0b4509813474841e0716e6730136" rows="1"></input>
                            </div>
                            <nav className="navbar mt-5 mb-4 ml-0 mr-0">
                                <div className="navbar-brand ml-5">
                                    <button onClick={approveERC20Handler} className="button is-primary mt-3 mb-3" style={{ height: 65, width: 290 }}>Approve ERC20</button>
                                </div>
                                <div className="navbar-end mt-1 mr-5">
                                    <button onClick={distributeERC20Handler} className="button is-primary mt-3 mb-3" style={{ height: 65, width: 290 }}>Distribute ERC20 to addresses</button>
                                </div>
                            </nav >
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="container has-text-danger">
                    <p className={styles.Error}>{error.message}</p>
                </div>
            </section>
            <section>
                <div className="container has-text-success">
                    <p className={styles.Success}>{successMsg}</p>
                </div>
            </section>
            <div className="mb-5"> </div>
            <style jsx>{`
                    .navbar {
                      background: rgba(255, 255, 255, 0.5);
                    }
                    p {
                      font-size: 1.5em;
                      font-weight: 700
                    }
            `}</style>
        </div >
    )
}

export default PrizeDistribution;