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
            <section>
                <div className="container mt-6">
                    <div className={styles.border}>
                        <div className={styles.awayFromBorder}>
                            <h3 className={styles.Variant}>1. Connect your MetaMask account</h3>
                        </div>
                        <div className={styles.awayFromBorder}>
                            <h3 className={styles.Variant}>2. Get random giveaway seed (you can skip this step if you are going to distribute to known addresses)</h3>
                        </div>
                        <div className={styles.awayFromBorder}>
                            <h3 className={styles.Variant}>3. Fill in all the fields and press distribute</h3>
                        </div>
                        <div className={styles.awayFromBorder}>
                            <h3 className={styles.Variant}>That's it! You have succesfully distributed the prizes!</h3>
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