import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";


export default function Navbar() {
  const { user, username } = useContext(UserContext);

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/" passHref>
            <button className="btn-logo">Feed</button>
          </Link>
        </li>
        {/* user is signed in and has a user name */}
        {username && (
          <>
            <li>
              <Link href="/admin" passHref>
                <button className="btn-blue">Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`} passHref>
                <img src={user?.photoURL} alt="" />
              </Link>
            </li>
          </>
        )}

        {/* user is not signed in or has not created username */}

        {!username && (
          <li>
            <Link href="/enter" passHref>
              <button className="btn-blue">Log in</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
