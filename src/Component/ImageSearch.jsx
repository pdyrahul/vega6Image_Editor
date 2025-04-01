import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Grid, Card, CardMedia } from "@mui/material";
import { useNavigate } from "react-router-dom";
const ImageSearch = ({ setSelectedImage }) => {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [error, setError] = useState(null);
    const [images, setImages] = useState([]);
    const apiUrl = import.meta.env.VITE_APP_API_URL;
    const unsplashKey = import.meta.env.VITE_UNSPLASH_API_KEY;
    const fetchImages = async () => {
        try {
            const response = await axios.get(`${apiUrl}/search/photos`, {
                params: { query, per_page: 8 },
                headers: { Authorization: `Client-ID ${unsplashKey}` },
            });
            setImages(response.data.results);
        } catch (error) {
            console.error("Error fetching images:", error);
            setError(error);
        }
    };

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <TextField
                label="Search Images"
                variant="outlined"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ marginRight: "10px" }}
                size="small"
            />
            <Button variant="contained" color="primary" onClick={fetchImages}>
                Search
            </Button>
            <Grid container spacing={10} style={{ marginTop: "20px" }}>
                {images.map((image) => (
                    <Grid item xs={4} sm={4} md={4} lg={4} key={image.id}>
                        <Card>
                            <CardMedia
                                component="img"
                                image={image.urls.small}
                                alt={image.alt_description}
                                style={{ width: 300, height: 300, objectFit: "cover" }}
                            />
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => {
                                    const fullImageUrl = image.urls.full;
                                    localStorage.setItem("selectedImage", fullImageUrl); // Consistent URL
                                    setSelectedImage(fullImageUrl); // Sync with state
                                    navigate("/add-caption");
                                }}
                                style={{ margin: "10px" }}
                            >
                                Add Caption
                            </Button>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {error && <p style={{color:"#c11", fontWeight:"600"}}>Error: {error.message}</p>}
        </div>
    );
};

export default ImageSearch;