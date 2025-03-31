import React, { useEffect, useRef, useState } from "react";
import { Button, List, ListItem, Typography } from "@mui/material";
import { fabric } from "fabric";
import { useNavigate } from "react-router-dom"; // Add navigation

const ImageEditor = ({ imageUrl }) => {
    const canvasRef = useRef(null);
    const fabricCanvasRef = useRef(null);
    const [canvasLayers, setCanvasLayers] = useState([]);
    const navigate = useNavigate(); // For closing editor

    useEffect(() => {
        // Use imageUrl directly, falling back to localStorage if needed
        const savedImageUrl = imageUrl || localStorage.getItem("selectedImage");

        // Initialize canvas only if it doesn’t exist
        if (!fabricCanvasRef.current) {
            const canvas = new fabric.Canvas(canvasRef.current, {
                width: 500,
                height: 500,
                backgroundColor: "lightgray",
            });
            fabricCanvasRef.current = canvas;

            // Attach event listeners only once
            canvas.on("object:added", updateLayers);
            canvas.on("object:modified", updateLayers);
            canvas.on("object:removed", updateLayers);
        }

        const canvas = fabricCanvasRef.current;

        // Clear the canvas before adding a new image
        canvas.clear();
        canvas.setBackgroundColor("lightgray", canvas.renderAll.bind(canvas));

        // Load the image if available
        if (savedImageUrl) {
            fabric.Image.fromURL(
                savedImageUrl,
                (img) => {
                    if (!fabricCanvasRef.current) return;

                    img.scaleToWidth(400);
                    img.set({ left: 50, top: 50 });

                    canvas.add(img);
                    canvas.setActiveObject(img);
                    canvas.renderAll();
                    updateLayers();
                },
                { crossOrigin: "anonymous" }
            );
        }

        // Cleanup on unmount
        return () => {
            if (fabricCanvasRef.current) {
                fabricCanvasRef.current.dispose();
                fabricCanvasRef.current = null;
            }
        };
    }, [imageUrl]); // Dependency on imageUrl

    const updateLayers = () => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const objects = canvas.getObjects().map((obj, index) => ({
            id: index + 1,
            type: obj.type,
            left: obj.left,
            top: obj.top,
            width: obj.width || null,
            height: obj.height || null,
            text: obj.text || null,
            fill: obj.fill || null,
            fontSize: obj.fontSize || null,
            radius: obj.radius || null,
        }));

        setCanvasLayers(objects);
        console.log("Canvas Layers:", objects);
    };

    const addText = () => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const text = new fabric.IText("Type Here", {
            left: 100,
            top: 100,
            fontSize: 24,
            fill: "black",
            fontFamily: "Arial",
            editable: true,
        });

        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
        updateLayers();
    };

    const addShape = (shapeType) => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        let shape;
        switch (shapeType) {
            case "circle":
                shape = new fabric.Circle({
                    left: 150,
                    top: 150,
                    radius: 50,
                    fill: "red",
                });
                break;
            case "rectangle":
                shape = new fabric.Rect({
                    left: 100,
                    top: 100,
                    width: 120,
                    height: 80,
                    fill: "blue",
                });
                break;
            case "triangle":
                shape = new fabric.Triangle({
                    left: 120,
                    top: 120,
                    width: 100,
                    height: 100,
                    fill: "green",
                });
                break;
            default:
                return;
        }

        canvas.add(shape);
        canvas.setActiveObject(shape);
        canvas.renderAll();
        updateLayers();
    };

    const removeSelected = () => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.remove(activeObject);
            canvas.discardActiveObject();
            canvas.renderAll();
            updateLayers();
        }
    };

    const downloadImage = () => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const dataURL = canvas.toDataURL({
            format: "png",
            quality: 1.0,
        });

        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "edited-image.png";
        link.click();
    };

    const handleClose = () => {
        localStorage.removeItem("selectedImage"); // Clear saved image
        navigate("/"); // Navigate back to search
    };

    return (
        <>
            <h1 style={{ textAlign: "center" }}>ADD Caption</h1>
            <div style={{ display: "flex", gap: "20px", width: "1200px", margin: "auto" }}>
                <div>
                    <canvas ref={canvasRef} />
                </div>
                <div style={{ marginTop: "10px", width: "40%" }}>
                    <Button variant="contained" onClick={addText} style={{ margin: "5px" }}>
                        Add Text
                    </Button>
                    <Button variant="contained" onClick={() => addShape("circle")} style={{ margin: "5px" }}>
                        Add Circle
                    </Button>
                    <Button variant="contained" onClick={() => addShape("rectangle")} style={{ margin: "5px" }}>
                        Add Rectangle
                    </Button>
                    <Button variant="contained" onClick={() => addShape("triangle")} style={{ margin: "5px" }}>
                        Add Triangle
                    </Button>
                    <Button variant="contained" color="error" onClick={removeSelected} style={{ margin: "5px" }}>
                        Remove Selected
                    </Button>
                    <Button variant="contained" color="primary" onClick={downloadImage} style={{ margin: "5px" }}>
                        Download Image
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleClose}
                        style={{ margin: "5px" }}
                    >
                        Close Editor
                    </Button>
                </div>
            </div>
            <div style={{ marginTop: "20px", textAlign: "left" }}>
                <Typography variant="h6">Canvas Layers:</Typography>
                <List>
                    {canvasLayers.map((layer) => (
                        <ListItem key={layer.id}>
                            {layer.type} at ({layer.left}, {layer.top})
                        </ListItem>
                    ))}
                </List>
            </div>
        </>
    );
};

export default ImageEditor;