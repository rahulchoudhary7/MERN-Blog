import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

export default function PrivateRoute() {
  const userState = useSelector(state => state.user)

  return userState.currentUser ? <Outlet /> : <Navigate to='/signin' />
}
