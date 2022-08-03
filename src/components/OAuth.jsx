import { useLocation, useNavigate } from 'react-router-dom'
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth'
import googleIcon from '../assets/svg/googleIcon.svg'
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
function OAuth() {
  const navigate = useNavigate()
  const location = useLocation()
  const onGoogleClick = async () => {
    try {
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      // user check
      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)
      //create user if doesnt exit
      if (!docSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        })
      }
      navigate('/')
    } catch (error) {
      toast.error('Could not authorize with Google')
    }
  }
  return (
    <div className="socialLogin">
      <p>
        Sign {location.pathname === '/sign-up' ? 'Up' : 'In'} with
      </p>
      <button className="socialIconDiv" onClick={onGoogleClick}>
        <img
          className="socialIconImg"
          src={googleIcon}
          alt="google"
        />
      </button>
    </div>
  )
}

export default OAuth
