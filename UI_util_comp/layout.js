import styles from '../styles/Home.module.css'
import Link from 'next/link'

const Layout = ({ children }) => {
    return (
        <div>
            <h1 className={styles.main_header}>Virual<h1>MarketPlace</h1></h1>
            <nav>
                <ul className={styles.navbarlist}>
                    <li>
                        <Link href='/' passHref><a>Home</a></Link>
                    </li>

                    <li>
                        <Link href='/sell-item' passHref><a>Sell Digital Asset</a></Link>
                    </li>

                    <li>
                        <Link href='/my-assets' passHref><a>My Digital Asset</a></Link>
                    </li>

                    <li>
                        <Link href='/create-asset' passHref><a>Create Digital Asset</a></Link>
                    </li>
                </ul>
            </nav>
            {children}
        </div>
    )
};

export default Layout;