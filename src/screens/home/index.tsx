// Functional Component and Class Components are 2 react components
// Explanation comments
// Make sure the Canvas board can be used only if content_script.js error is gone !!!
// Ref is used to store a value in react component but not re-render the component
// Revisit the functions 

// useRef - Used to directly access a DOM element. Here it is used to access the canvas element.
// useState - Used to store data that changes during the lifecycle of the component.
import { useState, useRef, useEffect } from "react";
import {SWATCHES} from '@/constants';
import { ColorSwatch } from "@mantine/core";
import {Button} from '@components/ui/button';
import axios from 'axios';

interface Response {
    expr: string;
    result: string;
    assign: boolean;
}

interface GeneratedResult {
    expression: string;
    answer: string;
}

// Everything inside Home component controls the drawing canvas.
export default function Home() {
    // Creates a reference to the canvas element.
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // Whether the user is currently drawing. It is used to track the state of the drawing.
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('rgb(255,255,255)');
    const [reset, setReset] = useState(false);
    const [result, setResult] = useState<GeneratedResult>();
    const [dictOfVars, setDictOfVars] = useState({});

    useEffect(() => {
        if(reset){
            resetCanvas();
            setReset(false);
        }
    }, [reset]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if(canvas){
           const ctx = canvas.getContext('2d');
           if(ctx){
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight - canvas.offsetTop;
            ctx.lineCap = 'round';
            ctx.lineWidth = 3;
           }
        }
    },[]); // Will take an empty array so that it does not run every time some state changes

    const resetCanvas = () => {
        const canvas = canvasRef.current;
        if(canvas){
            const ctx = canvas.getContext('2d');
            if(ctx){
                ctx.clearRect(0,0,canvas.width, canvas.height);
            }
        }
    };

    // Start drawing function runs when the user clicks on the canvas.
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        // Access the canvas element.
        const canvas = canvasRef.current;
        // If the canvas element exists, set the background color to black and get the context of the canvas.
        if(canvas){
            canvas.style.background = 'black';
            // Canvas has something called 2D context. This is what allows drawing shapes and lines.
            const ctx = canvas.getContext('2d');
            // If the context exists, begin a new path and move to the starting point of the drawing.
            if(ctx){
                ctx.beginPath();
                // This moves the drawing cursor to where the mouse clicked.
                ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                // Set the state of the drawing to true.
                setIsDrawing(true);
            }
        }
    }
    
    const stopDrawing = () => {
        setIsDrawing(false);
    }

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        // If the user is not drawing, return.
        if(!isDrawing){
            return;
        }
        // Access the canvas element.
        const canvas = canvasRef.current;
        if(canvas){
            // Get the context of the canvas.
            const ctx = canvas.getContext('2d');
            // If the context exists, set the stroke style to white and draw a line to the mouse cursor.
            if(ctx){
                // Set the stroke style to the selected color.
                ctx.strokeStyle = color;
                // Draw a line to the mouse cursor.
                ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                // Actually draws the line on the canvas.
                ctx.stroke();
            }
        }
    }
  return (
    <canvas
      ref = {canvasRef}
      id = 'canvas'
      className="absolute top-0 left-0 w-full h-full"
      onMouseDown = {startDrawing}
      onMouseMove = {draw}
      onMouseUp = {stopDrawing}
      onMouseOut = {stopDrawing}
      />
  );
}
