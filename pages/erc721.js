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
    const [erc721addressForRaffle, setErc721addressForRaffle] = useState('')
    const [erc721address, setErc721address] = useState('')
    const [tokenIDsForRaffle, setTokenIDsForRaffle] = useState(null)
    const [tokenIDs, setTokenIDs] = useState('')
    const [currentTokenIDForRaffle, setCurrentTokenIDForRaffle] = useState()

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

    const updateTokenIDsForRaffle = event => {
        setTokenIDsForRaffle(event.target.value.split(','))
        if (typeof currentTokenIDForRaffle === 'undefined' && tokenIDsForRaffle != null)
            setCurrentTokenIDForRaffle(tokenIDsForRaffle[0]);
    }

    const updateWinnerNum = event => {
        setWinnerNum(event.target.value)
        console.log("WinnerNum: " + winnerNum)
    }

    const updateTokenIDs = event => {
        setTokenIDs(event.target.value.split(','))
        console.log("TokenIDs: " + prize)
    }

    const updateERC721address = event => {
        setErc721address(event.target.value)
        console.log("ERC721address: " + erc721address)
    }

    const updateERC721addressForRaffle = event => {
        setErc721addressForRaffle(event.target.value)
        console.log("ERC721addressForRaffle: " + erc721addressForRaffle)
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

    const approveERC721ForRaffleHandler = async () => {
        try {
            let abi = [{ "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]
            let contract = new web3.eth.Contract(abi, erc721addressForRaffle)
            console.log(PDContractAddress, currentTokenIDForRaffle)
            await contract.methods.approve(PDContractAddress, currentTokenIDForRaffle).send({
                from: address
            })
            console.log("YES")
            index = tokenIDsForRaffle.indexOf(currentTokenIDForRaffle);
            setSuccessMsg(`Approved token #${currentTokenIDForRaffle}`)
            if (index == tokenIDsForRaffle.length - 1) {
                setCurrentTokenIDForRaffle('Everything confirmed!');
                return;
            }
            if (index >= 0)
                setCurrentTokenIDForRaffle(tokenIDsForRaffle[index + 1]);

        } catch (err) {
            console.log(err.message)
            setError(err)
        }
    }

    const approveERC721Handler = async () => {
        try {
            let abi = [{ "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]
            let contract = new web3.eth.Contract(abi, erc721address)
            let val = web3.utils.toWei((prize * addresses.length).toString(), 'ether')
            await contract.methods.approve(PDContractAddress, val).send({
                from: address
            })
            setSuccessMsg(`Approved tokens`)
        } catch (err) {
            setError(err)
        }
    }

    const distributeERC721ToRandomWinnersHandler = async () => {
        try {
            console.log("Prize for raffle: " + prizeForRaffle)
            console.log("Winner number: " + winnerNum)
            console.log("Total value: " + prizeForRaffle * winnerNum)
            console.log("Participants: " + participants)
            await pdContract.methods.distributeERC20ToRandomAddresses(participants, tokenIDsForRaffle, erc20addressForRaffle).send({
                from: address
            })
            setSuccessMsg(`Distributed!`)
        } catch (err) {
            setError(err)
        }
    }

    const distributeERC721Handler = async () => {
        try {
            await pdContract.methods.distributeERC721ToAddresses(addresses, tokenIDs, erc721address).send({
                from: address
            })
            setSuccessMsg(`Distributed! ${tokenIDs.length} ERC721!`)
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
                            <h2 className={styles.Variant}>Under construction...</h2>
                        </div>
                    </div>
                </div>
            </section>
            <style jsx>{`
                    .navbar {
                      background: rgba(255, 255, 255, 0.5);
                    }
                    p {
                      font-size: 1.5em;
                      font-weight: 700
                    }
            `}</style>
        </div>
    )
}

export default PrizeDistribution;