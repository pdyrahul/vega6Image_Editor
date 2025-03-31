import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ImageEditor from "./Component/ImageEditor";
import ImageSearch from "./Component/ImageSearch";

const App = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <Router>
            <Routes>
                <Route 
                    path="/" 
                    element={<ImageSearch setSelectedImage={setSelectedImage} />} 
                />
                <Route 
                    path="/add-caption" 
                    element={<ImageEditor imageUrl={selectedImage} />}
                />
            </Routes>
        </Router>
    );
};

export default App;