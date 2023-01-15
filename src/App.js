import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GlobalContextProvider } from './contexts/GlobalContext'
import Home from './pages/Home'
import AddLecture from './pages/AddLectures'

function App() {
  return (
    <GlobalContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} exact />
          <Route path='/home' element={<Home />} exact />
          <Route path='/lectures/add' element={<AddLecture />} exact />
        </Routes>
      </BrowserRouter>
    </GlobalContextProvider>
  )
}

export default App
