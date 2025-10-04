import { BrowserRouter,Routes,Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import CanvasPage from './pages/CanvasPage';
import React from "react";
function App(){
  return(
    <BrowserRouter>
     <div className="min-h-screen bg-gray-50 font-sans">
           <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/canvas/:canvasId" element={<CanvasPage/>}/>
           </Routes>
     </div>
    </BrowserRouter>
  )
}
export default App;