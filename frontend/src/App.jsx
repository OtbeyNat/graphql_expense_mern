import { Route, Routes } from "react-router-dom";

import Home from './pages/Home';
import Login from './pages/LogIn';
import SignUp from './pages/SignUp';
import Transaction from './pages/Transaction';
import NotFound from './pages/NotFound';
import Header from './components/ui/Header'

function App() {
	const authUser = true;
	return (
		<>
			{authUser && <Header />}
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/login' element={<Login />} />
				<Route path='/signup' element={<SignUp />} />
				<Route path='/transaction/:id' element={<Transaction />} />
				<Route path='*' element={<NotFound />} />
			</Routes>
		</>
	);
}
export default App;
